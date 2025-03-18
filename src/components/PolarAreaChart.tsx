import { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import { IUniversity } from "../state/slices/dataSlice";
import {
  getQSAttributeColor,
  getQSAttributeLabel,
  qsAttributeKeys,
} from "../helpers/qsAttributeUtils";
import "./PolarAreaChart.css";

export default function PolarAreaChart({
  uni,
  empty = false,
}: {
  uni: IUniversity;
  empty?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let series = qsAttributeKeys.map((category) => {
      const categoryData = uni[category as keyof IUniversity];
      return categoryData;
    });

    series = series.reduce((acc, val) => {
      const num = Number(val);
      if (num) {
        acc.push(num);
      }
      return acc;
    }, [] as number[]);

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
      xaxis: {
        formatter: (val: string) => getQSAttributeLabel(val),
      },
      fill: {
        opacity: 0.9,
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
      labels: qsAttributeKeys.map((category) => getQSAttributeLabel(category)),
      colors: qsAttributeKeys.map((category) => getQSAttributeColor(category)),
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
