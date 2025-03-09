import {
  getQSAttributeLabel,
  qsAttributeKeys,
} from "../helpers/qsAttributeUtils";
import { useAppSelector } from "../state/hooks";
import { IUniversity } from "../state/slices/dataSlice";
import BarChart from "./BarChart";
import "./MultipleBarChart.css";

export default function MultipleBarChart() {
  const attributes = qsAttributeKeys;
  const uniToCompare = useAppSelector(
    (state) => state.uniSelection.uniToCompare
  );
  const highlightedUni = useAppSelector(
    (state) => state.highlightInteraction.uniToHighlight
  );

  const uniCategoryData = attributes.map((attributeKey: string) => {
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

  return (
    <div className="multiple-bar-container">
      {attributes.map((attribute, index) => (
        <BarChart
          key={`bar-chart-${attribute}`}
          title={getQSAttributeLabel(attribute)}
          data={uniCategoryData[index]}
        />
      ))}
    </div>
  );
}
