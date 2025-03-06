import ApexCharts from "apexcharts";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../state/hooks";
import "./RadarChart.css";
import {
  getQSAttributeLabel,
  qsAttributeKeys,
} from "../helpers/qsAttributeUtils";

export default function RadarChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniToCompare = useAppSelector(
    (state) => state.uniSelection.uniToCompare
  );

  const categoriesOpt = qsAttributeKeys;

  const highlighted = "international_faculty";

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
      if (el.innerHTML.toString() == highlighted) {
        /* just try to mimic highlight */
        el.setAttribute("class", "radar-x-label");
      }
    });

    return () => {
      if (!containerRef.current) return;
      chart.destroy();
    };
  }, [containerRef.current, categories, uniToCompare]);

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
