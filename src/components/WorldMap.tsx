import * as d3 from "d3";
import { Dispatch, ZoomBehavior } from "d3";
import { FeatureCollection } from "geojson";
import { useEffect, useRef, useState } from "react";
import "./WorldMap.css";

type MapProps = {
  width: number;
  height: number;
  data: FeatureCollection;
  costumeDispatch: Dispatch<object>;
};

export const WorldMap = ({
  width,
  height,
  data,
  costumeDispatch,
}: MapProps) => {
  const [zoomed, setZoomed] = useState(false);

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
      if (
        event.transform.k !== 1 ||
        event.transform.x !== 0 ||
        event.transform.y !== 0
      )
        setZoomed(true);
      else setZoomed(false);
    }

    svg.call(zoomBehavior);

    costumeDispatch.on("countrySelected", (event: { country: string }) => {
      const [[x0, y0], [x1, y1]] = geoPathGenerator.bounds(
        data.features.find(
          (shape) => shape.id === event.country
        ) as d3.GeoPermissibleObjects
      );
      svg
        .transition()
        .duration(750)
        .call(
          zoomBehavior.transform,
          d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(
              Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height))
            )
            .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
          d3.pointer(event, svg.node())
        );
    });

    costumeDispatch.on("resetZoom", () => {
      svg
        .transition()
        .duration(750)
        .call(zoomBehavior.transform, d3.zoomIdentity);
    });

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

    path.on("click", (event) => {
      if (event.target.tagName === "path") {
        costumeDispatch.call("countrySelected", event, {
          country: event.target.id,
        });
      }
    });

    return () => {
      costumeDispatch.on("countrySelected", null);
      costumeDispatch.on("resetZoom", null);
    };
  }, [svgRef.current, width, height]);

  function handleReset() {
    costumeDispatch.call("resetZoom");
  }

  return (
    <div style={{ position: "relative" }}>
      <div className="map-info">
        {zoomed && <button onClick={handleReset}>reset map</button>}
      </div>
      <svg width={width} height={height} ref={svgRef}>
        {allSvgPaths}
      </svg>
    </div>
  );
};

export default WorldMap;
