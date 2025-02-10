import { Dispatch, useEffect, useState } from "react";
import "./WorldMapFilter.css";
import * as d3 from "d3";
// import UniversityRankings from "../models/UniversityRankings.type";
// import { CountryDispatchContext } from "../context/Context";
// import { IDispatchType } from "../models/Context.types";
import { worldTopology } from "../data/topologyData/countryTopology";
import MinMaxSlider from "./MinMaxSlider";
import { IMapFilterAction } from "../App";

export default function WorldMapFilter({
  mapFilterDispatch,
}: {
  mapFilterDispatch: Dispatch<IMapFilterAction>;
}) {
  // const countryDispatch = useContext(CountryDispatchContext);
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

    // countryDispatch({ type: IDispatchType.selectCountry, data:  });
  };

  // const handleFilterByUniversity = () => {
  //   countryDispatch({ type: IDispatchType.selectFilter, data: {selectedFilter: "university" });
  // };

  return (
    <div className="map-filtering-container">
      <input
        type="text"
        placeholder="Search country"
        value={filterInput}
        onChange={handleInputChange}
      />
      <div className="map-filtering-buttons">
        {/* <button onClick={handleFilterByUniversity}> */}
        <button>Number of universities by country</button>
        <MinMaxSlider
          mapFilterDispatch={mapFilterDispatch}
          minValue={0}
          minValueLimit={0}
          maxValue={100}
          maxValueLimit={100}
        />
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
