// src/components/TournamentTable/index.tsx
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

import { type Props } from "./types";
import { calculateLayout } from "./layout";
import { drawDefs } from "./drawDefs";
import { drawConnections } from "./drawConnections";
import { drawMatches, type MatchRenderOptions } from "./drawMatches";
import { drawTitles } from "./drawTitles";

export { type Round } from "./types";

const TournamentTable: React.FC<Props> = ({
  rounds,
  width = 1000,
  matchGap = 70,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // 1) Calcular layout: posiciones (pos), altura total y ancho de columna
    const { pos, height, columnW } = calculateLayout(rounds, width, matchGap);

    // 2) Seleccionar el SVG y asignar atributos principales
    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 -50 ${width} ${height + 200}`)
      .attr("width", "100%")
      .attr("height", height + 200);

    // 3) Limpiar todo lo anterior
    svg.selectAll("*").remove();

    // 4) Dibujar defs (filtro "glow")
    drawDefs(svg);

    // 5) Dibujar conexiones entre rondas
    drawConnections(svg, rounds, pos, columnW);

    // 6) Dibujar cajas de cada partido
    const matchOptions: MatchRenderOptions = {
      boxW: columnW * 0.50,
      boxH: 60,
      pad: 12,
    };
    drawMatches(svg, rounds, pos, matchOptions);

    // 7) Dibujar títulos de cada ronda arriba
    drawTitles(svg, rounds, columnW, width);

  }, [rounds, width, matchGap]);

  return (
    <svg
      ref={svgRef}
      style={{
        maxWidth: "100%",
        display: "block",
        backgroundColor: "#f1f3f7",
        height: "auto",
        minHeight: "100%"
      }}
    />
  );
};

export default TournamentTable;
