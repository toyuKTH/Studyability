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

export default function WorldMapFilter() {
  const dispatch = useAppDispatch();
  const universityFilterShowing = useAppSelector(
    (state) => state.filter.universityRankings.showing
  );

  const [filterInput, setFilterInput] = useState<string>("");

  const [justCountries, setJustCountries] = useState<string[][]>([]);
  const [filteredCountries, setFilteredCountries] = useState<string[][]>([]);

  useEffect(() => {
    const cleanCountryData = worldTopology?.features.map((country) => {
      return [country.properties?.name, country.id];
    });

    if (!cleanCountryData) return;

    setJustCountries(cleanCountryData);
    setFilteredCountries(cleanCountryData);
  }, [worldTopology]);

  useEffect(() => {
    if (!justCountries) return;
    setFilteredCountries(
      justCountries.filter((country) =>
        country[0].toLowerCase().startsWith(filterInput.toLowerCase())
      )
    );
  }, [filterInput, justCountries]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterInput(event.target.value);
  };

  const handleCountryClick = (country: string) => {
    const countryPath = d3.select(`#${country}`);
    countryPath.attr("fill", "cornflowerblue");

    if (!countryPath.node()) return;
    // @ts-ignore
    dispatch(setSelectedCountry(countryPath.node().dataset.alpha_2));
  };

  const handleFilterByUniversity = () => {
    dispatch(
      universityFilterShowing ? hideUniversityFilter() : showUniversityFilter()
    );
  };

  return (
    <div className="map-filtering-container">
      <input
        type="text"
        placeholder="Search country"
        value={filterInput}
        onChange={handleInputChange}
      />
      <div className="map-filtering-buttons">
        {universityFilterShowing ? (
          <>
            <button onClick={handleFilterByUniversity}>
              Hide university filter
            </button>
            <MinMaxSlider
              minValue={0}
              minValueLimit={0}
              maxValue={100}
              maxValueLimit={100}
            />
          </>
        ) : (
          <button onClick={handleFilterByUniversity}>
            Number of universities by country
          </button>
        )}
        <button>Reset</button>
      </div>
      <div className="map-filtering-country-list">
        {filteredCountries?.map((country, index) => (
          <div
            key={index}
            className="country-list-item"
            onClick={() => handleCountryClick(country[1])}
          >
            <span>{country[0]}</span>
            {/* <span>{country.university}</span> */}
          </div>
        ))}
      </div>
    </div>
  );
}
