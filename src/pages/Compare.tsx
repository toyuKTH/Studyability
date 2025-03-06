import RadarChart from "../components/RadarChart";
import { useAppSelector } from "../state/hooks";
import "./Compare.css";

function Compare() {
  const uniToCompare = useAppSelector(
    (state) => state.uniSelection.uniToCompare
  );
  return (
    <div className="compare-container">
      {uniToCompare.length < 1 && (
        <div className="compare-empty">Select university to compare</div>
      )}
      {uniToCompare.length > 0 && (
        <>
          <RadarChart />
        </>
      )}
    </div>
  );
}

export default Compare;
