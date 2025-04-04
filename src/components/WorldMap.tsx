import { useEffect, useRef } from "react";
import "./WorldMap.css";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { setMapZoomed } from "../state/slices/mapInteractionSlice";
import mapboxgl, { GeoJSONSource, MapMouseEvent } from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import { getFilteredData } from "../state/slices/dataSlice";
import { fetchMapData } from "../helpers/fetchGeoJSON";
import {
  setCurrentUniversity,
  setCurrentUniversityGeoJSON,
} from "../state/slices/uniSelectionSlice";

export interface IStudiabilityFeatureProperties {
  university_id: number;
  university_name: string;
  university_website?: string;
}

export const WorldMap = ({
  width,
  height,
}: {
  width?: number;
  height?: number;
}) => {
  // const mapToken = import.meta.env.VITE_MAP_BOX_TOKEN;
  const mapToken =
    "pk.eyJ1IjoidG95dWt0aCIsImEiOiJjbTd5d2V3czIwY2F3MmpzYTA4b2x4d3EwIn0.zZv52q9VqahrIq6dturYUQ";

  const dispatch = useAppDispatch();

  const filteredData = useAppSelector(getFilteredData);
  const allData = useAppSelector((state) => state.data.universities);
  const currentUniSelectedGeoJSON = useAppSelector(
    (state) => state.uniSelection.currenUniversityGeoJSON
  );

  const zoomed = useAppSelector((state) => state.mapInteraction.mapZoomed);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const popUpRefs = useRef<mapboxgl.Popup[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = mapToken;

    mapRef.current = new mapboxgl.Map({
      projection: "mercator",
      renderWorldCopies: false,
      container: mapContainerRef.current,
      style: "mapbox://styles/toyukth/cm81ddad500zk01qu1p9ydafi",
      center: [0, 70],
      zoom: 0,
    });

    mapRef.current.on("load", async () => {
      if (!mapRef.current) return;

      const rawData = await fetchMapData(filteredData.filteredUniversities);

      mapRef.current.addSource("uni_locations", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: rawData,
        },
        cluster: true,
        clusterMaxZoom: 30,
        clusterRadius: 50,
      });

      mapRef.current.addLayer({
        id: "clusters",
        type: "circle",
        source: "uni_locations",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#517F96",
            100,
            "#D37D6C",
            750,
            "#DCAB97",
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40,
          ],
        },
      });

      mapRef.current.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "uni_locations",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });

      mapRef.current.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "uni_locations",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#11b4da",
          "circle-radius": 4,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });

      // inspect a cluster on click
      mapRef.current.on("click", "clusters", (e) => {
        if (!mapRef.current) return;

        const features = mapRef.current.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        if (!features[0].properties) return;

        const clusterId = features[0].properties.cluster_id;

        const source = mapRef.current.getSource(
          "uni_locations"
        ) as GeoJSONSource;

        if (!source) return;

        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;

          if (!mapRef.current) return;

          const geometry = features[0].geometry as GeoJSON.Point;

          mapRef.current.easeTo({
            center: geometry?.coordinates as [number, number],
            zoom: zoom || undefined,
          });
        });
      });

      // When a click event occurs on a feature in
      // the unclustered-point layer, open a popup at
      // the location of the feature, with
      // description HTML from its properties.
      mapRef.current.on("click", "unclustered-point", handleClusterClick);

      mapRef.current.on("mouseenter", "clusters", () => {
        if (!mapRef.current) return;
        mapRef.current.getCanvas().style.cursor = "pointer";
      });
      mapRef.current.on("mouseleave", "clusters", () => {
        if (!mapRef.current) return;
        mapRef.current.getCanvas().style.cursor = "";
      });

      console.log("Map loaded with " + rawData.length + " features");
    });

    const handleZoom = () => {
      if (mapRef.current) {
        const zoom = mapRef.current.getZoom();
        if (zoom > 1.5) {
          dispatch(setMapZoomed(true));
        } else {
          dispatch(setMapZoomed(false));
        }
      }
    };

    mapRef.current.on("zoom", handleZoom);
    mapRef.current.on("closeAllPopups", () => {
      popUpRefs.current.forEach((popup) => {
        popup.remove();
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.resize();
  }, [width, height]);

  useEffect(() => {
    if (!mapRef.current || !currentUniSelectedGeoJSON) return;

    const geometry = currentUniSelectedGeoJSON.geometry as GeoJSON.Point;
    const properties =
      currentUniSelectedGeoJSON.properties as IStudiabilityFeatureProperties;

    mapRef.current.fire("closeAllPopups");

    mapRef.current
      ?.flyTo({
        center: geometry.coordinates as [number, number],
        zoom: 5,
        duration: 2000,
        curve: 1.42,
        easing: (t) => t,
      })
      .once("moveend", () => {
        const uniWebsite = properties.university_website;

        const popup = new mapboxgl.Popup()
          .setLngLat(geometry.coordinates as [number, number])
          .setHTML(
            `Name: ${properties.university_name}<br>Rank: ${
              properties.university_id + 1
            }${
              uniWebsite
                ? `<br><a href="${uniWebsite}" target="_blank">${uniWebsite}</a>`
                : ""
            }`
          )
          .addTo(mapRef.current!);

        popUpRefs.current.push(popup);
        dispatch(setCurrentUniversityGeoJSON(null));
      });
  }, [currentUniSelectedGeoJSON]);

  useEffect(() => {
    if (!mapRef.current || !filteredData) return;

    const source = mapRef.current.getSource("uni_locations") as GeoJSONSource;

    if (!source) return;

    const updateMapData = async () => {
      try {
        const data = await fetchMapData(filteredData.filteredUniversities);

        source.setData({
          type: "FeatureCollection",
          features: data,
        });

        console.log("Map updated with " + data.length + " features");
      } catch (error) {
        console.error("Error fetching GeoJSON:", error);
        return null;
      }
    };

    updateMapData();
  }, [filteredData]);

  const handleClusterClick = (e: MapMouseEvent) => {
    if (!mapRef.current || !e.features) return;

    const geometry = e.features[0].geometry as GeoJSON.Point;
    const properties = e.features[0]
      .properties as IStudiabilityFeatureProperties;
    const coordinates = geometry.coordinates;
    const name = properties.university_name;
    const rank = properties.university_id;

    const universityObject = Object.values(allData).find(
      (uni) => uni.name === name
    );

    if (universityObject) dispatch(setCurrentUniversity(universityObject));

    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    const uniWebsite = properties.university_website;

    const popup = new mapboxgl.Popup()
      .setLngLat(coordinates as [number, number])
      .setHTML(
        `Name: ${name}<br>Rank: ${rank + 1}${
          uniWebsite
            ? `<br><a href="${uniWebsite}" target="_blank">${uniWebsite}</a>`
            : ""
        }`
      )
      .addTo(mapRef.current);

    popUpRefs.current.push(popup);
  };

  const handleResetZoom = () => {
    if (mapRef.current) {
      mapRef.current.zoomTo(1, { duration: 2000 });
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div className="map-info">
        {zoomed && (
          <button onClick={handleResetZoom}>reset map position</button>
        )}
      </div>
      <div ref={mapContainerRef} style={{ width, height, color: "black" }} />
    </div>
  );
};

export default WorldMap;
