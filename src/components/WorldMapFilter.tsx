import { useContext, useEffect, useState } from "react";
import "./WorldMapFilter.css";
import * as d3 from "d3";
// import UniversityRankings from "../models/UniversityRankings.type";
import { CountryDispatchContext } from "../context/Context";
import { IDispatchType } from "../models/Context.types";
import { worldTopology } from "../data/topologyData/countryTopology";

export default function WorldMapFilter() {
  const countryDispatch = useContext(CountryDispatchContext);
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

    countryDispatch({ type: IDispatchType.selectCountry, data: country });
  };

  const handleFilterByUniversity = () => {
    countryDispatch({ type: IDispatchType.selectFilter, data: "university" });
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
        <button onClick={handleFilterByUniversity}>
          Number of universities by country
        </button>
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
