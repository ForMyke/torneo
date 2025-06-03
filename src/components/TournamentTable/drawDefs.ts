// src/components/TournamentTable/drawDefs.ts
import * as d3 from "d3";

export function drawDefs(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) {
  const defs = svg.append("defs");
  const glow = defs.append("filter").attr("id", "glow");
  glow.append("feGaussianBlur")
    .attr("stdDeviation", 1.5)
    .attr("result", "b");
  glow.append("feMerge")
    .selectAll("feMergeNode")
    .data(["b", "SourceGraphic"])
    .enter()
    .append("feMergeNode")
    .attr("in", d => d);
}
