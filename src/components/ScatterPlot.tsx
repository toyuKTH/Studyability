import * as Plotly from "plotly.js-dist-min";
import { useEffect, useRef, useState } from "react";
import { getFilteredData } from "../state/slices/dataSlice";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { titleCase } from "../helpers/stringUtils";
import { setCurrentUniversity } from "../state/slices/uniSelectionSlice";

export default function ScatterPlot() {
  const containerRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  const {filteredUniversities} = useAppSelector(getFilteredData);
  const currentUniversity = useAppSelector((state) => state.uniSelection.currentUniversity);
  const [axisLabels, ] = useState({x: 'employment_outcomes', y: 'academic_reputation'});

  useEffect(() => {
    if (!containerRef.current) return;
    let x, y;
    let uniMarker : string[] | null = null;
    if (filteredUniversities.length > 0) {
      uniMarker = Object.values(filteredUniversities).map(
        (u) => `${u.name}, ${u.countryName}`
      );
      x = Object.values(filteredUniversities).map(
        (u) => u[`${axisLabels.x}` as keyof typeof u]
      );
      y = Object.values(filteredUniversities).map(
        (u) => u[`${axisLabels.y}` as keyof typeof u]
      );
    }

    const filteredUniPlot = {
      mode: 'markers',
      type: 'scatter' as Plotly.PlotType,
      name: '',
      x: x,
      y: y,
      text: uniMarker,
      customdata: [...filteredUniversities],
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

    if (currentUniversity != null) {
      plotData.push({
        mode: "markers",
        type: "scatter" as Plotly.PlotType,
        name: "Selected",
        x: [currentUniversity[`${axisLabels.x}` as keyof typeof currentUniversity]],
        y: [currentUniversity[`${axisLabels.y}` as keyof typeof currentUniversity]],
        text: [currentUniversity.name],
        customdata: [currentUniversity],
        marker: { 
          size: 9,
          color: '#E42C2C'
        },
        hoverlabel: {
          bgcolor: '#EA7878',
          font: {color: '#000'},
          bordercolor: '#EA7878'
        },
      })
    }

    const layout = {
      width: '400',
      margin: {
        t: '25',
        b: '55',
        r: '20',
        l: '55'
      },
      plot_bgcolor: '#E5ECF6',
      showlegend: false,
      xaxis: {
        title: {
          text: titleCase(axisLabels.x),
        },
      },
      yaxis: {
        title: {
          text: titleCase(axisLabels.y),
        },
      }
    };

    const plotOptions = {
      modeBarButtonsToRemove: [
        "toImage" as Plotly.ModeBarDefaultButtons,
        "lasso" as Plotly.ModeBarDefaultButtons,
        "select" as Plotly.ModeBarDefaultButtons,
      ],
    };

    Plotly
      .newPlot(containerRef.current, plotData, layout, plotOptions)
      .then((sc) => {
        sc.on('plotly_click', (eventData) => {
          if (eventData.points[0].data.name == '') {
            dispatch(setCurrentUniversity(eventData.points[0].customdata as typeof filteredUniversities[0]));
          }
          if (eventData.points[0].data.name == 'Selected') {
            dispatch(setCurrentUniversity(null));
          }
        })
      });

    return () => {
      if (!containerRef.current) return;
      Plotly.purge(containerRef.current);
    };
  }, [containerRef.current, filteredUniversities, axisLabels, currentUniversity]);

  return <div className="scatter-plot-container" ref={containerRef}></div>;
}
