// src/components/TournamentTable/drawDefs.ts
import * as d3 from "d3";

/**
 * Define efectos SVG como filtros, marcadores, etc.
 */
export function drawDefs(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
) {
  const defs = svg.append("defs");
  
  // Filtro sutil para el efecto de sombra del campeón
  const filter = defs.append("filter")
    .attr("id", "champion-glow")
    .attr("x", "-50%")
    .attr("y", "-50%")
    .attr("width", "200%")
    .attr("height", "200%");
  
  filter.append("feGaussianBlur")
    .attr("stdDeviation", "2")
    .attr("result", "blur");
  
  filter.append("feComposite")
    .attr("in", "SourceGraphic")
    .attr("in2", "blur")
    .attr("operator", "over");
    
  // Gradiente para la corona
  const crownGradient = defs.append("linearGradient")
    .attr("id", "crown-gradient")
    .attr("x1", "0%").attr("y1", "0%")
    .attr("x2", "100%").attr("y2", "100%");
  
  crownGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#ffd700");
  
  crownGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#ff9d00");
}