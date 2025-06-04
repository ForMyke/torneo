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
 * Renderiza todos los partidos con animaciones de entrada y efectos para el campeón
 */
export function drawMatches(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  rounds: Round[],
  pos: Map<string, Pos>,
  options: MatchRenderOptions
) {
  const { boxW, boxH, pad } = options;

  // Colores para el efecto de parpadeo
  const flashColors = [
    "#ffcccb", // Rojo claro
    "#c6e2ff", // Azul claro
    "#d1ffcc", // Verde claro
    "#ffe0cc", // Naranja claro
    "#e6ccff", // Púrpura claro
    "#fff4cc"  // Amarillo claro
  ];

  // Aplanar todas las rondas en un solo array de matches
  const allMatches = rounds.flatMap((r, roundIndex) => 
    r.matches.map(m => ({ ...m, roundIndex }))
  );

  // Seleccionar o crear un <g class="match"> por cada partido
  const g = svg.selectAll<SVGGElement, Match & { roundIndex: number }>("g.match")
    .data(allMatches, (d: any) => d.id)
    .join("g")
      .attr("class", "match")
      .attr("transform", d => {
        const p = pos.get(d.id)!;
        return `translate(${p.x},${p.y}) scale(0)`;
      })
      .attr("opacity", 0);
      
  // Añadir animación de entrada con efecto de aparición suave
  g.transition()
    .duration(600)
    .delay((d, i) => 150 + i * 30 + d.roundIndex * 300)
    .ease(d3.easeBackOut.overshoot(1.2))
    .attr("opacity", 1)
    .attr("transform", d => {
      const p = pos.get(d.id)!;
      return `translate(${p.x},${p.y}) scale(1)`;
    });

  // 1) Caja principal con efecto de parpadeo de colores
  const boxes = g.append("rect")
    .attr("class", "match-box")
    .attr("x", -boxW / 2)
    .attr("y", -boxH / 2)
    .attr("width", boxW)
    .attr("height", boxH)
    .attr("rx", 4)
    .attr("fill", "#ffffff")
    .attr("stroke", "#d1d5db")
    .attr("stroke-width", 1);
    
  // Añadir efecto de parpadeo de colores
  boxes.each(function(d, i) {
    const box = d3.select(this);
    const flashDelay = 800 + i * 30 + d.roundIndex * 300;
    
    // Secuencia de flashes de colores
    flashColors.forEach((color, colorIndex) => {
      box.transition()
        .delay(flashDelay + colorIndex * 100)
        .duration(50)
        .attr("fill", color)
        .transition()
        .duration(50)
        .attr("fill", "#ffffff");
    });
    
    // Al final de la secuencia, asegurarse de que vuelve al color blanco
    box.transition()
      .delay(flashDelay + flashColors.length * 100 + 100)
      .duration(300)
      .attr("fill", "#ffffff");
  });

  // 2) Línea divisoria entre equipos
  g.append("line")
    .attr("x1", -boxW / 2)
    .attr("y1", 0)
    .attr("x2", boxW / 2)
    .attr("y2", 0)
    .attr("stroke", "#e5e7eb")
    .attr("stroke-width", 1);

  // 3) Nombres de equipos con animación
  g.append("text")
    .attr("class", "team-name")
    .attr("x", -boxW / 2 + pad)
    .attr("y", -boxH / 4 + 5)
    .attr("font-size", 12)
    .attr("fill", "#333333")
    .attr("font-family", "Arial, sans-serif")
    .text(d => d.team1.name)
    .attr("opacity", 0)
    .transition()
    .duration(300)
    .delay((d, i) => 700 + i * 30 + d.roundIndex * 300)
    .attr("opacity", 1);

  g.append("text")
    .attr("class", "team-score")
    .attr("x", boxW / 2 - pad)
    .attr("y", -boxH / 4 + 5)
    .attr("text-anchor", "end")
    .attr("font-size", 12)
    .attr("font-weight", "bold")
    .attr("fill", "#000000")
    .attr("font-family", "Arial, sans-serif")
    .text(d => d.team1.score.toString())
    .attr("opacity", 0)
    .transition()
    .duration(300)
    .delay((d, i) => 800 + i * 30 + d.roundIndex * 300)
    .attr("opacity", 1);

  g.append("text")
    .attr("class", "team-name")
    .attr("x", -boxW / 2 + pad)
    .attr("y", boxH / 4 + 5)
    .attr("font-size", 12)
    .attr("fill", "#333333")
    .attr("font-family", "Arial, sans-serif")
    .text(d => d.team2.name)
    .attr("opacity", 0)
    .transition()
    .duration(300)
    .delay((d, i) => 750 + i * 30 + d.roundIndex * 300)
    .attr("opacity", 1);

  g.append("text")
    .attr("class", "team-score")
    .attr("x", boxW / 2 - pad)
    .attr("y", boxH / 4 + 5)
    .attr("text-anchor", "end")
    .attr("font-size", 12)
    .attr("font-weight", "bold")
    .attr("fill", "#000000")
    .attr("font-family", "Arial, sans-serif")
    .text(d => d.team2.score.toString())
    .attr("opacity", 0)
    .transition()
    .duration(300)
    .delay((d, i) => 850 + i * 30 + d.roundIndex * 300)
    .attr("opacity", 1);

  // 4) Indicador discreto para ganadores con animación
  g.filter(d => d.winner === 1)
    .append("rect")
    .attr("x", -boxW / 2)
    .attr("y", -boxH / 2)
    .attr("width", 4)
    .attr("height", boxH / 2)
    .attr("fill", "#999999")
    .attr("opacity", 0)
    .transition()
    .duration(300)
    .delay((d, i) => 1000 + i * 30 + d.roundIndex * 300)
    .attr("opacity", 1);

  g.filter(d => d.winner === 2)
    .append("rect")
    .attr("x", -boxW / 2)
    .attr("y", 0)
    .attr("width", 4)
    .attr("height", boxH / 2)
    .attr("fill", "#999999")
    .attr("opacity", 0)
    .transition()
    .duration(300)
    .delay((d, i) => 1000 + i * 30 + d.roundIndex * 300)
    .attr("opacity", 1);

  // 5) Hover effects simplificados
  g.on("mouseover", function() {
      d3.select(this).select(".match-box")
        .transition().duration(150)
        .attr("stroke-width", 1.5)
        .attr("stroke", "#666666");
    })
    .on("mouseout", function() {
      d3.select(this).select(".match-box")
        .transition().duration(150)
        .attr("stroke-width", 1)
        .attr("stroke", "#d1d5db");
    });
    
  // 6) Efecto especial de corona para el campeón (solo para el partido final)
  const champion = g.filter((d) => d.roundIndex === rounds.length - 1);
  
  // Dibujar corona animada sobre el ganador
  champion.each(function(d) {
    if (!d.winner) return; // Salir si no hay ganador definido
    
    const group = d3.select(this);
    const winnerY = d.winner === 1 ? -boxH / 4 + 5 : boxH / 4 + 5;
    
    // Agregar emoji de corona
    try {
      group.append("text")
        .attr("class", "crown")
        .attr("x", boxW / 2 + 10)
        .attr("y", winnerY)
        .attr("font-size", 18)
        .attr("text-anchor", "start")
        .attr("fill", "#ffd700")
        .text("👑")
        .attr("opacity", 0)
        .attr("transform", "scale(0) rotate(-30)")
        .transition()
        .duration(800)
        .delay(2000)
        .ease(d3.easeElastic)
        .attr("opacity", 1)
        .attr("transform", "scale(1) rotate(0)")
        .on("end", function() {
          // Agregar animación de flotación perpetua
          d3.select(this)
            .transition()
            .duration(1000)
            .ease(d3.easeSinInOut)
            .attr("transform", "scale(1.1) rotate(5)")
            .transition()
            .duration(1000)
            .ease(d3.easeSinInOut)
            .attr("transform", "scale(1) rotate(-5)")
            .on("end", function repeat() {
              d3.select(this)
                .transition()
                .duration(1000)
                .ease(d3.easeSinInOut)
                .attr("transform", "scale(1.1) rotate(5)")
                .transition()
                .duration(1000)
                .ease(d3.easeSinInOut)
                .attr("transform", "scale(1) rotate(-5)")
                .on("end", repeat);
            });
        });
      
      // Añadir brillo alrededor del campeón
      group.append("rect")
        .attr("x", -boxW / 2 - 3)
        .attr("y", d.winner === 1 ? -boxH / 2 - 3 : -3)
        .attr("width", boxW + 6)
        .attr("height", boxH / 2 + 6)
        .attr("rx", 6)
        .attr("fill", "none")
        .attr("stroke", "#ffd700")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,3")
        .attr("opacity", 0)
        .transition()
        .duration(800)
        .delay(2200)
        .attr("opacity", 0.7)
        .on("end", function() {
          // Añadir animación de destello
          d3.select(this)
            .transition()
            .duration(2000)
            .ease(d3.easeSinInOut)
            .attr("stroke-width", 3)
            .attr("opacity", 0.9)
            .transition()
            .duration(2000)
            .ease(d3.easeSinInOut)
            .attr("stroke-width", 1)
            .attr("opacity", 0.5)
            .on("end", function repeat() {
              d3.select(this)
                .transition()
                .duration(2000)
                .attr("stroke-width", 3)
                .attr("opacity", 0.9)
                .transition()
                .duration(2000)
                .attr("stroke-width", 1)
                .attr("opacity", 0.5)
                .on("end", repeat);
            });
        });
    } catch (e) {
      console.warn("Error al crear animación para el campeón:", e);
    }
  });
}