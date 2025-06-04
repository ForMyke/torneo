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
 * Optimizado para mayor espaciado vertical y evitar superposiciones.
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

  // Factor de espaciado vertical para 32 participantes
  const initialMatchCount = rounds[0].matches.length;
  const verticalPadding = 120;  // Aumentamos el espacio superior e inferior
  
  // Calcular el espacio total necesario (primera ronda determina la altura)
  const firstRoundHeight = initialMatchCount * matchGap;
  
  rounds.forEach((round, r) => {
    const x = columnW * r + columnW / 2;
    const matchCount = round.matches.length;
    
    if (r === 0) {
      // Primera ronda: distribuir homogéneamente con mayor espaciado
      const startY = verticalPadding;
      const gapBetweenMatches = matchGap; // Mantener el espaciado pasado como parámetro
      
      round.matches.forEach((m, i) => {
        pos.set(m.id, { x, y: startY + i * gapBetweenMatches });
      });
    } else {
      // Rondas siguientes: posición = promedio de los "partidos padre"
      // pero asegurando un espacio mínimo entre partidos
      round.matches.forEach((m, i) => {
        const parts = m.id.split("|");
        const mid = Math.floor(parts.length / 2);
        const leftId = parts.slice(0, mid).join("|");
        const rightId = parts.slice(mid).join("|");
        const left = pos.get(leftId)!;
        const right = pos.get(rightId)!;
        
        // Calcular la posición basada en el promedio
        let yPos = (left.y + right.y) / 2;
        
        // Verificar si hay suficiente espacio con el partido anterior
        if (i > 0) {
          const prevMatch = round.matches[i-1];
          const prevPos = pos.get(prevMatch.id)!;
          const minGap = matchGap * 0.8; // 80% del espaciado requerido
          
          // Si la distancia es menor que el mínimo, ajustar
          if (yPos - prevPos.y < minGap) {
            yPos = prevPos.y + minGap;
          }
        }
        
        pos.set(m.id, { x, y: yPos });
      });
    }
  });

  // Calcular altura total: diferencia entre y máximo y mínimo + margen
  const ys = Array.from(pos.values()).map(p => p.y);
  const maxY = Math.max(...ys);
  const minY = Math.min(...ys);
  const height = maxY + verticalPadding - minY;

  return { pos, height, columnW };
}