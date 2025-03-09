import ApexCharts from "apexcharts";
import { useEffect, useRef } from "react";
import { useAppSelector } from "../state/hooks";
import "./RadialBar.css";

export default function RadialBar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentUniversity = useAppSelector(
    (state) => state.uniSelection.currentUniversity
  );

  useEffect(() => {
    if (currentUniversity == null) return;
    if (!containerRef.current) return;

    const chartOptions = {
      chart: {
        height: "100%",
        width: "100%",
        type: "radialBar",
        // background: "#fff",
        enableTooltip: true,
      },
      series: [
        currentUniversity.sustainability,
        currentUniversity.academic_reputation,
        currentUniversity.employment_outcomes,
        currentUniversity.international_students,
      ],
      labels: [
        "Sustainability",
        "Academic Reputation",
        "Employment Outcomes",
        "International Students",
      ],
      colors: ["#FF6B57", "#FF3F34", "#E72C35", "#C3202F"],
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: "30%",
            background: "transparent",
            image: undefined,
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: true,
              formatter: function (val: string) {
                return val;
              },
            },
          },
          barLabels: {
            enabled: true,
            useSeriesColors: true,
            offsetX: -8,
            fontSize: "11px",
            formatter: function (seriesName: string, _: any) {
              return seriesName;
            },
          },
        },
      },
      grid: {
        padding: {
          top: 0,
          right: -10,
          bottom: 0,
          left: 10,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: false,
            },
          },
        },
      ],
    };

    const chart = new ApexCharts(containerRef.current, chartOptions);
    chart.render();

    return () => {
      if (!containerRef.current) return;
      chart.destroy();
    };
  }, [containerRef.current, currentUniversity]);

  return <div className="radial-bar-container" ref={containerRef} />;
}
