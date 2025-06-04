// src/components/TournamentTable/layout.ts
import { type Round } from "./types";

export interface Pos { x: number; y: number; }
export interface LayoutResult {
  pos: Map<string, Pos>;
  height: number;
  columnW: number;
}

/**
 * Calcula la posición {x,y} de cada partido (por su id) y la altura total del SVG.
 * @param rounds - array de rondas con sus partidos
 * @param width - ancho total deseado del SVG
 * @param matchGap - distancia vertical entre partidos (gap)
 */
export function calculateLayout(
  rounds: Round[],
  width: number,
  matchGap: number
): LayoutResult {
  const nRounds = rounds.length;
  const columnW = width / nRounds;
  const pos: Map<string, Pos> = new Map();

  // Altura base, para centrar la primera columna
  const baseH = (rounds[0].matches.length + 1) * matchGap;

  rounds.forEach((round, r) => {
    const x = columnW * r + columnW / 2;

    if (r === 0) {
      // Primera ronda: repartir homogéneamente
      const totalH = (round.matches.length - 1) * matchGap;
      const startY = (baseH - totalH) / 2 + 100;
      round.matches.forEach((m, i) => {
        pos.set(m.id, { x, y: startY + i * matchGap });
      });
    } else {
      // Rondas siguientes: posición = promedio de los dos "hijos"
      round.matches.forEach(m => {
        const parts = m.id.split("|");
        const mid = Math.floor(parts.length / 2);
        const leftId = parts.slice(0, mid).join("|");
        const rightId = parts.slice(mid).join("|");
        const left = pos.get(leftId)!;
        const right = pos.get(rightId)!;
        pos.set(m.id, { x, y: (left.y + right.y) / 2 });
      });
    }
  });

  // Calcular altura total: diferencia entre y máximo y mínimo + matchGap
  const ys = Array.from(pos.values()).map(p => p.y);
  const maxY = Math.max(...ys);
  const minY = Math.min(...ys);
  const height = maxY + matchGap - minY;

  return { pos, height, columnW };
}
