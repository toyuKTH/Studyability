import ApexCharts from "apexcharts";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { getQSAttributeColor } from "../helpers/qsAttributeUtils";
import { setUniToHighlight } from "../state/slices/highlightInteractionSlice";

export default function BarChart({
  title,
  data,
  label,
}: Readonly<{
  title: string;
  data: { x: string; y: number; fillColor: string }[];
  label: string;
}>) {
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const uniToCompare = useAppSelector(
    (state) => state.uniSelection.uniToCompare
  );
  const highlightedUni = useAppSelector(
    (state) => state.highlightInteraction.uniToHighlight
  );

  const maxValue = Math.max(...data.map((d) => d.y));

  useEffect(() => {
    if (!containerRef.current) return;

    const chartOptions = {
      series: [{ data }],
      chart: {
        type: "bar",
        height: 300,
        toolbar: {
          show: false,
        },
        events: {
          dataPointSelection: function (
            event: any,
            chartContext: any,
            opts: any
          ) {
            const clickedUni = uniToCompare.find(
              (uni) => uni.name === data[opts.dataPointIndex].x
            );

            if (!clickedUni) return;

            dispatch(
              setUniToHighlight(
                clickedUni === highlightedUni ? null : clickedUni
              )
            );
          },
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "70%",
        },
      },
      yaxis: {
        min: 0,
        max: maxValue >= 95 ? 100 : maxValue + 5,
      },
      xaxis: {
        labels: {
          trim: true,
        },
      },
      title: {
        text: title,
        style: {
          color: "black",
        },
      },
      tooltip: {
        enabled: false,
      },
      states: {
        hover: {
          filter: {
            type: "darken",
          },
        },
      },
    };

    const chart = new ApexCharts(containerRef.current, chartOptions);
    chart.render();

    return () => {
      if (!containerRef.current) return;
      chart.destroy();
    };
  }, [containerRef.current, uniToCompare, highlightedUni]);
  return (
    <div
      className="bar-chart-container"
      style={{
        borderTop: `3px solid ${getQSAttributeColor(label)}`,
        padding: "10px",
      }}
      ref={containerRef}
    />
  );
}
