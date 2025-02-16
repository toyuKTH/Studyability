import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import useWorldMap from "../hooks/useWorldMap";
import useHeatMapScale, { IHeatMapScaleConfig } from "../hooks/useHeatMapScale";
import "./WorldMap.css";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import CountryTooltip from "./CountryTooltip";
import Map, { MapMouseEvent, MapRef } from "react-map-gl/mapbox";
import { setMapZoomed } from "../state/slices/mapInteractionSlice";
// import "maplibre-gl/dist/maplibre-gl.css";

export const WorldMap = ({
  width,
  height,
}: {
  width?: number;
  height?: number;
}) => {
  const mapToken = import.meta.env.VITE_MAP_BOX_TOKEN;
  const mapStyle = import.meta.env.VITE_MAP_STYLE;

  const dispatch = useAppDispatch();

  const zoomed = useAppSelector((state) => state.mapInteraction.mapZoomed);

  const [originalMapZoom, setOriginalMapZoom] = useState<number | null>(null);

  const mapSvgRef = useRef<SVGSVGElement>(null);
  const mapRef = useRef<MapRef>(null);

  const { svgPaths } = useWorldMap({
    width,
    height,
    mapSvgRef,
  });

  const scaleConfig: IHeatMapScaleConfig = {
    paintedObject: {
      selector: "#world-map",
      unselectedItems: {
        opacity: "0.1",
        fill: "grey",
      },
      selectedItems: {
        fill: {
          interpolator: d3.interpolateBlues,
          domain: [0, 100],
          clamp: true,
        },
        opacity: "1",
      },
    },
    axis: {
      dimensions: {
        height: 10,
        margins: {
          top: 10,
          bottom: 0,
          right: 10,
          left: 10,
        },
        tickRatio: 100,
        tickSize: 10,
      },
    },
  };

  const { scaleSvgRef } = useHeatMapScale(scaleConfig);

  useEffect(() => {
    if (!mapRef.current || originalMapZoom) return;

    setOriginalMapZoom(mapRef.current.getZoom());
  }, [mapRef.current]);

  const handleResetZoom = () => {
    // const svg = d3.select(mapSvgRef.current);
    // svg.dispatch("resetZoom");
    if (mapRef.current) {
      const min = mapRef.current.getMinZoom();
      mapRef.current.zoomTo(min, { duration: 5000 });
      dispatch(setMapZoomed(false));
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <CountryTooltip />
      {/* <svg width={width} height={height} ref={mapSvgRef} id="world-map">
        {svgPaths}
      </svg>
      <div className="map-scale" style={{ width }}>
        <svg ref={scaleSvgRef} width={"100%"} height={"100%"} />
      </div> */}
      <div className="map-info">
        {zoomed && (
          <button onClick={handleResetZoom}>reset map position</button>
        )}
      </div>
      {mapToken && (
        <Map
          onZoomEnd={() => {
            console.log(mapRef.current!.getZoom());
            if (!mapRef.current || mapRef.current.getZoom() < 2)
              dispatch(setMapZoomed(false));
            else dispatch(setMapZoomed(true));
          }}
          maxBounds={[
            [-180, -75],
            [180, 83],
          ]}
          renderWorldCopies={false}
          onMouseEnter={(e: MapMouseEvent) => {
            console.log("enter", e);
          }}
          projection={"mercator"}
          mapboxAccessToken={mapToken}
          initialViewState={{
            longitude: -100,
            latitude: 40,
            zoom: 1,
          }}
          ref={mapRef}
          style={{ width, height }}
          mapStyle={mapStyle}
        ></Map>
      )}
    </div>
  );
};

export default WorldMap;
