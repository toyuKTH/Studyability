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

  const highlighted = useAppSelector(
    (state) => state.highlightInteraction.qsAttributeToHighlight
  );

  const [categories, setCategories] = useState([...categoriesOpt]);
  const [excludedCategories, setExcludedCategories] = useState([] as string[]);

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
        events: {
          legendClick: (
            _: unknown,
            seriesIndex: number,
            { globals: { chartID } }: { globals: { chartID: string } }
          ) => {
            dispatch(setUniToHighlight(uniToCompare[seriesIndex]));
            ApexCharts.exec(chartID, "hideSeries", series[0].name);
          },
          xAxisLabelClick: ({
            target: { innerHTML },
          }: {
            target: { innerHTML: string };
          }) => {
            dispatch(setQSAttributeToHighlight(getQSAttributeKey(innerHTML)));
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
      animations: {
        enabled: true,
        speed: 800,
      },
    };

    const chart = new ApexCharts(containerRef.current, chartOptions);
    chart.render();

    const parent = containerRef.current;
    const labels = parent.querySelectorAll(".apexcharts-xaxis-label");
    labels.forEach(function (el) {
      const qsKey = getQSAttributeKey(el.innerHTML);
      if (qsKey == highlighted) {
        el.setAttribute("class", "radar-x-label");
        el.setAttribute("fill", getQSAttributeColor(qsKey));
      }
    });

    return () => {
      if (!containerRef.current) return;
      chart.destroy();
    };
  }, [containerRef.current, categories, series]);

  function excludeCategory(catName: string) {
    const ec = [catName, ...excludedCategories];
    const filteredCat = [...categories].filter((v) => v != catName);
    setExcludedCategories(ec);
    setCategories(filteredCat);
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
