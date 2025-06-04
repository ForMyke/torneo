// src/components/TournamentTable/drawConnections.ts
import * as d3 from "d3";
import { type Round } from "./types";
import { type Pos } from "./layout";

/**
 * Dibuja conexiones con animación de entrada
 */
export function drawConnections(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  rounds: Round[],
  pos: Map<string, Pos>,
  columnW: number
) {
  // Crear grupo para las conexiones
  const connectionsGroup = svg.append("g").attr("class", "connections");

  rounds.forEach((round, r) => {
    if (r === 0) return;

    round.matches.forEach((m, matchIndex) => {
      const parts = m.id.split("|");
      const mid = Math.floor(parts.length / 2);
      const leftId = parts.slice(0, mid).join("|");
      const rightId = parts.slice(mid).join("|");
      const pL = pos.get(leftId)!;
      const pR = pos.get(rightId)!;
      const to = pos.get(m.id)!;

      // Crear path con líneas rectas 
      const createPath = (from: Pos) => {
        const midX = from.x + (to.x - from.x) / 2;
        return `M${from.x} ${from.y} L${midX} ${from.y} L${midX} ${to.y} L${to.x} ${to.y}`;
      };

      // Dibujar conexiones con animación
      [pL, pR].forEach((from, idx) => {
        // Crear la línea
        const line = connectionsGroup.append("path")
          .attr("d", createPath(from))
          .attr("fill", "none")
          .attr("stroke", "#999999")
          .attr("stroke-width", 1)
          .attr("stroke-linecap", "round");
          
        try {
          // Calcular la longitud del path para la animación
          const pathLength = line.node()?.getTotalLength() || 100;
          
          // Configurar la animación de dibujo de la línea
          line
            .attr("stroke-dasharray", `${pathLength},${pathLength}`)
            .attr("stroke-dashoffset", pathLength)
            .transition()
            .duration(600)
            .delay(250 + r * 300 + matchIndex * 30 + idx * 100)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);
        } catch (e) {
          console.warn("Error al animar path:", e);
          // Si hay error, mostrar la línea sin animación
          line.attr("opacity", 0)
            .transition()
            .duration(300)
            .delay(250 + r * 300 + matchIndex * 30)
            .attr("opacity", 1);
        }
      });
    });
  });
}