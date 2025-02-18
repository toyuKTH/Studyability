import { Dispatch, useEffect, useState } from "react";
import "./WorldMapFilter.css";
import * as d3 from "d3";
// import UniversityRankings from "../models/UniversityRankings.type";
// import { CountryDispatchContext } from "../context/Context";
// import { IDispatchType } from "../models/Context.types";
import { worldTopology } from "../data/topologyData/countryTopology";
import MinMaxSlider from "./MinMaxSlider";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import {
  hideUniversityFilter,
  showUniversityFilter,
} from "../state/slices/filterSlice";
import { setSelectedCountry } from "../state/slices/mapInteractionSlice";
import {
  selectCountriesMaxMinFilterValues,
  selectUniversitiesByFilter,
} from "../state/slices/dataSlice";

export default function WorldMapFilter() {
  const filterMaxMinValues = useAppSelector(selectCountriesMaxMinFilterValues);

  return (
    <div className="map-filtering-container">
      <div className="map-filtering">
        <h2>Country filters</h2>
        <MinMaxSlider
          resetButton
          title="Temperature"
          id="temperature-slider"
          minValue={filterMaxMinValues.temperature.minTemperature}
          minValueLimit={filterMaxMinValues.temperature.minTemperature}
          maxValue={filterMaxMinValues.temperature.maxTemperature}
          maxValueLimit={filterMaxMinValues.temperature.maxTemperature}
        />
        <MinMaxSlider
          resetButton
          title="Cost of living"
          id="cost-of-living-slider"
          minValue={filterMaxMinValues.costOfLiving.minCostOfLiving}
          minValueLimit={filterMaxMinValues.costOfLiving.minCostOfLiving}
          maxValue={filterMaxMinValues.costOfLiving.maxCostOfLiving}
          maxValueLimit={filterMaxMinValues.costOfLiving.maxCostOfLiving}
        />
        <MinMaxSlider
          resetButton
          title="English proficiency"
          id="english-proficiency-slider"
          minValue={filterMaxMinValues.englishProficiency.minEnglishProficiency}
          minValueLimit={
            filterMaxMinValues.englishProficiency.minEnglishProficiency
          }
          maxValue={filterMaxMinValues.englishProficiency.maxEnglishProficiency}
          maxValueLimit={
            filterMaxMinValues.englishProficiency.maxEnglishProficiency
          }
        />
      </div>
    </div>
  );
}
