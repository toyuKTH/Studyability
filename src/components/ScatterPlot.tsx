import * as Plotly from "plotly.js-dist-min";
import { useEffect, useRef, useState } from "react";
import { getFilteredData, IUniversity } from "../state/slices/dataSlice";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { titleCase } from "../helpers/stringUtils";
import { setCurrentUniversity } from "../state/slices/uniSelectionSlice";
import "./ScatterPlot.css";

export default function ScatterPlot() {
  const containerRef = useRef<HTMLDivElement>(null);
  const axisOptions = [
    "sustainability",
    "academic_reputation",
    "employment_outcomes",
    "international_students",
  ];

  const dispatch = useAppDispatch();

  const { filteredUniversities } = useAppSelector(getFilteredData);
  const currentUniversity = useAppSelector(
    (state) => state.uniSelection.currentUniversity
  );
  const [axisLabels, setAxisLabels] = useState({
    x: "sustainability",
    y: "academic_reputation",
  });
  const [axisSelectionModeOn, setSelectionMode] = useState({
    x: false,
    y: false,
  });
  const [hoveredUniversity, setHoveredUniversity] =
    useState<IUniversity | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let x, y;
    let uniMarker: string[] | null = null;
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
      mode: "markers",
      type: "scatter" as Plotly.PlotType,
      name: "",
      x: x,
      y: y,
      text: uniMarker,
      customdata: [...filteredUniversities],
      marker: {
        size: 15,
        color: "#636EFA",
        symbol: "circle",
        line: {},
      },
      hoverinfo: "none",
    };

    const plotData = [filteredUniPlot];

    if (hoveredUniversity != null) {
      plotData.push({
        mode: "markers",
        type: "scatter" as Plotly.PlotType,
        name: "Hovered",
        x: [
          hoveredUniversity[
            `${axisLabels.x}` as keyof typeof hoveredUniversity
          ],
        ],
        y: [
          hoveredUniversity[
            `${axisLabels.y}` as keyof typeof hoveredUniversity
          ],
        ],
        text: [hoveredUniversity.name],
        customdata: [hoveredUniversity],
        marker: {
          size: 15,
          color: "#fff",
          symbol: "circle-cross",
          line: {
            color: "#636EFA",
            width: 1.5,
          },
        },
        hoverinfo: "skip",
      });
    }

    if (currentUniversity != null) {
      const markerStyle = {
        size: 15,
        color: "#E42C2C",
        symbol: "circle",
        line: {},
      };

      if (
        hoveredUniversity &&
        Object.is(hoveredUniversity, currentUniversity)
      ) {
        markerStyle.color = "fff";
        markerStyle.symbol = "circle-dot";
        markerStyle.line = {
          color: "#E42C2C",
          width: 2,
        };
      }

      plotData.push({
        mode: "markers",
        type: "scatter" as Plotly.PlotType,
        name: "Selected",
        x: [
          currentUniversity[
            `${axisLabels.x}` as keyof typeof currentUniversity
          ],
        ],
        y: [
          currentUniversity[
            `${axisLabels.y}` as keyof typeof currentUniversity
          ],
        ],
        text: [currentUniversity.name],
        customdata: [currentUniversity],
        marker: markerStyle,
        hoverinfo: "none",
      });
    }

    /* fixed range with 5px buffer */
    const axisRangeSize = [-5, 105];

    const layout = {
      width: "400",
      margin: {
        t: "40",
        b: "15",
        r: "10",
        l: "25",
      },
      paper_bgcolor: "#f0f0f0",
      plot_bgcolor: "#f0f0f0",
      showlegend: false,
      xaxis: {
        fixedrange: true,
        range: axisRangeSize,
      },
      yaxis: {
        fixedrange: true,
        range: axisRangeSize,
      },
    };

    const plotOptions = {
      modeBarButtonsToRemove: [
        "toImage" as Plotly.ModeBarDefaultButtons,
        "lasso" as Plotly.ModeBarDefaultButtons,
        "select" as Plotly.ModeBarDefaultButtons,
      ],
    };

    Plotly.newPlot(containerRef.current, plotData, layout, plotOptions).then(
      (sc) => {
        sc.on("plotly_click", (eventData) => {
          if (eventData.points[0].data.name == "") {
            const selectedUniversity = eventData.points[0]
              .customdata as unknown;
            dispatch(setCurrentUniversity(selectedUniversity as IUniversity));
          }
          if (eventData.points[0].data.name == "Selected") {
            dispatch(setCurrentUniversity(null));
          }
        });
        sc.on("plotly_hover", (eventData) => {
          if (eventData.points[0]) {
            const hoveredPoint = eventData.points[0].customdata as unknown;
            setHoveredUniversity(hoveredPoint as IUniversity);
          }
        });
        sc.on("plotly_unhover", () => {
          setHoveredUniversity(null);
        });
      }
    );

    return () => {
      if (!containerRef.current) return;
      Plotly.purge(containerRef.current);
    };
  }, [
    containerRef.current,
    filteredUniversities,
    axisLabels,
    currentUniversity,
    hoveredUniversity,
  ]);

  return (
    <div className="scatter-plot-container">
      <div className="scatter-y-wrapper">
        {axisSelectionModeOn.y && (
          <div className="scatter-y-selector">
            <label>Change Y Axis : </label>
            <select
              onChange={(e) => {
                setAxisLabels({
                  x: axisLabels.x,
                  y: e.target.value,
                });
                setSelectionMode({
                  x: axisSelectionModeOn.x,
                  y: false,
                });
              }}
            >
              {[...axisOptions]
                .filter((v) => v != axisLabels.x)
                .map((attribute) => (
                  <option
                    value={attribute}
                    key={attribute}
                    selected={attribute === axisLabels.y}
                  >
                    {titleCase(attribute)}
                  </option>
                ))}
            </select>
          </div>
        )}
        {!axisSelectionModeOn.y && (
          <div
            className="scatter-y-label"
            onClick={() =>
              setSelectionMode({ x: axisSelectionModeOn.x, y: true })
            }
          >
            <span>{titleCase(axisLabels.y)}</span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 13V11.5H10V9.5H16V8L19 10.5L16 13Z"
                fill="currentColor"
              />
              <path
                d="M8 17V15.5H14V13.5H8V12L5 14.5L8 17Z"
                fill="currentColor"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="scatter-plot-wrapper">
        <div className="scatter-plot-chart" ref={containerRef}></div>
        <div className="scatter-x-label">
          {!axisSelectionModeOn.x && (
            <div
              onClick={() =>
                setSelectionMode({ y: axisSelectionModeOn.y, x: true })
              }
            >
              <span>{titleCase(axisLabels.x)}</span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 16H13.5L13.5 10H15.5L15.5 16H17L14.5 19L12 16Z"
                  fill="currentColor"
                />
                <path
                  d="M8 8H9.5L9.5 14H11.5L11.5 8H13L10.5 5L8 8Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          )}
          {axisSelectionModeOn.x && (
            <div>
              <label> Change X Axis:</label>
              <select
                onChange={(e) => {
                  setAxisLabels({
                    y: axisLabels.y,
                    x: e.target.value,
                  });
                  setSelectionMode({
                    y: axisSelectionModeOn.y,
                    x: false,
                  });
                }}
              >
                {[...axisOptions]
                  .filter((v) => v != axisLabels.y)
                  .map((attribute) => (
                    <option
                      value={attribute}
                      key={attribute}
                      selected={attribute === axisLabels.x}
                    >
                      {titleCase(attribute)}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>
      </div>
      {hoveredUniversity && (
        <div className="scatter-hover-label">
          <div>
            <span>(</span>
            <span>{hoveredUniversity[axisLabels.x as keyof IUniversity]}</span>
            <span>, </span>
            <span>{hoveredUniversity[axisLabels.y as keyof IUniversity]}</span>
            <span>)</span>
          </div>
          <div className="scatter-university-label">
            {hoveredUniversity?.name}, {hoveredUniversity.countryName}
          </div>
        </div>
      )}
    </div>
  );
}
