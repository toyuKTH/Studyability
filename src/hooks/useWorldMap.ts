import d3, { svg, geoPath } from "d3";
import { useEffect, useRef } from "react";
import { d3Dispatch } from "../context/Context";
import { getAlpha_2 } from "../data/CountryData";
import { worldTopology } from "../data/topologyData/countryTopology";
import { IDispatchType } from "../models/Context.types";

export default function useWorldMap({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const mapSvgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!mapSvgRef.current) return;

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
            d={geoPath(shape as any) as any}
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

    const filterByUniversity = () => {
      const pathTest = d3.selectAll("path");
      pathTest.attr("opacity", "0.1");
      const filterPaths = pathTest.filter(function (d) {
        // @ts-ignore
        const alpha_2 = getAlpha_2(this!.id);
        if (alpha_2 == null) return false;
        const numberOfUnis =
          countryContext.data.countryCityUniversityData?.filter(
            (d) => d.alpha_2 === alpha_2
          ).length;
        // @ts-ignore
        this!.dataset.dataUnis = numberOfUnis;
        return numberOfUnis ? numberOfUnis > 0 : false;
      });

      filterPaths
        .attr("fill", function () {
          // @ts-ignore
          const color = d3.scaleSequential(d3.interpolateBlues);
          color.domain([0, 30]);
          color.clamp(true);
          // @ts-ignore
          return color(this!.dataset.dataUnis);
        })
        .attr("opacity", "1");

      const defs = svg.append("defs");

      const colorScale = d3
        .scaleSequential(d3.interpolateBlues)
        .domain([0, 30]);

      const linearGradient = defs
        .append("linearGradient")
        .attr("id", "linear-gradient");

      linearGradient
        .selectAll("stop")
        .data(
          // @ts-ignore
          colorScale.ticks().map((t, i, n) => ({
            offset: `${(100 * i) / n.length}%`,
            color: colorScale(t),
          }))
        )
        .enter()
        .append("stop")
        .attr("offset", (d: any) => d.offset)
        .attr("stop-color", (d: any) => d.color);
      const axisScale = d3
        .scaleLinear()
        .domain(colorScale.domain())
        .range([10, width - 10]);
      const axisBottom = (g: any) =>
        g
          .attr("class", `x-axis`)
          .attr("transform", `translate(0,${height - 20})`)
          .call(
            d3
              .axisBottom(axisScale)
              .ticks(width / 80)
              .tickSize(-10)
          );

      svg
        .append("g")
        .attr("transform", `translate(10,${height - 40})`)
        .append("rect")
        // .attr("transform", `translate(${margin.left}, 0)`)
        .attr("width", width - 20)
        .attr("height", 20)
        .style("fill", "url(#linear-gradient)");

      svg.append("g").call(axisBottom);
    };

    const handleMouseOver = (event: any) => {
      if (event.target.tagName === "path") {
        d3.select(`#${event.target.id}`)
          .attr("fill", "cornflowerblue")
          .attr("opacity", "1");
        // d3.selectAll("path").attr("opacity", "0.5");
        // d3.select(`#${event.target.id}`).attr("opacity", "1");

        const filteredPaths = d3.selectAll("path").filter(function (d: any) {
          return (
            // @ts-ignore
            this!.id != countryContext.selectedCountry &&
            // @ts-ignore
            this!.id != event.target.id
          );
        });
        filteredPaths.attr("opacity", "0.5");

        countryDispatch({
          type: IDispatchType.hoverCountry,
          data: event.target.id,
        });
        // if (countryTooltipRef.current) {
        //   countryTooltipRef.current.innerHTML = event.target.id;
        //   countryTooltipRef.current.classList.add("country-tooltip");
        // }
      }
    };

    const handleMouseLeave = (event: any) => {
      if (event.target.tagName === "path") {
        if (countryContext.selectedFilter) {
          d3.select(`#${countryContext.hoveredCountry}`)
            .attr("fill", "grey")
            .attr("opacity", "1");
        }
        console.log(countryContext.selectedCountry);

        const filteredPaths = d3.selectAll("path").filter(function (d: any) {
          return (
            // @ts-ignore
            this!.id != countryContext.selectedCountry
          );
        });
        filteredPaths
          .attr("fill", "grey")
          .attr("opacity", countryContext.selectedCountry ? "0.5" : "1");

        countryDispatch({
          type: IDispatchType.hoverCountry,
          data: "",
        });

        // if (countryTooltipRef.current) {
        //   countryTooltipRef.current.innerHTML = "";
        //   countryTooltipRef.current.classList.remove("country-tooltip");
        // }
      }
    };

    const handleClicked = (event: any) => {
      if (event.target.tagName === "path") {
        // console.log("selecting country");
        countryDispatch({
          type: IDispatchType.selectCountry,
          data: event.target.id,
        });
      }
    };

    d3Dispatch.on("filterByUniversity", filterByUniversity);
    path.on("mouseover", handleMouseOver);
    path.on("mouseleave", handleMouseLeave);
    path.on("click", handleClicked);

    console.log("map rendered");

    return () => {
      d3Dispatch.on("countrySelected", null);
      d3Dispatch.on("resetZoom", null);
      d3Dispatch.on("filterByUniversity", null);
      path.on("mouseover", null);
      path.on("mouseleave", null);
      path.on("click", null);
    };
  }, [width, height, mapSvgRef.current, countryContext.selectedCountry]);
}
