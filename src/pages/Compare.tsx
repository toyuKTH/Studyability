import CompareUniCard from "../components/CompareUniCard";
import EmptyCompareCard from "../components/EmptyCompareCard";
import RadarChart from "../components/RadarChart";
import { useAppSelector } from "../state/hooks";
import "./Compare.css";

function Compare() {
  const uniToCompare = useAppSelector(
    (state) => state.uniSelection.uniToCompare
  );
  return (
    <div className="compare-container">
      <div className="compare-uni-cards-container">
        {uniToCompare.length > 0 &&
          uniToCompare.map((uni) => (
            <CompareUniCard
              key={uni.rank + "-" + uni.name}
              currentUniversity={uni}
            />
          ))}
        {(uniToCompare.length === 0 || uniToCompare.length < 5) && (
          <EmptyCompareCard />
        )}
      </div>
      {uniToCompare.length > 0 && <RadarChart />}
    </div>
  );
}

export default Compare;
