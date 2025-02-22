import * as Plotly from "plotly.js-dist-min";
import { useEffect, useRef } from "react";
import { getFilteredData } from "../state/slices/dataSlice";
import { useAppSelector } from "../state/hooks";

export default function ScatterPlot() {
  const containerRef = useRef<HTMLDivElement>(null);
  const filteredData = useAppSelector(getFilteredData);

  useEffect(() => {
    if (!containerRef.current) return;

    const xTitle = "sustainability";
    const yTitle = "academic reputation";
    let x, y, uniMarker;
    if (filteredData.filteredUniversities.length > 0) {
      uniMarker = Object.values(filteredData.filteredUniversities).map(
        (u) => u.name
      );
      x = Object.values(filteredData.filteredUniversities).map(
        (u) => u.sustainability
      );
      y = Object.values(filteredData.filteredUniversities).map(
        (u) => u.academic_reputation
      );
    }

    const plotData = [
      {
        mode: "markers",
        type: "scatter" as Plotly.PlotType,
        name: "Uni",
        x: x,
        y: y,
        text: uniMarker,
        marker: { size: 12 },
      },
    ];

    const layout = {
      width: 400,
      title: { text: "Scattered Uni" },
      xaxis: {
        title: {
          text: xTitle,
        },
      },
      yaxis: {
        title: {
          text: yTitle,
        },
      },
    };

    const plotOptions = {
      modeBarButtonsToRemove: ["toImage" as Plotly.ModeBarDefaultButtons],
    };

    Plotly.newPlot(containerRef.current, plotData, layout, plotOptions);

    return () => {
      if (!containerRef.current) return;
      Plotly.purge(containerRef.current);
    };
  }, [containerRef.current, filteredData]);

  return <div className="scatter-plot" ref={containerRef}></div>;
}
