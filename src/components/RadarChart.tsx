import ApexCharts from "apexcharts";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../state/hooks";
import "./RadarChart.css";

export default function RadarChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniToCompare = useAppSelector(
    (state) => state.uniSelection.uniToCompare
  );

  const categoriesOpt = [
    //  "international_faculty_ratio",
    "academic_reputation",
    "employment_outcomes",
    "international_students",
    "sustainability",
    "employer_reputation",
    "faculty_student",
    "citations_per_faculty",
    "international_faculty",
    "international_research_network",
  ];

  const [categories, setCategories] = useState([...categoriesOpt]);
  const [excludedCategories, setExcludedCategories] = useState([]);

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
        width: 500,
        type: "radar",
      },
      yaxis: {
        min: 0,
        max: 100,
        stepSize: 20,
      },
      xaxis: {
        categories,
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
      animations: {
        enabled: true,
        speed: 800,
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    };

    const chart = new ApexCharts(containerRef.current, chartOptions);
    chart.render();

    return () => {
      if (!containerRef.current) return;
      chart.destroy();
    };
  }, [containerRef.current, categories, uniToCompare]);

  return (
    <div className="radar-chart-group">
      <div className="radar-chart-container" ref={containerRef} />
    </div>
  );
}
