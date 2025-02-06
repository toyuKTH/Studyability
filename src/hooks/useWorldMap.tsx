import * as d3 from "d3";
import { useContext, useEffect, useRef, useState } from "react";
import {
  CountryContext,
  CountryDispatchContext,
  d3Dispatch,
} from "../context/Context";
import { getAlpha_2 } from "../data/CountryData";
import { worldTopology } from "../data/topologyData/countryTopology";
import { IDispatchType } from "../models/Context.types";

export default function useWorldMap({
  width,
  height,
  setZoomed,
}: {
  width?: number;
  height?: number;
  setZoomed: (value: boolean) => void;
}) {
  const countryContext = useContext(CountryContext);
  const countryDispatch = useContext(CountryDispatchContext);

  const [svgPaths, setSvgPaths] = useState<JSX.Element[]>([]);
  const mapSvgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!mapSvgRef.current || !width || !height) return;

    const world = worldTopology;

    const projection = d3
      .geoNaturalEarth1()
      .fitSize([width, height], world as any);

    const geoPath = d3.geoPath(projection);
    var svg = d3.select(mapSvgRef.current);

    const allSvgPaths = worldTopology.features
      .filter((shape) => shape.id !== "ATA")
      .map((shape) => {
        return (
          <path
            key={shape.id}
            id={shape.id.toString()}
            d={geoPath(shape as any) as string}
            stroke="lightGrey"
            strokeWidth={0.5}
            fill="grey"
            fillOpacity={0.7}
            strokeLinecap="round"
            strokeLinejoin="round"
            cursor={"pointer"}
            data-alpha_2={getAlpha_2(shape.id)}
            data-alpha_3={shape.id}
            data-unis={0}
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
            .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
          // d3.pointer(event, svg.node())
        );
      d3.select(`#${event.country}`)
        .attr("fill", "cornflowerblue")
        .attr("opacity", "1");

      d3.selectAll("path")
        .filter(function (d: any) {
          return (
            // @ts-ignore
            this!.id != event.country
          );
        })
        .attr("fill", "grey")
        .attr("opacity", "0.5");
    });

    d3Dispatch.on("resetZoom", () => {
      svg
        .transition()
        .duration(750)
        .call(zoomBehavior.transform, d3.zoomIdentity);
    });

    const path = svg.selectAll("path");

    // const handleMouseOver = (event: any) => {
    //   if (event.target.tagName === "path" && event.target.id) {
    //     d3.select(`#${event.target.id}`)
    //       .attr("fill", "cornflowerblue")
    //       .attr("opacity", "1");
    //     // d3.selectAll("path").attr("opacity", "0.5");
    //     // d3.select(`#${event.target.id}`).attr("opacity", "1");

    //     const filteredPaths = d3.selectAll("path").filter(function (d: any) {
    //       return (
    //         // @ts-ignore
    //         this!.id != countryContext.selectedCountry &&
    //         // @ts-ignore
    //         this!.id != event.target.id
    //       );
    //     });
    //     filteredPaths.attr("opacity", "0.5");

    //     countryDispatch({
    //       type: IDispatchType.hoverCountry,
    //       data: event.target.id,
    //     });
    //     // if (countryTooltipRef.current) {
    //     //   countryTooltipRef.current.innerHTML = event.target.id;
    //     //   countryTooltipRef.current.classList.add("country-tooltip");
    //     // }
    //   }
    // };

    // const handleMouseLeave = (event: any) => {
    //   if (event.target.tagName === "path") {
    //     if (countryContext.selectedFilter) {
    //       d3.select(`#${countryContext.hoveredCountry}`)
    //         .attr("fill", "grey")
    //         .attr("opacity", "1");
    //     }
    //     console.log(countryContext.selectedCountry);

    //     const filteredPaths = d3.selectAll("path").filter(function (d: any) {
    //       return (
    //         // @ts-ignore
    //         this!.id != countryContext.selectedCountry
    //       );
    //     });
    //     filteredPaths
    //       .attr("fill", "grey")
    //       .attr("opacity", countryContext.selectedCountry ? "0.5" : "1");

    //     countryDispatch({
    //       type: IDispatchType.hoverCountry,
    //       data: "",
    //     });

    //     // if (countryTooltipRef.current) {
    //     //   countryTooltipRef.current.innerHTML = "";
    //     //   countryTooltipRef.current.classList.remove("country-tooltip");
    //     // }
    //   }
    // };

    // const handleClicked = (event: any) => {
    //   if (event.target.tagName === "path") {
    //     // console.log("selecting country");
    //     countryDispatch({
    //       type: IDispatchType.selectCountry,
    //       data: event.target.id,
    //     });
    //   }
    // };

    // path.on("mouseover", handleMouseOver);
    // path.on("mouseleave", handleMouseLeave);
    // path.on("click", handleClicked);

    console.log("map rendered");

    return () => {
      d3Dispatch.on("countrySelected", null);
      d3Dispatch.on("resetZoom", null);
      path.on("mouseover", null);
      path.on("mouseleave", null);
      path.on("click", null);
    };
  }, [width, height, mapSvgRef.current, countryContext.selectedCountry]);

  return { svgPaths, mapSvgRef };
}
