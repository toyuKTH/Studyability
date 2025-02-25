import { useEffect, useRef } from "react";
import "./WorldMap.css";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import {
  flyToUniComplete,
  setMapZoomed,
} from "../state/slices/mapInteractionSlice";
import mapboxgl, { GeoJSONFeature, GeoJSONSource } from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import { getFilteredData } from "../state/slices/dataSlice";
import { fetchGeoJSON } from "../helpers/fetchGeoJSON";

interface IStudiabilityFeatureProperties {
  st_university: string;
  st_rank: number;
  st_country_code: string;
  website?: string;
}

export const WorldMap = ({
  width,
  height,
}: {
  width?: number;
  height?: number;
}) => {
  const mapToken = import.meta.env.VITE_MAP_BOX_TOKEN;

  const dispatch = useAppDispatch();

  const filteredData = useAppSelector(getFilteredData);
  const flyToUni = useAppSelector((state) => state.mapInteraction.flyToUni);

  const zoomed = useAppSelector((state) => state.mapInteraction.mapZoomed);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const featureRef = useRef<GeoJSONFeature | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = mapToken;

    let mapData: any = null;

    const fetchJSON = async () => {
      try {
        const data = await fetchGeoJSON(
          `./data/GeoJSON/UniCleanedGeojson/unis_point_geometry.geojson`
        );

        const filteredGeoJSON = data.features.filter(
          (feature: GeoJSONFeature) => {
            const properties =
              feature.properties as IStudiabilityFeatureProperties;
            return filteredData.filteredUniversities.some(
              (uni) =>
                uni.name === properties.st_university &&
                uni.countryCode === properties.st_country_code
            );
          }
        );

        mapData = filteredGeoJSON;
      } catch (error) {
        console.error("Error fetching GeoJSON:", error);
        return null;
      }
    };

    fetchJSON();

    mapRef.current = new mapboxgl.Map({
      projection: "mercator",
      renderWorldCopies: false,
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [0, 70],
      zoom: 0,
    });

    mapRef.current.on("load", () => {
      if (!mapRef.current) return;

      mapRef.current.addSource("uni_locations", {
        type: "geojson",
        data: "./data/GeoJSON/UniCleanedGeojson/unis_point_geometry.geojson",
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      const source = mapRef.current.getSource("uni_locations") as GeoJSONSource;

      if (!source) return;

      source.setData({
        type: "FeatureCollection",
        features: mapData,
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
            "#51bbd6",
            100,
            "#f1f075",
            750,
            "#f28cb1",
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
      mapRef.current.on("click", "unclustered-point", (e) => {
        if (!mapRef.current || !e.features) return;

        const geometry = e.features[0].geometry as GeoJSON.Point;
        const properties = e.features[0]
          .properties as IStudiabilityFeatureProperties;
        const coordinates = geometry.coordinates;
        const name = properties.st_university;
        const rank = properties.st_rank;

        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        const uniWebsite = properties.website;

        new mapboxgl.Popup()
          .setLngLat(coordinates as [number, number])
          .setHTML(
            `Name: ${name}<br>Rank: ${rank}${
              uniWebsite
                ? `<br><a href="${uniWebsite}" target="_blank">${uniWebsite}</a>`
                : ""
            }`
          )
          .addTo(mapRef.current);
      });

      mapRef.current.on("mouseenter", "clusters", () => {
        if (!mapRef.current) return;
        mapRef.current.getCanvas().style.cursor = "pointer";
      });
      mapRef.current.on("mouseleave", "clusters", () => {
        if (!mapRef.current) return;
        mapRef.current.getCanvas().style.cursor = "";
      });
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

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || flyToUni.state !== "flying" || !flyToUni.uni) return;

    const name = flyToUni.uni.name;
    const countryCode = flyToUni.uni.countryCode;

    const fetchJSON = async () => {
      try {
        const data = await fetchGeoJSON(
          `./data/GeoJSON/UniCleanedGeojson/unis_point_geometry.geojson`
        );

        data.features.forEach((feature: GeoJSONFeature) => {
          const properties =
            feature.properties as IStudiabilityFeatureProperties;
          if (
            properties.st_university === name &&
            properties.st_country_code === countryCode
          ) {
            const geometry = feature.geometry as GeoJSON.Point;
            mapRef.current
              ?.flyTo({
                center: geometry.coordinates as [number, number],
                zoom: 15,
                duration: 5000,
                curve: 1.42,
                easing: (t) => t,
              })
              .once("moveend", () => {
                const uniWebsite = properties.website;
                new mapboxgl.Popup()
                  .setLngLat(geometry.coordinates as [number, number])
                  .setHTML(
                    `Name: ${name}<br>Rank: ${properties.st_rank}${
                      uniWebsite
                        ? `<br><a href="${uniWebsite}" target="_blank">${uniWebsite}</a>`
                        : ""
                    }`
                  )
                  .addTo(mapRef.current!);

                dispatch(flyToUniComplete());
              });
          } else {
            // dispatch(flyToUniComplete());
          }
        });
      } catch (error) {
        console.error("Error fetching GeoJSON:", error);
        return null;
      }
    };

    fetchJSON();
  }, [flyToUni]);

  useEffect(() => {
    if (!mapRef.current || !filteredData) return;

    const source = mapRef.current.getSource("uni_locations") as GeoJSONSource;

    if (!source) return;

    const fetchJSON = async () => {
      try {
        const data = await fetchGeoJSON(
          `./data/GeoJSON/UniCleanedGeojson/unis_point_geometry.geojson`
        );

        const filteredGeoJSON = data.features.filter(
          (feature: GeoJSONFeature) => {
            const properties =
              feature.properties as IStudiabilityFeatureProperties;
            return filteredData.filteredUniversities.some(
              (uni) =>
                uni.name === properties.st_university &&
                uni.countryCode === properties.st_country_code
            );
          }
        );

        source.setData({
          type: "FeatureCollection",
          features: filteredGeoJSON,
        });

        console.log("filteredGeoJSON", filteredGeoJSON);
      } catch (error) {
        console.error("Error fetching GeoJSON:", error);
        return null;
      }
    };

    fetchJSON();
  }, [filteredData, mapRef.current]);

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
