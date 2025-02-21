import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import {
  selectCountriesMaxMinFilterValues,
  selectUniversitiesMaxMinFilterValues,
} from "../state/slices/dataSlice";
import * as Plotly from "plotly.js-dist-min";

import "./ParallelPlot.css";
import {
  FilterAttribute,
  FilterSubAttribute,
  FilterType,
  updateFilter,
} from "../state/slices/filterSlice";

export default function ParallelPlot() {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.data);

  const minMaxUnis = useAppSelector(selectUniversitiesMaxMinFilterValues);
  const minMaxCountries = useAppSelector(selectCountriesMaxMinFilterValues);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const dimensionDataSets = [
      {
        dataset: FilterType.UniversityRankings,
        attribute: FilterAttribute.QSRankingInfo,
        subAttribute: FilterSubAttribute.Rank,
      },
      {
        dataset: FilterType.UniversityRankings,
        attribute: FilterAttribute.TuitionFee,
        subAttribute: FilterSubAttribute.TuitionFee,
      },
      {
        dataset: FilterType.Countries,
        attribute: FilterAttribute.Temperature,
      },
      {
        dataset: FilterType.Countries,
        attribute: FilterAttribute.EfScore,
        subAttribute: FilterSubAttribute.EFScore,
      },
      {
        dataset: FilterType.Countries,
        attribute: FilterAttribute.CostOfLiving,
        subAttribute: FilterSubAttribute.CostOfLivingIndex,
      },
    ];

    const dimensions = [
      {
        range: [minMaxUnis.rank.minRank, minMaxUnis.rank.maxRank],
        label: "rank",
        values: Object.keys(data.universities).map((key) => {
          const rankNumber = parseInt(
            data.universities[key].qsRankingInfo.rank
          );
          return rankNumber;
        }),
      },
      {
        range: [
          minMaxUnis.tuitionFee.minTuitionFee,
          minMaxUnis.tuitionFee.maxTuitionFee,
        ],
        label: "tuition_fee",
        values: Object.keys(data.universities).map((key) => {
          return data.universities[key].tuitionFee.amount;
        }),
      },
      {
        label: "average_temperature",
        range: [
          minMaxCountries.temperature.minTemperature,
          minMaxCountries.temperature.maxTemperature,
        ],
        values: Object.keys(data.countries).reduce((acc: number[], key) => {
          if (!data.countries[key].temperature) {
            return acc;
          } else {
            acc.push(data.countries[key].temperature);
          }
          return acc;
        }, []),
      },
      {
        label: "english_proficiency",
        range: [
          minMaxCountries.englishProficiency.minEnglishProficiency,
          minMaxCountries.englishProficiency.maxEnglishProficiency,
        ],
        values: Object.keys(data.countries).reduce((acc: number[], key) => {
          if (!data.countries[key].efScore.ef_score) {
            return acc;
          } else {
            acc.push(data.countries[key].efScore.ef_score);
          }
          return acc;
        }, []),
      },
      {
        label: "cost_of_living",
        range: [
          minMaxCountries.costOfLiving.minCostOfLiving,
          minMaxCountries.costOfLiving.maxCostOfLiving,
        ],
        values: Object.keys(data.countries).map((key) => {
          return data.countries[key].costOfLiving.cost_of_living_index;
        }),
      },
    ];

    var plotData = [
      {
        type: "parcoords" as Plotly.PlotType,
        // pad: [80, 80, 80, 80],
        line: {
          color: Object.keys(data.universities).map((key) => {
            const rankNumber = parseInt(
              data.universities[key].qsRankingInfo.rank
            );
            return rankNumber;
          }),
          colorscale: [
            [minMaxUnis.rank.maxRank, "red"],
            [(minMaxUnis.rank.minRank + minMaxUnis.rank.maxRank) / 2, "yellow"],
            [minMaxUnis.rank.minRank, "green"],
          ],
        },
        dimensions,
      },
    ];

    var layout = {
      width: 600,
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
              filterData: dimensionDataSets[number].dataset,
              filterAttribute: dimensionDataSets[number].attribute,
              filterSubAttribute: dimensionDataSets[number].subAttribute,
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
