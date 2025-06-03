// src/components/TournamentTable/drawMatches.ts
import * as d3 from "d3";
import { type Round, type Match } from "./types";
import { type Pos } from "./layout";

export interface MatchRenderOptions {
  boxW: number;
  boxH: number;
  pad: number;
}

/**
 * Renderiza todos los partidos (cada “g.match”) con su caja, logos y textos.
 * @param svg - selección del SVG
 * @param rounds - array de rondas
 * @param pos - mapa de posiciones
 * @param options - opciones de tamaño (boxW, boxH, pad)
 */
export function drawMatches(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  rounds: Round[],
  pos: Map<string, Pos>,
  options: MatchRenderOptions
) {
  const { boxW, boxH, pad } = options;

  // Aplanar todas las rondas en un solo array de matches
  const allMatches = rounds.flatMap(r => r.matches);

  // Seleccionar o crear un <g class="match"> por cada partido
  const g = svg.selectAll<SVGGElement, Match>("g.match")
    .data(allMatches, (d: any) => d.id)
    .join("g")
      .attr("class", "match")
      .attr("transform", d => {
        const p = pos.get(d.id)!;
        return `translate(${p.x},${p.y}) scale(0.9)`;
      })
      .attr("opacity", 0);

  // Transición de “aparecer” con escala 1
  g.transition()
    .duration(600)
    .delay((_, i) => 300 + i * 100)
    .attr("opacity", 1)
    .attr("transform", d => {
      const p = pos.get(d.id)!;
      return `translate(${p.x},${p.y}) scale(1)`;
    });

  // 1) resaltado del ganador (semi-rectángulo)
  g.append("rect")
    .attr("x", d => d.winner === 1 ? -boxW / 2 : 0)
    .attr("y", d => d.winner === 1 ? -boxH / 2 : 0)
    .attr("width",  boxW / 2)
    .attr("height", boxH / 2)
    .attr("fill", "#333333")
    .attr("opacity", 0.1)
    .attr("rx", 6);

  // 2) caja principal de fondo
  g.append("rect")
    .attr("x", -boxW / 2)
    .attr("y", -boxH / 2)
    .attr("width", boxW)
    .attr("height", boxH)
    .attr("rx", 6)
    .attr("fill", "#ffffff")
    .attr("stroke", "#333333")
    .attr("stroke-width", 1.5)
    .attr("filter", "url(#glow)");

  // 3) logos (equipo 1 y 2)
  g.append("image")
    .attr("xlink:href", d => d.team1.logo || "")
    .attr("x", -boxW / 2 + pad)
    .attr("y", -boxH / 2 + 8)
    .attr("width", 32)
    .attr("height", 32)
    .attr("visibility", d => d.team1.logo ? "visible" : "hidden");

  g.append("image")
    .attr("xlink:href", d => d.team2.logo || "")
    .attr("x", -boxW / 2 + pad)
    .attr("y", -2)
    .attr("width", 32)
    .attr("height", 32)
    .attr("visibility", d => d.team2.logo ? "visible" : "hidden");

  // 4) texto nombre y puntaje equipo 1
  g.append("text")
    .attr("x", -boxW / 2 + pad + 40)
    .attr("y", -boxH / 4)
    .attr("font-size", 14)
    .attr("fill", "#333333")
    .attr("font-family", "Raleway, sans-serif")
    .text(d => d.team1.name);

  g.append("text")
    .attr("x", boxW / 2 - pad)
    .attr("y", -boxH / 4)
    .attr("text-anchor", "end")
    .attr("font-size", 14)
    .attr("font-weight", "bold")
    .attr("fill", "#000000")
    .attr("font-family", "Raleway, sans-serif")
    .text(d => d.team1.score.toString());

  // 5) texto nombre y puntaje equipo 2
  g.append("text")
    .attr("x", -boxW / 2 + pad + 40)
    .attr("y", boxH / 4 + 4)
    .attr("font-size", 14)
    .attr("fill", "#333333")
    .attr("font-family", "Raleway, sans-serif")
    .text(d => d.team2.name);

  g.append("text")
    .attr("x", boxW / 2 - pad)
    .attr("y", boxH / 4 + 4)
    .attr("text-anchor", "end")
    .attr("font-size", 14)
    .attr("font-weight", "bold")
    .attr("fill", "#000000")
    .attr("font-family", "Raleway, sans-serif")
    .text(d => d.team2.score.toString());

  // 6) hover => cambiar grosor y color del borde
  g.on("mouseover", function () {
      d3.select(this).select("rect:nth-of-type(2)")
        .transition().duration(200)
        .attr("stroke-width", 2.5)
        .attr("stroke", "#2563eb");
    })
   .on("mouseout", function () {
      d3.select(this).select("rect:nth-of-type(2)")
        .transition().duration(200)
        .attr("stroke-width", 1.5)
        .attr("stroke", "#333333");
    });
}
