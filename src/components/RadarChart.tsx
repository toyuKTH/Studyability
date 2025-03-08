import ApexCharts from "apexcharts";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import "./RadarChart.css";
import {
  getQSAttributeColor,
  getQSAttributeKey,
  getQSAttributeLabel,
  qsAttributeKeys,
} from "../helpers/qsAttributeUtils";
import {
  setQSAttributeToHighlight,
  setUniToHighlight,
} from "../state/slices/highlightInteractionSlice";

export default function RadarChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniToCompare = useAppSelector(
    (state) => state.uniSelection.uniToCompare
  );

  const dispatch = useAppDispatch();

  const categoriesOpt = qsAttributeKeys;

  const highlightedAttribute = useAppSelector(
    (state) => state.highlightInteraction.qsAttributeToHighlight
  );
  const highlightedUni = useAppSelector(
    (state) => state.highlightInteraction.uniToHighlight
  );

  const [categories, setCategories] = useState([...categoriesOpt]);
  const [excludedCategories, setExcludedCategories] = useState([] as string[]);
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
        height: 400,
        type: "radar",
        toolbar: {
          show: false,
        },
        parentHeightOffset: -300,
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
            offsetX: -80,
          },
        },
      },
      legend: {
        show: true,
        position: "right",
        horizontalAlign: "left",
        floating: false,
        offsetY: 80,
        offsetX: 170,
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
      const filteredCat = [...categories].filter((v) => v != catName);
      setExcludedCategories(ec);
      setCategories(filteredCat);
    } else {
      flashErrorMessage("minimum 3 attributes");
    }
  }

  function includeCategory(catName: string) {
    const ec = [catName, ...categories];
    const filteredCat = [...excludedCategories].filter((v) => v != catName);
    setCategories(ec);
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
          <span>Attribute(s) To Include :</span>
          <div>
            {categories?.map((cat) => (
              <button
                key={`${cat}-included`}
                className="category-selector included"
                onClick={() => {
                  excludeCategory(cat);
                }}
              >
                <span>{getQSAttributeLabel(cat)} </span>
                <span> x</span>
              </button>
            ))}
          </div>
        </div>
        <div className="attribute-selector-group">
          <span>Attribute(s) To Exclude :</span>
          <div>
            {excludedCategories?.map((cat) => (
              <button
                key={`${cat}-excluded`}
                className="category-selector excluded"
                onClick={() => {
                  includeCategory(cat);
                }}
              >
                {getQSAttributeLabel(cat)} <span>+</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
