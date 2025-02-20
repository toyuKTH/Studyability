import { useAppSelector } from "../state/hooks";
import { getFilteredCountries } from "../state/slices/dataSlice";
import "./WorldMapFilter.css";

export default function WorldMapFilter() {
  const filter = useAppSelector((state) => state.filter);
  const filteredCountries = useAppSelector(getFilteredCountries);

  return (
    <div className="map-filtering-container">
      <h2>Filtered universities</h2>
      {Object.values(filteredCountries).length}
      <h2>University filters</h2>
      <p>QS Overall Score</p>
      {filter.universityRankings.tuitionFee.amount.domain.map((amount) => {
        return (
          <>
            <div>{amount[0]}</div>
            <div>{amount[0]}</div>
          </>
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
      {filter.countries.costOfLiving.cost_of_living_index.domain.map(
        (costOfLivingIndex) => {
          return (
            <>
              <div>{costOfLivingIndex[0]}</div>
              <div>{costOfLivingIndex[1]}</div>
            </>
          );
        }
      )}
      <p>English proficiency</p>
      {filter.countries.efScore.ef_score.domain.map((efScore) => {
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
