import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";

const MapSection = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

useEffect(() => {
  d3.json("/korea.topojson").then((data: any) => {
    if (!data || !data.objects) {
      console.error("Invalid TopoJSON structure", data);
      return;
    }

    const objectKeys = Object.keys(data.objects);
    if (objectKeys.length === 0) {
      console.error("No objects found in TopoJSON", data.objects);
      return;
    }

    const objectKey = objectKeys[0];
    const geoData = feature(data, data.objects[objectKey]);

    if (!geoData || !geoData.features) {
      console.error("Invalid GeoJSON features", geoData);
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 400;

    svg.attr("width", width).attr("height", height);

    const projection = d3.geoMercator().fitSize([width, height], geoData as any);
    const path = d3.geoPath().projection(projection);

    svg
      .selectAll("path")
      .data(geoData.features)
      .enter()
      .append("path")
      .attr("d", path as any)
      .attr("fill", (d: any) => d.properties.NAME_1 === selectedRegion ? "#60A5FA" : "#E0F2FE")
      .attr("stroke", "#333")
      .attr("stroke-width", 0.5)
      .on("click", function (event: any, d: any) {
        setSelectedRegion(d.properties.NAME_1);
      });
  });
}, [selectedRegion]);

  return <svg ref={svgRef}></svg>;
};

export default MapSection;
