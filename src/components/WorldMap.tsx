import * as d3 from "d3";
import { useContext, useState } from "react";
import { CountryContext, d3Dispatch } from "../context/Context";
import CountryTooltip from "./CountryTooltip";
import useWorldMap from "../hooks/useWorldMap";
import useHeatMapScale, { IHeatMapScaleConfig } from "../hooks/useHeatMapScale";
// import { getAlpha_2, universityRankingsByCountry } from "../data/CountryData";
import "./WorldMap.css";
import { IMapFilterState } from "../App";

export const WorldMap = ({
  width,
  height,
  mapFilterState,
}: {
  width?: number;
  height?: number;
  mapFilterState: IMapFilterState;
}) => {
  const [zoomed, setZoomed] = useState(false);

  const countryContext = useContext(CountryContext);

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
          domain: [
            mapFilterState.universityRankingsData.minVal,
            mapFilterState.universityRankingsData.maxVal,
          ],
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

  const { scaleSvgRef } = useHeatMapScale(scaleConfig, [
    mapFilterState.universityRankingsData.minVal,
    mapFilterState.universityRankingsData.maxVal,
  ]);

  // d3Dispatch.on("filterByUniversity", filterByUniversity);

  function handleReset() {
    d3Dispatch.call("resetZoom");
  }

  return (
    <div style={{ position: "relative" }}>
      <div className="map-info">
        {zoomed && <button onClick={handleReset}>reset map position</button>}
        {(countryContext.data.selectedCountry ||
          countryContext.data.hoveredCountry) && (
          <CountryTooltip
            selectedCountry={
              countryContext.data.selectedCountry ||
              countryContext.data.hoveredCountry
            }
          />
        )}
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
