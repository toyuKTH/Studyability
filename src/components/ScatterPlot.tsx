import * as Plotly from "plotly.js-dist-min";
import { useEffect, useRef, useState } from "react";
import { getFilteredData } from "../state/slices/dataSlice";
import { useAppSelector } from "../state/hooks";

export default function ScatterPlot() {
  const containerRef = useRef<HTMLDivElement>(null);
  const {filteredUniversities} = useAppSelector(getFilteredData);
  const [] = useState({x: 'sustainability', y: 'academic_reputation'});

  useEffect(() => {
    if (!containerRef.current) return;

    const xTitle = "sustainability";
    const yTitle = "academic reputation";
    let x, y, uniMarker;
    if (filteredUniversities.length > 0) {
      uniMarker = Object.values(filteredUniversities).map(
        (u) => `${u.name}, ${u.countryName}`
      );
      x = Object.values(filteredUniversities).map(
        (u) => u.sustainability
      );
      y = Object.values(filteredUniversities).map(
        (u) => u.academic_reputation
      );
    }

    const filteredUniPlot = {
      mode: "markers",
      type: "scatter" as Plotly.PlotType,
      name: "Uni",
      x: x,
      y: y,
      text: uniMarker,
      marker: { 
        size: 9,
        color: '#636EFA'
      },
      hoverlabel: {
        bgcolor: '#EA7878',
        font: {color: '#000'},
        bordercolor: '#EA7878'
      },
    };

    const plotData = [
      filteredUniPlot,
    ];

    const layout = {
      width: '400',
      title: { text: "Scattered Uni" },
      plot_bgcolor: '#E5ECF6',
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
  }, [containerRef.current, filteredUniversities]);

  return <div className="scatter-plot-container" ref={containerRef}></div>;
}
