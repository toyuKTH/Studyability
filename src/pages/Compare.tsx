import CompareUniCard from "../components/CompareUniCard";
import EmptyCompareCard from "../components/EmptyCompareCard";
import MultipleBarChart from "../components/MultipleBarChart";
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
      {uniToCompare.length > 0 && (
        <>
          <div className="compare-legend">
            <div style={{ textAlign: "center" }}>
              The different colors in the chart represent different "Lens" from
              QS World University Rankings, each consists of different
              "Indicators" <i>(hover to view)</i>.
            </div>
            <div className="compare-legend-categories">
              <div className="legend-container">
                <div
                  className="legend-color"
                  style={{ background: "#3B508A" }}
                />
                <span>Global Engagement</span>
              </div>
              <div className="legend-container">
                <div
                  className="legend-color"
                  style={{ background: "#FDE725" }}
                />
                <span>Research and Discovery</span>
              </div>
              <div className="legend-container">
                <div
                  className="legend-color"
                  style={{ background: "#D4ED99" }}
                />
                <span>Employability and Outcomes</span>
              </div>
              <div className="legend-container">
                <div
                  className="legend-color"
                  style={{ background: "#2CA02C" }}
                />
                <span>Sustainability</span>
              </div>
              <div className="legend-container">
                <div
                  className="legend-color"
                  style={{ background: "#461667" }}
                />
                <span>Learning Experience</span>
              </div>
            </div>
          </div>
          <RadarChart />
          <MultipleBarChart />
        </>
      )}
    </div>
  );
}

export default Compare;
