import { getQSAttributeLabel } from "../helpers/qsAttributeUtils";
import { useAppSelector } from "../state/hooks";
import { IUniversity } from "../state/slices/dataSlice";
import BarChart from "./BarChart";
import "./MultipleBarChart.css";

export default function MultipleBarChart() {
  const uniToCompare = useAppSelector(
    (state) => state.uniSelection.uniToCompare
  );
  const highlightedUni = useAppSelector(
    (state) => state.highlightInteraction.uniToHighlight
  );
  const categories = useAppSelector(
    (state) => state.highlightInteraction.qsCategoriesToInclude
  );

  const uniCategoryData = categories.map((attributeKey: string) => {
    return uniToCompare.map((uni) => {
      let fillColor = "#ccc";
      if (highlightedUni && highlightedUni.name == uni.name) {
        fillColor = "#007AFF";
      }
      return {
        x: uni.name,
        y: uni[`${attributeKey}` as keyof IUniversity] as number,
        fillColor,
      };
    });
  });

  const sortedUniCategoryData = uniCategoryData.map((data) =>
    data.sort((a, b) => a.y - b.y)
  );

  return (
    <div className="multiple-bar-container">
      {categories.map((attribute, index) => (
        <BarChart
          key={`bar-chart-${attribute}`}
          title={getQSAttributeLabel(attribute)}
          data={sortedUniCategoryData[index]}
          label={attribute}
        />
      ))}
    </div>
  );
}
