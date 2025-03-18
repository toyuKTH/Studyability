import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import {
  selectCountriesMaxMinFilterValues,
  selectUniversitiesMaxMinFilterValues,
} from "../state/slices/dataSlice";
import * as Plotly from "plotly.js-dist-min";

import "./ParallelPlot.css";
import { IFilterState, updateFilter } from "../state/slices/filterSlice";

export default function ParallelPlot() {
  const dispatch = useAppDispatch();

  const data = useAppSelector((state) => state.data);
  const filters = useAppSelector((state) => state.filter);
  const minMaxUnis = useAppSelector(selectUniversitiesMaxMinFilterValues);
  const minMaxCountries = useAppSelector(selectCountriesMaxMinFilterValues);

  const isPlotHighlighted = useAppSelector(
    (state) => state.highlightInteraction.isParaplotHighlighted
  );

  const containerRef = useRef<HTMLDivElement>(null);

  let paperBGColor = "#f0f0f0";

  useEffect(() => {
    if (!containerRef.current) return;

    const dimensionDataKeys: (
      | keyof IFilterState["universityRankings"]
      | keyof IFilterState["countries"]
    )[] = [
      "temperature",
      "ef_score",
      "cost_of_living_index",
      "rank",
      "tuitionFee",
    ];

    const dimensions = dimensionDataKeys.map((key) => {
      let range: [number, number] = [0, 0];
      let values: number[] = [];
      let label = "";
      let constraintRange: [[number, number]] | [] = [];
      let currentFilter: [[number, number]] | [] = [];

      switch (key) {
        case "rank":
          currentFilter = filters.universityRankings["rank"].domain;

          if (currentFilter.length > 0) {
            constraintRange = currentFilter;
          } else {
            constraintRange = [[1, 50]];
          }

          range = [minMaxUnis.rank.maxRank, minMaxUnis.rank.minRank];
          values = Object.keys(data.universities).map((key) => {
            const rankNumber = parseInt(data.universities[key].rank);
            if (isNaN(rankNumber)) {
              return minMaxUnis.rank.maxRank;
            }
            return rankNumber;
          });
          label = "Rank";
          break;
        case "tuitionFee":
          currentFilter = filters.universityRankings["tuitionFee"].domain;

          if (currentFilter.length > 0) {
            constraintRange = currentFilter;
          } else {
            constraintRange = [];
          }

          range = [
            minMaxUnis.tuitionFee.minTuitionFee,
            minMaxUnis.tuitionFee.maxTuitionFee,
          ];
          values = Object.keys(data.universities).map((key) => {
            const tuitionFee = data.universities[key].tuitionFee;
            if (!tuitionFee || isNaN(tuitionFee)) {
              return minMaxUnis.tuitionFee.minTuitionFee;
            }
            return tuitionFee;
          });
          label = "Tuition Fee (USD)";
          break;
        case "temperature":
          currentFilter = filters.countries["temperature"].domain;

          if (currentFilter.length > 0) {
            constraintRange = currentFilter;
          } else {
            constraintRange = [];
          }

          label = "Temperature (°C)";
          range = [
            minMaxCountries.temperature.minTemperature,
            minMaxCountries.temperature.maxTemperature,
          ];
          values = Object.keys(data.universities).reduce(
            (acc: number[], key) => {
              if (!data.universities[key].temperature) {
                acc.push(minMaxCountries.temperature.maxTemperature);
              } else {
                acc.push(data.universities[key].temperature);
              }
              return acc;
            },
            []
          );
          break;
        case "ef_score":
          currentFilter = filters.countries["ef_score"].domain;

          if (currentFilter.length > 0) {
            constraintRange = currentFilter;
          } else {
            constraintRange = [];
          }

          label = "English Proficiency";
          range = [
            minMaxCountries.englishProficiency.minEnglishProficiency,
            minMaxCountries.englishProficiency.maxEnglishProficiency,
          ];
          values = Object.keys(data.universities).reduce(
            (acc: number[], key) => {
              if (!data.universities[key].ef_score) {
                acc.push(
                  minMaxCountries.englishProficiency.maxEnglishProficiency
                );
              } else {
                acc.push(data.universities[key].ef_score);
              }
              return acc;
            },
            []
          );
          break;
        case "cost_of_living_index":
          currentFilter = filters.countries["cost_of_living_index"].domain;

          if (currentFilter.length > 0) {
            constraintRange = currentFilter;
          } else {
            constraintRange = [];
          }

          label = "Cost of Living";
          range = [
            minMaxCountries.costOfLiving.minCostOfLiving,
            minMaxCountries.costOfLiving.maxCostOfLiving,
          ];
          values = Object.keys(data.universities).map((key) => {
            return (
              data.universities[key].cost_of_living_index ||
              minMaxCountries.costOfLiving.maxCostOfLiving
            );
          });
          break;
      }

      return {
        range,
        label,
        values,
        constraintrange: constraintRange,
      };
    });

    const plotData = [
      {
        type: "parcoords" as Plotly.PlotType,
        line: {
          color: Object.keys(data.universities).map((key) => {
            const rankNumber = parseInt(data.universities[key].rank);
            return rankNumber;
          }),
          colorscale: [
            [0, "#3498DB"], // bule
            [0.5, "#9B59B6"], // puper
            [1, "#E42C2C"], // red
          ],
          opacity: 10,
        },
        dimensions,
        unselected: {
          line: {
            color: "#afafb3",
          },
        },
      },
    ];

    const layout = {
      autosize: true,
      margin: {
        t: 60,
        b: 35,
        r: 50,
        l: 55,
      },
      paper_bgcolor: paperBGColor,
      font: {
        family: "Arial Black, sans-serif",
        size: 12,
        color: "#000000",
      },
    };

    Plotly.newPlot(containerRef.current, plotData, layout, {
      responsive: true,
    }).then((gd) => {
      gd.on("plotly_restyle", (eventData) => {
        const match = Object.keys(eventData[0])[0].match(/dimensions\[(\d+)\]/);
        if (match && match[1]) {
          const number = parseInt(match[1], 10);

          let domain = [];
          if (Object.values(eventData[0])[0]) {
            domain = Object.values(eventData[0])[0][0];
            if (typeof domain[0] === "number") {
              domain = [domain];
            }
          }

          dispatch(
            updateFilter({
              filterAttribute: dimensionDataKeys[number],
              domain,
            })
          );
        } else {
          console.log("No number found");
        }
      });
    });

    return () => {
      if (!containerRef.current) return;
      Plotly.purge(containerRef.current);
    };
  }, [containerRef.current]);

  return (
    <div className="plot-container" ref={containerRef} id="graph">
      <div
        className="highlight-mask"
        hidden={!isPlotHighlighted}
        style={{
          width: containerRef.current?.clientWidth,
          height: containerRef.current?.clientHeight,
        }}
      />
    </div>
  );
}
