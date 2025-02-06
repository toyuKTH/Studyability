import * as d3 from "d3";
import { useContext, useEffect, useRef, useState } from "react";
import "./WorldMap.css";
import {
  CountryContext,
  CountryDispatchContext,
  d3Dispatch,
} from "../context/Context";
import { IDispatchType } from "../models/Context.types";
import { worldTopology } from "../data/topologyData/countryTopology";
import { getAlpha_2 } from "../data/CountryData";
import CountryTooltip from "./CountryTooltip";
import useWorldMap from "../hooks/useWorldMap";
import useHeatMapScale, { IHeatMapScaleConfig } from "../hooks/useHeatMapScale";
// import { getAlpha_2, universityRankingsByCountry } from "../data/CountryData";

type MapProps = {
  width?: number;
  height?: number;
};

export const WorldMap = ({ width, height }: MapProps) => {
  const [zoomed, setZoomed] = useState(false);

  const { svgPaths, mapSvgRef } = useWorldMap({
    width,
    height,
    setZoomed,
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
          domain: [200, 300],
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

  // d3Dispatch.on("filterByUniversity", filterByUniversity);

  function handleReset() {
    d3Dispatch.call("resetZoom");
  }

  return (
    <div style={{ position: "relative" }}>
      <div className="map-info">
        {zoomed && <button onClick={handleReset}>reset map position</button>}
        {/* {(countryContext.selectedCountry || countryContext.hoveredCountry) && (
          <CountryTooltip
            selectedCountry={
              countryContext.selectedCountry || countryContext.hoveredCountry
            }
          />
        )} */}
      </div>
      <svg width={width} height={height} ref={mapSvgRef} id="world-map">
        {svgPaths}
      </svg>
      <div className="map-scale" style={{ width }}>
        <svg ref={scaleSvgRef} width={"100%"} height={"100%"} />
      </div>
    </div>
  );
};

export default WorldMap;
