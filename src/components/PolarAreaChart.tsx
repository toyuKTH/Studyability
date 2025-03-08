import { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";
import { IUniversity } from "../state/slices/dataSlice";
import {
  getQSAttributeLabel,
  qsAttributeKeys,
} from "../helpers/qsAttributeUtils";

export default function PolarAreaChart({
  uni,
  empty = false,
}: {
  uni: IUniversity;
  empty?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState([...qsAttributeKeys]);

  useEffect(() => {
    if (!containerRef.current) return;

    const series = categories.map((category) => {
      const categoryData = uni[category as keyof IUniversity];
      return categoryData;
    });

    const chartOptions = {
      series: empty ? [0, 0, 0, 0, 0, 0, 0, 0, 0] : series,
      chart: {
        type: "polarArea",
        width: "100%",
      },
      stroke: {
        colors: ["white"],
        width: 0.3,
        opacity: 0.8,
      },
      yaxis: {
        show: !empty,
      },
      fill: {
        opacity: 0.8,
      },
      legend: {
        position: "top",
        show: false,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      labels: categories.map((category) => getQSAttributeLabel(category)),
    };

    const chart = new ApexCharts(containerRef.current, chartOptions);
    chart.render();

    return () => {
      if (!containerRef.current) return;
      chart.destroy();
    };
  }, [containerRef.current]);

  return <div id="polar-area-chart" ref={containerRef}></div>;
}
