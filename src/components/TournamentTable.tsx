// TournamentTable.tsx
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export interface Team {
  name: string;
  score: number;
  /** URL opcional al escudo/crest del equipo */
  logo?: string;
}

export interface Match {
  id: string;
  team1: Team;
  team2: Team;
  winner: 1 | 2;
}

export interface Round {
  name: string;
  matches: Match[];
}

export interface BracketProps {
  rounds: Round[];
  /** Ancho total en pixels del SVG (por defecto: 1000) */
  width?: number;
  /** Espacio vertical entre partidos de la primera ronda (por defecto: 70) */
  matchGap?: number;
}

const TournamentTable: React.FC<BracketProps> = ({
  rounds,
  width = 1000,
  matchGap = 70,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // 1. Preparar posiciones (x,y) de cada partido ----------------------------
    const nRounds = rounds.length;
    const columnW = width / nRounds;

    /** 
     * Guarda en un Map la posición { x, y } de cada partido por su id. 
     * La ronda 0 (primera) aparece con y = (mIdx+1)*matchGap, 
     * luego las demás se centran entre los dos “padres”.
     */
    const matchPos: Map<string, { x: number; y: number }> = new Map();
    rounds.forEach((round, rIdx) => {
      const x = columnW * rIdx + columnW / 2;

      if (rIdx === 0) {
        // Primera ronda: repartir verticalmente
        round.matches.forEach((match, mIdx) => {
          matchPos.set(match.id, { x, y: (mIdx + 1) * matchGap });
        });
      } else {
        // Rondas sucesivas: centrado entre los “padres”
        round.matches.forEach((match) => {
          // Separar el id con “|”, exactamente en el mismo orden de los ids de la ronda anterior
          const partes = match.id.split("|");
          // Si concatenaste más de dos ids (por ej. “a|b|c|d”), 
          // asumes que “padre izquierdo” es la combinación de los dos primeros (a|b)
          // y “padre derecho” la combinación de los dos últimos (c|d).
          // Para no complicar la lógica, en este ejemplo
          // vamos a tomar las dos mitades: 
          const mitad = Math.floor(partes.length / 2);
          const leftId = partes.slice(0, mitad).join("|");
          const rightId = partes.slice(mitad).join("|");

          const posLeft = matchPos.get(leftId);
          const posRight = matchPos.get(rightId);
          const y1 = posLeft ? posLeft.y : 0;
          const y2 = posRight ? posRight.y : 0;
          // Centro entre y1 y y2
          matchPos.set(match.id, { x, y: (y1 + y2) / 2 });
        });
      }
    });

    // Altura total: tomó el valor más grande de “y” + margin inferior
    const height =
      d3.max(Array.from(matchPos.values(), (p) => p.y))! + matchGap;

    // 2. Dibujar el SVG --------------------------------------------------------
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", height);

    // Limpiar cualquier elemento anterior
    svg.selectAll("*").remove();

    // 3. Dibujar las líneas de conexión ---------------------------------------
    rounds.forEach((round, rIdx) => {
      if (rIdx === 0) return; // No hay líneas en la primera ronda
      round.matches.forEach((match) => {
        // Repetimos la misma lógica de “split” que en posiciones
        const partes = match.id.split("|");
        const mitad = Math.floor(partes.length / 2);
        const leftId = partes.slice(0, mitad).join("|");
        const rightId = partes.slice(mitad).join("|");

        const from1 = matchPos.get(leftId)!;
        const from2 = matchPos.get(rightId)!;
        const to = matchPos.get(match.id)!;

        // Línea desde equipo izquierdo
        svg
          .append("path")
          .attr(
            "d",
            `M${from1.x} ${from1.y} H${to.x - columnW / 2} V${to.y} H${to.x}`
          )
          .attr("fill", "none")
          .attr("stroke", "#0070f3")
          .attr("stroke-width", 2);

        // Línea desde equipo derecho
        svg
          .append("path")
          .attr(
            "d",
            `M${from2.x} ${from2.y} H${to.x - columnW / 2} V${to.y} H${to.x}`
          )
          .attr("fill", "none")
          .attr("stroke", "#0070f3")
          .attr("stroke-width", 2);
      });
    });

    // 4. Dibujar cada “caja” de partido ---------------------------------------
    const matchG = svg
      .selectAll("g.match")
      .data(rounds.flatMap((r) => r.matches))
      .join("g")
      .attr("class", "match")
      .attr("transform", (d: Match) => {
        const { x, y } = matchPos.get(d.id)!;
        return `translate(${x},${y})`;
      });

    const boxW = columnW * 0.8; // ancho de la caja
    const boxH = 50;           // alto total (incluye espacio para dos equipos)
    const textPad = 8;         // padding interior

    // Fondo blanco + borde de la caja
    matchG
      .append("rect")
      .attr("x", -boxW / 2)
      .attr("y", -boxH / 2)
      .attr("width", boxW)
      .attr("height", boxH)
      .attr("rx", 6)
      .attr("fill", "#ffffff")
      .attr("stroke", "#d1d5db");

    // Rectángulo semitransparente sobre el equipo ganador (para resaltar)
    matchG
      .append("rect")
      .attr("x", (d: Match) => (d.winner === 1 ? -boxW / 2 : 0))
      .attr("y", (d: Match) => (d.winner === 1 ? -boxH / 2 : 0))
      .attr("width", boxW)
      .attr("height", boxH / 2)
      .attr("fill", "#0070f3")
      .attr("opacity", 0.1);

    // 4.a) Logos de los equipos (opcional)
    // Si quieres que aparezca el escudo al lado del texto, descomenta esto:
    matchG
      .append("image")
      .attr("xlink:href", (d: Match) => d.team1.logo || "")
      .attr("x", -boxW / 2 + textPad)
      .attr("y", -boxH / 2 + 4)
      .attr("width", 20)
      .attr("height", 20)
      .attr("visibility", (d: Match) => (d.team1.logo ? "visible" : "hidden"));

    matchG
      .append("image")
      .attr("xlink:href", (d: Match) => d.team2.logo || "")
      .attr("x", -boxW / 2 + textPad)
      .attr("y", 0 + 4)
      .attr("width", 20)
      .attr("height", 20)
      .attr("visibility", (d: Match) => (d.team2.logo ? "visible" : "hidden"));

    // 4.b) Nombres y goles de team1
    matchG
      .append("text")
      .attr("x", -boxW / 2 + textPad + 24) // +24 para dejar espacio al logo
      .attr("y", -6)
      .attr("font-size", 12)
      .attr("dominant-baseline", "middle")
      .text((d: Match) => d.team1.name);

    matchG
      .append("text")
      .attr("x", boxW / 2 - textPad)
      .attr("y", -6)
      .attr("text-anchor", "end")
      .attr("font-size", 12)
      .attr("dominant-baseline", "middle")
      .text((d: Match) => d.team1.score.toString());

    // 4.c) Nombres y goles de team2
    matchG
      .append("text")
      .attr("x", -boxW / 2 + textPad + 24)
      .attr("y", 12)
      .attr("font-size", 12)
      .attr("dominant-baseline", "middle")
      .text((d: Match) => d.team2.name);

    matchG
      .append("text")
      .attr("x", boxW / 2 - textPad)
      .attr("y", 12)
      .attr("text-anchor", "end")
      .attr("font-size", 12)
      .attr("dominant-baseline", "middle")
      .text((d: Match) => d.team2.score.toString());

    // 5. Dibujar títulos de cada columna (ronda) ------------------------------
    svg
      .selectAll("text.round-title")
      .data(rounds)
      .join("text")
      .attr("class", "round-title")
      .attr("x", (_: Round, i: number) => columnW * i + columnW / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold")
      .attr("font-size", 14)
      .text((d: Round) => d.name);
  }, [rounds, width, matchGap]);

  return <svg ref={svgRef} style={{ maxWidth: "100%", display: "block" }} />;
};

export default TournamentTable;
