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

  const minMaxUnis = useAppSelector(selectUniversitiesMaxMinFilterValues);
  const minMaxCountries = useAppSelector(selectCountriesMaxMinFilterValues);

  const containerRef = useRef<HTMLDivElement>(null);

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
      let constraintRange: [number, number] | null = null;

      switch (key) {
        case "rank":
          constraintRange = [1, 50];
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
          label = "Tuition Fee";
          break;
        case "temperature":
          label = "Temperature";
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
          label = "Cost of Living";
          range = [
            minMaxCountries.costOfLiving.minCostOfLiving,
            minMaxCountries.costOfLiving.maxCostOfLiving,
          ];
          values = Object.keys(data.universities).map((key) => {
            return data.universities[key].cost_of_living_index;
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
        // pad: [80, 80, 80, 80],
        line: {
          color: Object.keys(data.universities).map((key) => {
            const rankNumber = parseInt(data.universities[key].rank);
            return rankNumber;
          }),
          colorscale: [
            [minMaxUnis.rank.minRank, "green"],
            [minMaxUnis.rank.maxRank, "red"],
            [(minMaxUnis.rank.minRank + minMaxUnis.rank.maxRank) / 2, "yellow"],
          ],
          opacity: 2,
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
      width: 600,
      margin: {
        t: "60",
        b: "35",
        r: "50",
        l: "55",
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

  return <div className="plot-container" ref={containerRef} id="graph"></div>;
}
