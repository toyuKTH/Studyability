import ApexCharts from "apexcharts";
import { useEffect, useRef } from "react";
import { useAppSelector } from "../state/hooks";

export default function BarChart({
  title,
  data,
}: Readonly<{
  title: string;
  data: { x: string; y: number; fillColor: string };
  label: string[];
}>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniToCompare = useAppSelector(
    (state) => state.uniSelection.uniToCompare
  );
  const highlightedUni = useAppSelector(
    (state) => state.highlightInteraction.uniToHighlight
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const chartOptions = {
      series: [{ data }],
      chart: {
        type: "bar",
        height: 310,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "70%",
        },
      },
      yaxis: {
        min: 0,
        max: 100,
      },
      xaxis: {
        label: {
          trim: true,
        },
      },
      title: {
        text: title,
      },
      tooltip: {
        enabled: false,
      },
      onItemHover: {
        highlightDataSeries: false,
      },
    };

    const chart = new ApexCharts(containerRef.current, chartOptions);
    chart.render();

    return () => {
      if (!containerRef.current) return;
      chart.destroy();
    };
  }, [containerRef.current, uniToCompare, highlightedUni]);
  return <div className="bar-chart-container" ref={containerRef} />;
}
