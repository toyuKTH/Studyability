import * as d3 from "d3";
import { FeatureCollection } from "geojson";
import { useEffect, useRef } from "react";

type MapProps = {
  width: number;
  height: number;
  data: FeatureCollection;
};

export const WorldMap = ({ width, height, data }: MapProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const projection = d3.geoNaturalEarth1().fitSize([width, height], data);

  const geoPathGenerator = d3.geoPath().projection(projection);

  const allSvgPaths = data.features
    .filter((shape) => shape.id !== "ATA")
    .map((shape) => {
      return (
        <path
          key={shape.id}
          id={shape.id?.toString()}
          d={geoPathGenerator(shape) as string}
          stroke="lightGrey"
          strokeWidth={0.5}
          fill="grey"
          fillOpacity={0.7}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    });

  useEffect(() => {
    if (!svgRef.current) return;

    var svg = d3.select(svgRef.current);
    var path = svg.selectAll("path");

    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .extent([
        [width / 2, height / 2],
        [width, height],
      ])
      .scaleExtent([1, 8])
      .on("zoom", zoomed);

    function zoomed(event: any) {
      path.attr("transform", event.transform);
    }

    const dragBehavior = d3.drag<SVGSVGElement, unknown>().on("drag", dragged);

    function dragged(event: any) {
      var [x, y] = d3.pointer(event, svg);

      svg.attr("transform", `translate(${x}, ${y})`);
    }

    svg.call(zoomBehavior);
    svg.call(dragBehavior);

    path.on("mouseover", (event) => {
      if (event.target.tagName === "path") {
        svg.style("cursor", "pointer");
        d3.select(`#${event.target.id}`).attr("fill", "cornflowerblue");
        d3.selectAll("path").attr("opacity", "0.5");
        d3.select(`#${event.target.id}`).attr("opacity", "1");
      }
    });

    path.on("mouseleave", (event) => {
      if (event.target.tagName === "path") {
        d3.select(`#${event.target.id}`).attr("fill", "grey");
        d3.selectAll("path").attr("opacity", "1");
        svg.style("cursor", "default");
      }
    });
  }, [svgRef.current]);

  return (
    <div>
      <svg width={width} height={height} ref={svgRef}>
        {allSvgPaths}
      </svg>
    </div>
  );
};

export default WorldMap;
