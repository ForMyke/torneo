// src/components/TournamentTable/drawTitles.ts
import * as d3 from "d3";
import { type Round } from "./types";

/**
 * Dibuja títulos de cada ronda con efectos visuales mejorados
 */
export function drawTitles(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  rounds: Round[],
  columnW: number,
  width: number
) {
  const titlesGroup = svg.append("g").attr("class", "round-titles");
  
  rounds.forEach((round, i) => {
    const x = columnW * i + columnW / 2;
    const title = titlesGroup.append("g")
      .attr("transform", `translate(${x}, 0)`)
      .attr("opacity", 0);
      
    // Fondo del título
    title.append("rect")
      .attr("x", -columnW * 0.4)
      .attr("y", -40)
      .attr("width", columnW * 0.8)
      .attr("height", 30)
      .attr("rx", 6)
      .attr("fill", "#e0e7ff")
      .attr("stroke", "#6366f1")
      .attr("stroke-width", 1.5)
      .attr("filter", "url(#glow)");
    
    // Texto del título
    title.append("text")
      .attr("text-anchor", "middle")
      .attr("y", -20)
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "#4f46e5")
      .attr("font-family", "Arial, sans-serif")
      .text(round.name);
      
    // Añadir animación suave
    title.transition()
      .duration(500)
      .delay(i * 100)
      .attr("opacity", 1)
      .attr("transform", `translate(${x}, 0) scale(1)`);
      
    // Efecto hover
    title
      .on("mouseover", function() {
        d3.select(this).transition()
          .duration(150)
          .attr("transform", `translate(${x}, 0) scale(1.05)`);
      })
      .on("mouseout", function() {
        d3.select(this).transition()
          .duration(150)
          .attr("transform", `translate(${x}, 0) scale(1)`);
      });
  });
}