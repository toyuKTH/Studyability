import { useEffect, useRef } from "react";
import "./WorldMap.css";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { setMapZoomed } from "../state/slices/mapInteractionSlice";
import mapboxgl, { GeoJSONFeature, GeoJSONSource } from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";

interface IStudiabilityFeatureProperties {
  st_university: string;
  st_rank: number;
  st_country_code: string;
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

  const zoomed = useAppSelector((state) => state.mapInteraction.mapZoomed);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const featureRef = useRef<GeoJSONFeature | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = mapToken;

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

        new mapboxgl.Popup()
          .setLngLat(coordinates as [number, number])
          .setHTML(`Name: ${name}<br>Rank: ${rank}`)
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

        if (zoom > 4) {
          mapRef.current.setLayoutProperty(
            "country-boundaries",
            "visibility",
            "none"
          );
        } else {
          mapRef.current.setLayoutProperty(
            "country-boundaries",
            "visibility",
            "visible"
          );
        }
      }
    };

    // const handleMouseEnter = (e: mapboxgl.MapMouseEvent) => {
    //   if (featureRef.current) {
    //     mapRef.current.setFeatureState(featureRef.current, {
    //       ["state"]: false,
    //     });
    //   }
    //   if (!e.features) return;
    //   featureRef.current = e.features[0];
    //   mapRef.current.setFeatureState(featureRef.current, { ["state"]: true });
    // };

    // const handleMouseLeave = () => {
    //   if (featureRef.current) {
    //     mapRef.current.setFeatureState(featureRef.current, {
    //       ["state"]: false,
    //     });
    //     featureRef.current = null;
    //   }
    // };

    const handleMouseMove = (e: mapboxgl.MapMouseEvent) => {
      if (!mapRef.current) return;

      if (e.features) {
        if (featureRef.current?.id === e.features[0].id) return;

        if (featureRef.current) {
          mapRef.current.setFeatureState(featureRef.current, {
            ["state"]: false,
          });
        }

        featureRef.current = e.features[0];
        mapRef.current.setFeatureState(featureRef.current, {
          ["state"]: true,
        });
      }
    };

    const handleMouseLeave = (e: mapboxgl.MapMouseEvent) => {
      if (!mapRef.current) return;

      if (featureRef.current) {
        mapRef.current.setFeatureState(featureRef.current, {
          ["state"]: false,
        });
        featureRef.current = null;
      }
    };

    mapRef.current.on("mousemove", "country-boundaries", handleMouseMove);

    mapRef.current.on("mouseleave", "country-boundaries", handleMouseLeave);

    // mapRef.current.on("mouseenter", "country-boundaries", handleMouseEnter);

    // mapRef.current.on("mouseleave", "country-boundaries", handleMouseLeave);

    // const handleCountryHover = (event: mapboxgl.MapMouseEvent) => {
    //   const country = event.features?.[0].properties?.name;
    //   console.log("hover", country);
    // };

    mapRef.current.on("zoom", handleZoom);
    // mapRef.current.on("mousemove", "country-boundaries", handleCountryHover);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

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
