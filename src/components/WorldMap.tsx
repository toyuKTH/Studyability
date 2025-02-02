import * as d3 from "d3";
import { useContext, useEffect, useRef, useState } from "react";
import "./WorldMap.css";
import { CountryDispatchContext, d3Dispatch } from "../models/Context";
import { IDispatchType } from "../models/Context.types";
import { worldTopology } from "../data/topologyData/countryTopology";

type MapProps = {
  width: number;
  height: number;
};

export const WorldMap = ({ width, height }: MapProps) => {
  const countryDispatch = useContext(CountryDispatchContext);

  const [svgPaths, setSvgPaths] = useState<JSX.Element[]>([]);
  const [zoomed, setZoomed] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const world = worldTopology;

    const projection = d3
      .geoNaturalEarth1()
      .fitSize([width, height], world as any);

    const geoPath = d3.geoPath(projection);
    var svg = d3.select(svgRef.current);

    const allSvgPaths = worldTopology.features
      .filter((shape) => shape.id !== "ATA")
      .map((shape) => {
        return (
          <path
            key={shape.id}
            id={shape.id?.toString()}
            d={geoPath(shape as any) as any}
            stroke="lightGrey"
            strokeWidth={0.5}
            fill="grey"
            fillOpacity={0.7}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      });

    setSvgPaths(allSvgPaths);

    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .extent([
        [width / 2, height / 2],
        [width, height],
      ])
      .scaleExtent([1, 8])
      .on("zoom", zoomed);

    function zoomed(event: any) {
      svg.selectAll("path").attr("transform", event.transform);
      if (
        event.transform.k !== 1 ||
        event.transform.x !== 0 ||
        event.transform.y !== 0
      )
        setZoomed(true);
      else setZoomed(false);
    }

    svg.call(zoomBehavior as any);

    d3Dispatch.on("countrySelected", (event: { country: string }) => {
      const [[x0, y0], [x1, y1]] = geoPath.bounds(
        worldTopology.features.find(
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
              Math.min(6, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height))
            )
            .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
          d3.pointer(event, svg.node())
        );
    });

    d3Dispatch.on("resetZoom", () => {
      svg
        .transition()
        .duration(750)
        .call(zoomBehavior.transform, d3.zoomIdentity);
    });

    const path = svg.selectAll("path");

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
        countryDispatch({
          type: IDispatchType.selectCountry,
          data: event.target.id,
        });
      }
    });

    return () => {
      d3Dispatch.on("countrySelected", null);
      d3Dispatch.on("resetZoom", null);
      path.on("mouseover", null);
      path.on("mouseleave", null);
      path.on("click", null);
    };
  }, [width, height, svgRef.current]);

  function handleReset() {
    d3Dispatch.call("resetZoom");
  }

  return (
    <div style={{ position: "relative" }}>
      <div className="map-info">
        {zoomed && <button onClick={handleReset}>reset map</button>}
      </div>
      <svg width={width} height={height} ref={svgRef}>
        {svgPaths}
      </svg>
    </div>
  );
};

export default WorldMap;
