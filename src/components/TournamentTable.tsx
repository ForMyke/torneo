// components/TournamentTable.tsx
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

/* --------------------------------------------------------------------------
 * 1. Tipos
 * --------------------------------------------------------------------------*/
export interface Team   { name: string; score: number; logo?: string; }
export interface Match  { id: string; team1: Team; team2: Team; winner: 1 | 2; }
export interface Round  { name: string; matches: Match[]; }
export interface Props  { rounds: Round[]; width?: number; matchGap?: number; }

const TournamentTable: React.FC<Props> = ({
  rounds,
  width     = 1000,
  matchGap  = 70,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    /* ──────────────────────────────────────────────────────────────────────
     * 2. Posiciones de cada partido
     * ──────────────────────────────────────────────────────────────────────*/
    const nRounds = rounds.length;
    const columnW = width / nRounds;

    /** Map<matchId, {x,y}> */
    const pos: Map<string, { x: number; y: number }> = new Map();
    const baseH = (rounds[0].matches.length + 1) * matchGap;

    rounds.forEach((round, r) => {
      const x = columnW * r + columnW / 2;

      if (r === 0) {
        /* Primera ronda */
        const totalH = (round.matches.length - 1) * matchGap;
        const startY = (baseH - totalH) / 2;
        round.matches.forEach((m, i) => pos.set(m.id, { x, y: startY + i * matchGap }));
      } else {
        /* Rondas siguientes */
        round.matches.forEach(m => {
          const parts  = m.id.split("|");
          const mid    = Math.floor(parts.length / 2);
          const left   = pos.get(parts.slice(0, mid ).join("|"))!;
          const right  = pos.get(parts.slice(mid   ).join("|"))!;
          pos.set(m.id, { x, y: (left.y + right.y) / 2 });
        });
      }
    });

    const height = Math.max(...[...pos.values()].map(p => p.y)) +
                   matchGap - Math.min(...[...pos.values()].map(p => p.y));

    /* ──────────────────────────────────────────────────────────────────────
     * 3. Crear / limpiar SVG
     * ──────────────────────────────────────────────────────────────────────*/
    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width",  "100%")
      .attr("height", height);

    svg.selectAll("*").remove();

    /* ──────────────────────────────────────────────────────────────────────
     * 4. Filtro de resplandor para cajas
     * ──────────────────────────────────────────────────────────────────────*/
    const defs  = svg.append("defs");
    const glow  = defs.append("filter").attr("id", "glow");
    glow.append("feGaussianBlur").attr("stdDeviation", 1.5).attr("result", "b");
    glow.append("feMerge").selectAll("feMergeNode")
      .data(["b", "SourceGraphic"]).enter()
      .append("feMergeNode").attr("in", d => d);

    /* ──────────────────────────────────────────────────────────────────────
     * 5. Conexiones (stroke-dasharray + animación)
     * ──────────────────────────────────────────────────────────────────────*/
    const dash  = "5 8";
    const speed = 25000;

    const animateDash = (
      path: d3.Selection<SVGPathElement, unknown, any, unknown>
    ) => {
      const len = (path.node() as SVGPathElement).getTotalLength();

      path
        .attr("stroke-dasharray", dash)
        .attr("stroke-dashoffset", len)
        .transition()
          .duration(speed)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0)
          .on("end", () => animateDash(path));
    };

    rounds.forEach((round, r) => {
      if (r === 0) return;
      round.matches.forEach(m => {
        const p   = m.id.split("|");
        const mid = Math.floor(p.length / 2);
        const pL  = pos.get(p.slice(0, mid ).join("|"))!;
        const pR  = pos.get(p.slice(mid   ).join("|"))!;
        const to  = pos.get(m.id)!;

        const make = (from: {x:number,y:number}) =>
          `M${from.x} ${from.y} H${to.x - columnW/2} V${to.y} H${to.x}`;

        [pL, pR].forEach((from, idx) => {
          const path = svg.append("path")
            .attr("d", make(from))
            .attr("fill", "none")
            .attr("stroke", "#333333")
            .attr("stroke-width", 2)
            .attr("stroke-linecap", "round")
            .attr("opacity", 0);

          path.transition().duration(600).delay(r * 300 + idx * 100)
              .attr("opacity", 1)
              .on("end", () => animateDash(path));
        });
      });
    });

    /* ──────────────────────────────────────────────────────────────────────
     * 6. Dibujar partidos
     * ──────────────────────────────────────────────────────────────────────*/
    const boxW   = columnW * 0.85;
    const boxH   = 60;
    const pad    = 12;

    const g = svg.selectAll("g.match")
      .data(rounds.flatMap(r => r.matches))
      .join("g")
      .attr("class", "match")
      .attr("transform", d => {
        const {x,y} = pos.get(d.id)!;
        return `translate(${x},${y}) scale(0.9)`;
      })
      .attr("opacity", 0);

    g.transition()
      .duration(600)
      .delay((_, i) => 300 + i * 100)
      .attr("opacity", 1)
      .attr("transform", d => {
        const {x,y} = pos.get(d.id)!;
        return `translate(${x},${y}) scale(1)`;
      });

    /* 6-a: resaltado del ganador */
    g.append("rect")
      .attr("x", d => d.winner === 1 ? -boxW/2 : 0)
      .attr("y", d => d.winner === 1 ? -boxH/2 : 0)
      .attr("width",  boxW/2)
      .attr("height", boxH/2)
      .attr("fill", "#333333")
      .attr("opacity", 0.1)
      .attr("rx", 6);

    /* 6-b: caja principal */
    g.append("rect")
      .attr("x", -boxW/2).attr("y", -boxH/2)
      .attr("width", boxW).attr("height", boxH)
      .attr("rx", 6)
      .attr("fill", "#ffffff")
      .attr("stroke", "#333333")
      .attr("stroke-width", 1.5)
      .attr("filter", "url(#glow)");

    /* 6-c: logos */
    g.append("image")
      .attr("xlink:href", d => d.team1.logo || "")
      .attr("x", -boxW/2 + pad)
      .attr("y", -boxH/2 + 8)
      .attr("width", 32)
      .attr("height", 32)
      .attr("visibility", d => d.team1.logo ? "visible" : "hidden");

    g.append("image")
      .attr("xlink:href", d => d.team2.logo || "")
      .attr("x", -boxW/2 + pad)
      .attr("y", -2)
      .attr("width", 32)
      .attr("height", 32)
      .attr("visibility", d => d.team2.logo ? "visible" : "hidden");

    /* 6-d: textos equipo 1 */
    g.append("text")
      .attr("x", -boxW/2 + pad + 40)
      .attr("y", -boxH/4)
      .attr("font-size", 14)
      .attr("fill", "#333333")
      .attr("font-family", "Raleway, sans-serif")
      .text(d => d.team1.name);

    g.append("text")
      .attr("x", boxW/2 - pad)
      .attr("y", -boxH/4)
      .attr("text-anchor", "end")
      .attr("font-size", 14)
      .attr("font-weight", "bold")
      .attr("fill", "#000000")
      .attr("font-family", "Raleway, sans-serif")
      .text(d => d.team1.score.toString());

    /* 6-e: textos equipo 2 */
    g.append("text")
      .attr("x", -boxW/2 + pad + 40)
      .attr("y", boxH/4 + 4)
      .attr("font-size", 14)
      .attr("fill", "#333333")
      .attr("font-family", "Raleway, sans-serif")
      .text(d => d.team2.name);

    g.append("text")
      .attr("x", boxW/2 - pad)
      .attr("y", boxH/4 + 4)
      .attr("text-anchor", "end")
      .attr("font-size", 14)
      .attr("font-weight", "bold")
      .attr("fill", "#000000")
      .attr("font-family", "Raleway, sans-serif")
      .text(d => d.team2.score.toString());

    /* 6-f: hover => grosor de borde */
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

    /* ──────────────────────────────────────────────────────────────────────
     * 7. Títulos por ronda
     * ──────────────────────────────────────────────────────────────────────*/
    svg.selectAll("text.round-title")
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
      .transition().duration(800).delay((_, i) => i * 200).attr("opacity", 1);
  }, [rounds, width, matchGap]);

  return (
    <svg
      ref={svgRef}
      style={{ maxWidth: "100%", display: "block", backgroundColor: "#f1f3f7" }}
    />
  );
};

export default TournamentTable;
