import ApexCharts from "apexcharts";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import "./RadarChart.css";
import {
  getQSAttributeColor,
  getQSAttributeFontColor,
  getQSAttributeKey,
  getQSAttributeLabel,
  qsAttributeKeys,
} from "../helpers/qsAttributeUtils";
import {
  setQSAttributeToHighlight,
  setUniToHighlight,
  updateCategoriesToInclude,
} from "../state/slices/highlightInteractionSlice";
import CancelSVG from "./svg/CancelSVG";
import AddSVG from "./svg/AddSVG";

export default function RadarChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniToCompare = useAppSelector(
    (state) => state.uniSelection.uniToCompare
  );

  const dispatch = useAppDispatch();

  const highlightedAttribute = useAppSelector(
    (state) => state.highlightInteraction.qsAttributeToHighlight
  );
  const highlightedUni = useAppSelector(
    (state) => state.highlightInteraction.uniToHighlight
  );
  const categories = useAppSelector(
    (state) => state.highlightInteraction.qsCategoriesToInclude
  );

  const tempExcludedCategories = qsAttributeKeys.filter(
    (cat) => !categories.includes(cat)
  );

  const [excludedCategories, setExcludedCategories] = useState(
    tempExcludedCategories
  );
  const [errorMessage, setErrorMessage] = useState(null as string | null);

  const series = uniToCompare.map((uni) => {
    const categoryData = Object.entries(uni)
      .filter(([key]) => categories.includes(key))
      .flatMap((val) => val[1]);
    return {
      name: uni.name,
      data: categoryData,
    };
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const chartOptions = {
      series,
      chart: {
        height: 600,
        type: "radar",
        toolbar: {
          show: false,
        },
        animations: {
          enabled: false,
        },
        events: {
          legendClick: (_: unknown, seriesIndex: number) => {
            if (uniToCompare[seriesIndex].name === highlightedUni?.name) {
              dispatch(setUniToHighlight(null));
            } else {
              dispatch(setUniToHighlight(uniToCompare[seriesIndex]));
            }
          },
          xAxisLabelClick: ({
            target: { innerHTML },
          }: {
            target: { innerHTML: string };
          }) => {
            const qsKey = getQSAttributeKey(innerHTML);
            if (qsKey !== highlightedAttribute) {
              dispatch(setQSAttributeToHighlight(qsKey));
            } else {
              dispatch(setQSAttributeToHighlight(null));
            }
          },
        },
      },
      yaxis: {
        min: 0,
        max: 100,
        stepSize: 20,
      },
      xaxis: {
        categories,
        labels: {
          style: {
            fontWeight: 400,
          },
          formatter: (value: string) => {
            return getQSAttributeLabel(value);
          },
        },
      },
      fill: {
        opacity: 0,
      },
      markers: {
        size: 1,
        strokeOpacity: 0,
      },
      plotOptions: {
        radar: {
          polygons: {
            strokeColors: "#fff",
            fill: {
              colors: ["#E5ECF6"],
            },
            connectorColors: "#fff",
          },
        },
      },
      legend: {
        show: true,
        position: "right",
        horizontalAlign: "left",
        showForSingleSeries: true,
        floating: true,
        offsetY: 230,
        offsetX: -220,
        onItemClick: {
          toggleDataSeries: false,
        },
        onItemHover: {
          highlightDataSeries: highlightedUni === null,
        },
      },
      tooltip: {
        fillSeriesColor: true,
        x: {
          show: false,
          style: {
            fontSize: 18,
          },
        },
        y: {
          show: true,
        },
        followCursor: true,
        fixed: {
          offsetY: -80,
        },
      },
      title: {
        text: "University Comparison",
        align: "center",
        offsetY: 50,
        style: {
          fontSize: "20px",
          fontWeight: "bold",
          color: "#263238",
        },
      },
    };

    const chart = new ApexCharts(containerRef.current, chartOptions);
    chart.render();

    const parent = containerRef.current;
    const labels = parent.querySelectorAll(".apexcharts-xaxis-label");
    labels.forEach(function (el) {
      const qsKey = getQSAttributeKey(el.innerHTML);
      if (qsKey == highlightedAttribute) {
        el.setAttribute("class", "apexcharts-xaxis-label radar-x-label");
        el.setAttribute("fill", getQSAttributeColor(qsKey));
      }
    });

    const legends = parent.querySelectorAll(".apexcharts-legend-series");
    legends.forEach(function (el) {
      const uniName = el.querySelector(".apexcharts-legend-text")?.innerHTML;
      if (highlightedUni && uniName != highlightedUni.name) {
        el.setAttribute(
          "class",
          "apexcharts-legend-series apexcharts-inactive-legend"
        );
      } else {
        el.setAttribute("class", "apexcharts-legend-series");
      }
    });

    if (highlightedUni) {
      chart.highlightSeries(highlightedUni.name);
    }

    return () => {
      if (!containerRef.current) return;
      chart.destroy();
    };
  }, [containerRef.current, categories, series]);

  function flashErrorMessage(message: string) {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 2000);
  }

  function excludeCategory(catName: string) {
    if (categories.length > 3) {
      const ec = [catName, ...excludedCategories];
      setExcludedCategories(ec);
      dispatch(updateCategoriesToInclude(catName));
    } else {
      flashErrorMessage("minimum 3 attributes");
    }
  }

  function includeCategory(catName: string) {
    const filteredCat = [...excludedCategories].filter((v) => v != catName);
    dispatch(updateCategoriesToInclude(catName));
    setExcludedCategories(filteredCat);
  }

  return (
    <div className="radar-chart-group">
      <div className="radar-chart-container" ref={containerRef} />
      <div className="attribute-container">
        <div className="attribute-selector-group">
          {errorMessage && (
            <div className="attribute-error-message">{errorMessage}</div>
          )}
          <h2 style={{ textAlign: "center" }}>Attributes to include</h2>
          <div className="attribute-selector-buttons">
            {categories?.map((cat) => (
              <button
                key={`${cat}-included`}
                className="category-selector included"
                style={{
                  backgroundColor: getQSAttributeColor(cat),
                  color: getQSAttributeFontColor(cat),
                }}
                onClick={() => {
                  excludeCategory(cat);
                }}
              >
                <span>{getQSAttributeLabel(cat)} </span>
                <CancelSVG
                  fill={getQSAttributeFontColor(cat)}
                  width={20}
                  height={20}
                />
              </button>
            ))}
          </div>
        </div>
        <div
          style={{
            width: "1px",
            minHeight: "50%",
            backgroundColor: "black",
            margin: "0 20px",
          }}
        />
        <div className="attribute-selector-group">
          <h2 style={{ textAlign: "center" }}>Attributes to exclude</h2>
          <div className="attribute-selector-buttons">
            {excludedCategories?.map((cat) => (
              <button
                key={`${cat}-excluded`}
                className="category-selector excluded"
                style={{
                  backgroundColor: getQSAttributeColor(cat),
                  color: getQSAttributeFontColor(cat),
                }}
                onClick={() => {
                  includeCategory(cat);
                }}
              >
                {getQSAttributeLabel(cat)}{" "}
                <AddSVG
                  fill={getQSAttributeFontColor(cat)}
                  width={20}
                  height={20}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
