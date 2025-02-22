import { useAppSelector } from "../state/hooks";
import { getFilteredData } from "../state/slices/dataSlice";
import "./WorldMapFilter.css";

export default function WorldMapFilter() {
  const filter = useAppSelector((state) => state.filter);
  const filteredData = useAppSelector(getFilteredData);

  console.log("filteredData", filteredData);

  return (
    <div className="map-filtering-container">
      <h2>Filtered universities</h2>
      <div>
        {Object.values(filteredData.filteredUniversities).length} universities
        in
      </div>
      {Object.values(filteredData.filterdCountries).length} countries
      {/* {Object.values(filteredData.filteredUniversities).map((uni) => {
        return (
          <div key={uni.name}>
            {uni.name}, {uni.countryCode}
          </div>
        );
      })}
        */}
      {/* {Object.values(filteredData.filterdCountries).map((country, index) => {
        return <div key={index}>{country.name}</div>;
      })} */}
      <h2>filters</h2>
      <p>QS Overall Score</p>
      {filter.universityRankings.tuitionFee.domain.map((amount) => {
        return (
          <div>
            <div>{amount[0]}</div>
            <div>{amount[1]}</div>
          </div>
        );
      })}
      <h2>Country filters</h2>
      <p>Temperature</p>
      {filter.countries.temperature.domain.map((temperature) => {
        return (
          <>
            <div>{temperature[0]}</div>
            <div>{temperature[1]}</div>
          </>
        );
      })}
      <p>Cost of living</p>
      {filter.countries.cost_of_living_index.domain.map((costOfLivingIndex) => {
        return (
          <>
            <div>{costOfLivingIndex[0]}</div>
            <div>{costOfLivingIndex[1]}</div>
          </>
        );
      })}
      <p>English proficiency</p>
      {filter.countries.ef_score.domain.map((efScore) => {
        return (
          <>
            <div>{efScore[0]}</div>
            <div>{efScore[1]}</div>
          </>
        );
      })}
    </div>
  );
}
