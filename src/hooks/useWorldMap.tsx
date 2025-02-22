import * as d3 from "d3";
import { RefObject, useContext, useEffect, useRef, useState } from "react";
import { getAlpha_2 } from "../data/CountryData";
import { worldTopology } from "../data/topologyData/countryTopology";
import { useAppDispatch } from "../state/hooks";
import {
  setHoveredCountry,
  setMapZoomed,
} from "../state/slices/mapInteractionSlice";

export default function useWorldMap({
  width,
  height,
  mapSvgRef,
}: {
  width?: number;
  height?: number;
  mapSvgRef: RefObject<SVGSVGElement>;
}) {
  const dispatch = useAppDispatch();

  const [svgPaths, setSvgPaths] = useState<JSX.Element[]>([]);

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
      .scaleExtent([1, 8]);

    zoomBehavior.on("zoom", zoomed);

    function zoomed(event: any) {
      svg.selectAll("path").attr("transform", event.transform);
      if (
        event.transform.k !== 1 ||
        event.transform.x !== 0 ||
        event.transform.y !== 0
      )
        dispatch(setMapZoomed(true));
      else dispatch(setMapZoomed(false));
    }

    svg.call(zoomBehavior as any);

    svg.on("resetZoom", () => {
      svg
        .transition()
        .duration(750)
        .call(zoomBehavior.transform, d3.zoomIdentity);
    });

    // d3Dispatch.on("countrySelected", (event: { country: string }) => {
    //   const [[x0, y0], [x1, y1]] = geoPath.bounds(
    //     worldTopology.features.find(
    //       (shape) => shape.id === event.country
    //     ) as d3.GeoPermissibleObjects
    //   );
    //   svg
    //     .transition()
    //     .duration(750)
    //     .call(
    //       zoomBehavior.transform,
    //       d3.zoomIdentity
    //         .translate(width / 2, height / 2)
    //         .scale(
    //           Math.min(6, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height))
    //         )
    //         .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
    //       // d3.pointer(event, svg.node())
    //     );
    //   d3.select(`#${event.country}`)
    //     .attr("fill", "cornflowerblue")
    //     .attr("opacity", "1");

    //   d3.selectAll("path")
    //     .filter(function () {
    //       return (
    //         // @ts-ignore
    //         this!.id != event.country
    //       );
    //     })
    //     .attr("fill", "grey")
    //     .attr("opacity", "0.5");
    // });

    const path = svg.selectAll("path");

    // const handleClicked = (event: any) => {
    //   if (event.target.tagName === "path") {
    //     // console.log("selecting country");
    //     countryDispatch({
    //       type: IDispatchType.selectCountry,
    //       data: event.target.id,
    //     });
    //   }
    // };

    // path.on("click", handleClicked);

    console.log("map rendered");

    return () => {
      path.on("click", null);
    };
  }, [width, height, mapSvgRef.current]);

  useEffect(() => {
    if (!mapSvgRef.current || svgPaths.length === 0) return;

    const path = d3.select(mapSvgRef.current).selectAll("path");

    const handleMouseOver = (event: any) => {
      dispatch(setHoveredCountry(event.target.id));
    };

    const handleMouseLeave = (event: any) => {
      dispatch(setHoveredCountry(""));
    };

    path.on("mouseover", handleMouseOver);
    path.on("mouseleave", handleMouseLeave);

    return () => {
      path.on("mouseover", null);
      path.on("mouseleave", null);
      path.on("click", null);
    };
  }, [mapSvgRef.current, svgPaths]);

  return { svgPaths, mapSvgRef };
}
