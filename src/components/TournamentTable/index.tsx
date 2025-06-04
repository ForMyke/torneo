// src/components/TournamentTable/index.tsx
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

import { type Props } from "./types";
import { calculateLayout } from "./layout";
import { drawDefs } from "./drawDefs";
import { drawConnections } from "./drawConnections";
import { drawMatches, type MatchRenderOptions } from "./drawMatches";

export { type Round } from "./types";

const TournamentTable: React.FC<Props> = ({
  rounds,
  width = 2400,
  matchGap = 65,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    try {
      // 1) Calcular layout: posiciones (pos), altura total y ancho de columna
      const { pos, height, columnW } = calculateLayout(rounds, width, matchGap);

      // 2) Seleccionar el SVG y asignar atributos principales
      const svg = d3.select(svgRef.current)
        .attr("viewBox", `0 -50 ${width} ${height + 100}`)
        .attr("width", "100%")
        .attr("height", height + 100);

      // 3) Limpiar todo lo anterior
      svg.selectAll("*").remove();

      // 4) Dibujar defs (filtros, gradientes, etc.)
      drawDefs(svg);

      // 5) Fondo transparente
      svg.append("rect")
        .attr("x", 0)
        .attr("y", -50)
        .attr("width", width)
        .attr("height", height + 100)
        .attr("fill", "transparent")
        .attr("rx", 8);

      // 6) Dibujar conexiones entre rondas - primero para que queden debajo de los partidos
      drawConnections(svg, rounds, pos, columnW);

      // 7) Dibujar cajas de cada partido
      const matchOptions: MatchRenderOptions = {
        boxW: columnW * 0.65,  // Cajas anchas para mejor visibilidad
        boxH: 50,              // Altura reducida
        pad: 12,               // Padding interno
      };
      drawMatches(svg, rounds, pos, matchOptions);

    } catch (error) {
      console.error("Error al renderizar el torneo:", error);
    }
  }, [rounds, width, matchGap]);

  return (
    <svg
      ref={svgRef}
      style={{
        maxWidth: "100%",
        display: "block",
        backgroundColor: "#ffffff",
        height: "auto",
        minHeight: "85vh",
        borderRadius: "8px",
        overflow: "visible"
      }}
    />
  );
};

export default TournamentTable;