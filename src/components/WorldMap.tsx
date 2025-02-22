import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import useWorldMap from "../hooks/useWorldMap";
import useHeatMapScale, { IHeatMapScaleConfig } from "../hooks/useHeatMapScale";
import "./WorldMap.css";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import CountryTooltip from "./CountryTooltip";
import { setMapZoomed } from "../state/slices/mapInteractionSlice";
import mapboxgl, { GeoJSONFeature, TargetFeature } from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";

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
      container: mapContainerRef.current,
      style: "mapbox://styles/gianlucabeltran/cm74xnf5b007d01r31e4r0pex",
      center: [0, 0],
      zoom: 1,
      renderWorldCopies: false,
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
        mapRef.current.off("zoom", handleZoom);
        mapRef.current.off("mousemove", "country-boundaries", handleMouseMove);
        mapRef.current.off(
          "mouseleave",
          "country-boundaries",
          handleMouseLeave
        );
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
      <div ref={mapContainerRef} style={{ width, height }} />
    </div>
  );
};

export default WorldMap;
