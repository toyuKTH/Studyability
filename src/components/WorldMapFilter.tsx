import { useEffect, useState } from "react";
import "./WorldMapFilter.css";
import * as d3 from "d3";
import UniversityRankings from "../models/UniversityRankings.type";
import { data } from "../topologyData/countryTopology";
import { Dispatch } from "d3";

export default function WorldMapFilter({
  costumeDispatch,
}: {
  costumeDispatch: Dispatch<object>;
}) {
  const [countryData, setCountryData] = useState<UniversityRankings[]>();
  const [filteredCountryData, setFilteredCountryData] =
    useState<UniversityRankings[]>();
  const [filterInput, setFilterInput] = useState<string>("");

  const [justCountries, setJustCountries] = useState<string[][]>([]);
  const [filteredCountries, setFilteredCountries] = useState<string[][]>([]);

  useEffect(() => {
    const cleanCountryData = data.features.map((country) => {
      return [country.properties?.name, country.id];
    });
    setJustCountries(cleanCountryData);
    setFilteredCountries(cleanCountryData);
  }, [data]);

  //   useEffect(() => {
  //     async function fetchCountryData() {
  //       const data: UniversityRankings[] = await d3.csv(
  //         "../../data/university_rankings.csv",
  //         (d): UniversityRankings => {
  //           return {
  //             "2025_rank": d["2025_rank"],
  //             "2024_rank": d["2024_rank"],
  //             university: d.university,
  //             alpha_2: d.alpha_2,
  //             academic_reputation: +d.academic_reputation,
  //             employer_reputation: +d.employer_reputation,
  //             international_students: +d.international_students,
  //             employment_outcomes: +d.employment_outcomes,
  //             sustainability: +d.sustainability,
  //             qs_overall_score: +d.qs_overall_score,
  //           };
  //         }
  //       );
  //       data.sort((a, b) => {
  //         // @ts-ignore
  //         return a["2025_rank"] - b["2025_rank"];
  //       });

  //       setCountryData(data);
  //     }

  //     fetchCountryData().catch(console.error);
  //   }, [countryData]);

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

  const handleCountryHover = (country: string) => {
    const countryPath = d3.select(`#${country}`);
    countryPath.attr("fill", "cornflowerblue");

    if (!countryPath.node()) return;

    costumeDispatch.call("countrySelected", {}, { country });
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
        <button>Filter</button>
        <button>Reset</button>
      </div>
      <div className="map-filtering-country-list">
        {filteredCountries?.map((country, index) => (
          <div
            key={index}
            className="country-list-item"
            onClick={() => handleCountryHover(country[1])}
          >
            <span>{country[0]}</span>
            {/* <span>{country.university}</span> */}
          </div>
        ))}
      </div>
    </div>
  );
}
