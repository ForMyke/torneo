// src/components/TournamentTable/drawTitles.ts
import * as d3 from "d3";
import { type Round } from "./types";

export function drawTitles(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  rounds: Round[],
  columnW: number
) {
  svg.selectAll<SVGTextElement, Round>("text.round-title")
    .data(rounds)
    .join("text")
      .attr("class", "round-title")
      .attr("x", (_, i) => columnW * i + columnW / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold")
      .attr("font-size", 14)
      .attr("fill", "#c6aae8")
      .attr("opacity", 0)
      .text(d => d.name)
    .transition()
      .duration(800)
      .delay((_, i) => i * 200)
      .attr("opacity", 1);
}
