// src/components/TournamentTable/drawConnections.ts
import * as d3 from "d3";
import { type Round } from "./types";
import { type Pos } from "./layout";

const dash = "5 8";
const speed = 25000;

/** Recibe un path y le aplica la animación infinita de stroke-dash */
function animateDash(
  path: d3.Selection<SVGPathElement, unknown, any, unknown>
) {
  const len = (path.node() as SVGPathElement).getTotalLength();

  path
    .attr("stroke-dasharray", dash)
    .attr("stroke-dashoffset", len)
    .transition()
      .duration(speed)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0)
      .on("end", () => animateDash(path));
}

/**
 * Dibuja líneas punteadas entre cada partido de ronda r-1 y el partido padre en r.
 * @param svg - selección del SVG
 * @param rounds - array de rondas
 * @param pos - mapa con posiciones de cada partido
 * @param columnW - ancho de cada columna
 */
export function drawConnections(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  rounds: Round[],
  pos: Map<string, Pos>,
  columnW: number
) {
  rounds.forEach((round, r) => {
    if (r === 0) return; // no hay conexiones para la primera ronda

    round.matches.forEach((m) => {
      const parts = m.id.split("|");
      const mid = Math.floor(parts.length / 2);
      const leftId = parts.slice(0, mid).join("|");
      const rightId = parts.slice(mid).join("|");
      const pL = pos.get(leftId)!;
      const pR = pos.get(rightId)!;
      const to = pos.get(m.id)!;

      // Para cada “hijo” (left y right), dibujar la curva recta:
      const makeD = (from: Pos) =>
        `M${from.x} ${from.y} H${to.x - columnW / 2} V${to.y} H${to.x}`;

      [pL, pR].forEach((from, idx) => {
        const path = svg.append("path")
          .attr("d", makeD(from))
          .attr("fill", "none")
          .attr("stroke", "#333333")
          .attr("stroke-width", 2)
          .attr("stroke-linecap", "round")
          .attr("opacity", 0);

        // Aparecer con transición y luego animar dash
        path.transition()
          .duration(600)
          .delay(r * 300 + idx * 100)
          .attr("opacity", 1)
          .on("end", () => animateDash(path));
      });
    });
  });
}
