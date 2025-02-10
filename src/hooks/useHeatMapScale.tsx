import * as d3 from "d3";
import { useRef, useEffect, useContext, useState } from "react";
import { getNumberOfUniversityRankings } from "../data/CountryData";
import { useAppSelector } from "../state/hooks";

export interface IHeatMapScaleConfig {
  paintedObject: {
    selector: string;
    unselectedItems: {
      opacity: string;
      fill: string;
    };
    selectedItems: {
      fill: {
        interpolator: (t: number) => string;
        domain: [number, number];
        clamp: boolean;
      };
      opacity: string;
    };
  };
  axis: {
    dimensions: {
      height: number;
      margins: {
        top: number;
        right: number;
        bottom: number;
        left: number;
      };
      tickRatio: number;
      tickSize: number;
    };
  };
}

export default function useHeatMapScale(scaleConfig: IHeatMapScaleConfig) {
  const showFilter = useAppSelector(
    (state) => state.filter.universityRankings.showing
  );

  const filterDomain = useAppSelector(
    (state) => state.filter.universityRankings.domain
  );

  const scaleSvgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (
      !scaleSvgRef.current ||
      scaleSvgRef.current.clientWidth < 20 ||
      !showFilter
    )
      return;

    const svg = d3.select(scaleConfig.paintedObject.selector);
    const path = svg.selectAll("path");

    console.log("filterByUniversity");

    path
      .attr("opacity", scaleConfig.paintedObject.unselectedItems.opacity)
      .attr("fill", scaleConfig.paintedObject.unselectedItems.fill);

    // path.on("mouseover", function () {
    //   dispatchContext({
    //     type: IDispatchType.hoverCountry,
    //     // @ts-ignore
    //     data: this!.dataset.dataUnis as string,
    //   });
    // });

    const filterPaths = path.filter(function (_) {
      // @ts-ignore
      const numberOfUnis = getNumberOfUniversityRankings(this!.id);

      // @ts-ignore
      this!.dataset.dataUnis = numberOfUnis;
      return numberOfUnis ? numberOfUnis > 0 : false;
    });

    filterPaths
      .attr("fill", function () {
        const color = d3.scaleSequential(
          scaleConfig.paintedObject.selectedItems.fill.interpolator
        );
        color.domain(filterDomain);
        color.clamp(scaleConfig.paintedObject.selectedItems.fill.clamp);
        // @ts-ignore
        return color(this!.dataset.dataUnis);
      })
      .attr("opacity", scaleConfig.paintedObject.selectedItems.opacity);

    const scaleSvg = d3.select(scaleSvgRef.current);

    const defs = scaleSvg.append("defs");

    const color = d3.scaleSequential(
      scaleConfig.paintedObject.selectedItems.fill.interpolator
    );
    color.domain(filterDomain);

    const linearGradient = defs
      .append("linearGradient")
      .attr("id", "linear-gradient");

    linearGradient
      .selectAll("stop")
      .data(
        // @ts-ignore
        color.ticks().map((t, i, n) => ({
          offset: `${(100 * i) / n.length}%`,
          color: color(t),
        }))
      )
      .enter()
      .append("stop")
      .attr("offset", (d: any) => d.offset)
      .attr("stop-color", (d: any) => d.color);

    const axisScale = d3
      .scaleLinear()
      .domain(color.domain())
      .range([
        scaleConfig.axis.dimensions.margins.left,
        scaleSvgRef.current.clientWidth -
          scaleConfig.axis.dimensions.margins.right,
      ]);

    const axisBottom = (g: any) =>
      g
        .attr("class", `x-axis`)
        .attr("transform", `translate(0,${scaleConfig.axis.dimensions.height})`)
        .call(
          d3
            .axisBottom(axisScale)
            .ticks(
              scaleSvgRef.current?.clientWidth! /
                scaleConfig.axis.dimensions.tickRatio
            )
            .tickSize(-scaleConfig.axis.dimensions.tickSize)
        );
    scaleSvg
      .append("g")
      .attr(
        "transform",
        `translate(${scaleConfig.axis.dimensions.margins.left},0)`
      )
      .append("rect")
      .attr(
        "width",
        scaleSvgRef.current.clientWidth -
          scaleConfig.axis.dimensions.margins.left -
          scaleConfig.axis.dimensions.margins.right
      )
      .attr("height", scaleConfig.axis.dimensions.height)
      .style("fill", "url(#linear-gradient)");

    scaleSvg.append("g").call(axisBottom);

    return () => {
      const svg = d3.select(scaleConfig.paintedObject.selector);
      const path = svg.selectAll("path");
      path.attr("opacity", "1").attr("fill", "grey");
      scaleSvg.selectAll("*").remove();
    };
  }, [
    scaleSvgRef.current,
    scaleSvgRef.current?.clientWidth,
    filterDomain,
    showFilter,
  ]);

  return {
    scaleSvgRef,
  };
}
