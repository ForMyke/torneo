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
 * Renderiza todos los partidos con animaciones creativas y efectos visuales
 */
export function drawMatches(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  rounds: Round[],
  pos: Map<string, Pos>,
  options: MatchRenderOptions
) {
  const { boxW, boxH, pad } = options;

  // Crear gradientes para efectos visuales
  const defs = svg.select("defs");
  
  // Gradiente para ganadores
  const winnerGradient = defs.append("linearGradient")
    .attr("id", "winner-gradient")
    .attr("x1", "0%").attr("y1", "0%")
    .attr("x2", "100%").attr("y2", "100%");
  
  winnerGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#ffd700")
    .attr("stop-opacity", 0.3);
  
  winnerGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#ffed4e")
    .attr("stop-opacity", 0.1);

  // Gradiente arcoíris
  const rainbowGradient = defs.append("linearGradient")
    .attr("id", "rainbow-gradient")
    .attr("x1", "0%").attr("y1", "0%")
    .attr("x2", "100%").attr("y2", "0%");
  
  const rainbowColors = ["#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#9400d3"];
  rainbowColors.forEach((color, i) => {
    rainbowGradient.append("stop")
      .attr("offset", `${(i / (rainbowColors.length - 1)) * 100}%`)
      .attr("stop-color", color);
  });

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
        return `translate(${p.x},${p.y}) scale(0) rotate(${Math.random() * 360})`;
      })
      .attr("opacity", 0);

  // Transición de entrada espectacular
  g.transition()
    .duration(1000)
    .delay((d, i) => 200 + i * 80 + d.roundIndex * 200)
    .ease(d3.easeElastic)
    .attr("opacity", 1)
    .attr("transform", d => {
      const p = pos.get(d.id)!;
      return `translate(${p.x},${p.y}) scale(1) rotate(0)`;
    });

  // Añadir efecto de partículas para las finales
  g.filter((d) => d.roundIndex >= rounds.length - 2)
    .each(function() {
      const group = d3.select(this);
      for (let i = 0; i < 3; i++) {
        group.append("circle")
          .attr("class", "particle")
          .attr("r", 3)
          .attr("fill", "#c6aae8")
          .attr("opacity", 0)
          .transition()
          .delay(1500 + i * 200)
          .duration(2000)
          .attr("opacity", 1)
          .attr("r", 0)
          .attr("cx", Math.random() * 100 - 50)
          .attr("cy", Math.random() * 100 - 50)
          .remove();
      }
    });

  // 1) Fondo con efecto morphing para ganadores
  g.append("rect")
    .attr("class", "winner-highlight")
    .attr("x", d => d.winner === 1 ? -boxW / 2 : 0)
    .attr("y", d => d.winner === 1 ? -boxH / 2 : 0)
    .attr("width", boxW / 2)
    .attr("height", boxH / 2)
    .attr("fill", d => d.roundIndex === rounds.length - 1 ? "url(#winner-gradient)" : "#333333")
    .attr("opacity", d => d.roundIndex === rounds.length - 1 ? 0.5 : 0.1)
    .attr("rx", 6)
    .attr("filter", d => d.roundIndex === rounds.length - 1 ? "url(#glow)" : "none");

  // 2) Caja principal con efectos
  g.append("rect")
    .attr("class", "match-box")
    .attr("x", -boxW / 2)
    .attr("y", -boxH / 2)
    .attr("width", boxW)
    .attr("height", boxH)
    .attr("rx", 6)
    .attr("fill", "#ffffff")
    .attr("stroke", "#333333")
    .attr("stroke-width", 1.5)
    .attr("filter", "url(#glow)");

  // Añadir animación de pulso a las cajas de las finales
  g.filter((d) => d.roundIndex >= rounds.length - 2)
    .select(".match-box")
    .transition()
    .duration(2000)
    .delay(2000)
    .attr("stroke", "#c6aae8")
    .attr("stroke-width", 2)
    .transition()
    .duration(1000)
    .ease(d3.easeSinInOut)
    .attr("stroke-width", 3)
    .transition()
    .duration(1000)
    .ease(d3.easeSinInOut)
    .attr("stroke-width", 2)
    .on("end", function repeat() {
      d3.select(this)
        .transition()
        .duration(1000)
        .attr("stroke-width", 3)
        .transition()
        .duration(1000)
        .attr("stroke-width", 2)
        .on("end", repeat);
    });

  // 3) Logos con efecto de rotación
  g.append("image")
    .attr("class", "team-logo")
    .attr("xlink:href", d => d.team1.logo || "")
    .attr("x", -boxW / 2 + pad)
    .attr("y", -boxH / 2 + 8)
    .attr("width", 32)
    .attr("height", 32)
    .attr("visibility", d => d.team1.logo ? "visible" : "hidden")
    .attr("transform", "rotate(0)")
    .transition()
    .duration(800)
    .delay((_, i) => 1000 + i * 50)
    .ease(d3.easeBackOut)
    .attr("transform", "rotate(360)");

  g.append("image")
    .attr("class", "team-logo")
    .attr("xlink:href", d => d.team2.logo || "")
    .attr("x", -boxW / 2 + pad)
    .attr("y", -2)
    .attr("width", 32)
    .attr("height", 32)
    .attr("visibility", d => d.team2.logo ? "visible" : "hidden")
    .attr("transform", "rotate(0)")
    .transition()
    .duration(800)
    .delay((_, i) => 1100 + i * 50)
    .ease(d3.easeBackOut)
    .attr("transform", "rotate(360)");

  // 4) Texto con efecto de escritura
  g.append("text")
    .attr("class", "team-name")
    .attr("x", -boxW / 2 + pad + 40)
    .attr("y", -boxH / 4)
    .attr("font-size", 14)
    .attr("fill", "#333333")
    .attr("font-family", "Raleway, sans-serif")
    .text(d => d.team1.name)
    .attr("opacity", 0)
    .transition()
    .duration(500)
    .delay((_, i) => 1200 + i * 30)
    .attr("opacity", 1);

  g.append("text")
    .attr("class", "team-score")
    .attr("x", boxW / 2 - pad)
    .attr("y", -boxH / 4)
    .attr("text-anchor", "end")
    .attr("font-size", 14)
    .attr("font-weight", "bold")
    .attr("fill", "#000000")
    .attr("font-family", "Raleway, sans-serif")
    .text(d => d.team1.score.toString())
    .attr("transform", `scale(0)`)
    .transition()
    .duration(400)
    .delay((_, i) => 1400 + i * 30)
    .ease(d3.easeBounceOut)
    .attr("transform", `scale(1)`);

  g.append("text")
    .attr("class", "team-name")
    .attr("x", -boxW / 2 + pad + 40)
    .attr("y", boxH / 4 + 4)
    .attr("font-size", 14)
    .attr("fill", "#333333")
    .attr("font-family", "Raleway, sans-serif")
    .text(d => d.team2.name)
    .attr("opacity", 0)
    .transition()
    .duration(500)
    .delay((_, i) => 1300 + i * 30)
    .attr("opacity", 1);

  g.append("text")
    .attr("class", "team-score")
    .attr("x", boxW / 2 - pad)
    .attr("y", boxH / 4 + 4)
    .attr("text-anchor", "end")
    .attr("font-size", 14)
    .attr("font-weight", "bold")
    .attr("fill", "#000000")
    .attr("font-family", "Raleway, sans-serif")
    .text(d => d.team2.score.toString())
    .attr("transform", `scale(0)`)
    .transition()
    .duration(400)
    .delay((_, i) => 1500 + i * 30)
    .ease(d3.easeBounceOut)
    .attr("transform", `scale(1)`);

  // 5) Efectos especiales para ganadores
  g.filter(d => d.winner === 1 || d.winner === 2)
    .append("text")
    .attr("class", "winner-star")
    .attr("x", d => d.winner === 1 ? boxW / 2 - pad - 20 : boxW / 2 - pad - 20)
    .attr("y", d => d.winner === 1 ? -boxH / 4 : boxH / 4 + 4)
    .attr("font-size", 20)
    .attr("fill", "#ffd700")
    .text("★")
    .attr("opacity", 0)
    .attr("transform", "scale(0)")
    .transition()
    .duration(600)
    .delay((_, i) => 1800 + i * 50)
    .ease(d3.easeElastic)
    .attr("opacity", 1)
    .attr("transform", "scale(1)");

  // 6) Hover effects con animaciones
  g.on("mouseover", function(_, d) {
      const selection = d3.select(this);
      
      // Escalar el contenedor
      selection.transition()
        .duration(200)
        .attr("transform", () => {
          const p = pos.get(d.id)!;
          return `translate(${p.x},${p.y}) scale(1.05)`;
        });
      
      // Cambiar color y grosor del borde
      selection.select(".match-box")
        .transition().duration(200)
        .attr("stroke-width", 3)
        .attr("stroke", "#2563eb")
        .attr("fill", "#f0f9ff");
      
      // Rotar logos
      selection.selectAll(".team-logo")
        .transition()
        .duration(300)
        .attr("transform", "rotate(10)");
        
      // Efecto de brillo en el texto del ganador
      const winnerTeam = d.winner === 1 ? 1 : 2;
      selection.selectAll(".team-score")
        .filter((_, i) => i === winnerTeam - 1)
        .transition()
        .duration(200)
        .attr("fill", "#2563eb")
        .attr("font-size", 16);
    })
    .on("mouseout", function(_, d) {
      const selection = d3.select(this);
      
      // Restaurar escala
      selection.transition()
        .duration(200)
        .attr("transform", () => {
          const p = pos.get(d.id)!;
          return `translate(${p.x},${p.y}) scale(1)`;
        });
      
      // Restaurar borde
      selection.select(".match-box")
        .transition().duration(200)
        .attr("stroke-width", 1.5)
        .attr("stroke", "#333333")
        .attr("fill", "#ffffff");
      
      // Restaurar logos
      selection.selectAll(".team-logo")
        .transition()
        .duration(300)
        .attr("transform", "rotate(0)");
        
      // Restaurar texto
      selection.selectAll(".team-score")
        .transition()
        .duration(200)
        .attr("fill", "#000000")
        .attr("font-size", 14);
    });

  // 7) Animación especial para el campeón
  const champion = g.filter((d) => d.roundIndex === rounds.length - 1 && d.winner > 0);
  
  champion.append("text")
    .attr("class", "champion-label")
    .attr("x", 0)
    .attr("y", -boxH / 2 - 15)
    .attr("text-anchor", "middle")
    .attr("font-size", 16)
    .attr("font-weight", "bold")
    .attr("fill", "#ffd700")
    .text("🏆 CAMPEÓN 🏆")
    .attr("opacity", 0)
    .transition()
    .duration(1000)
    .delay(2500)
    .attr("opacity", 1)
    .on("end", function() {
      d3.select(this)
        .transition()
        .duration(2000)
        .ease(d3.easeSinInOut)
        .attr("transform", "scale(1.1)")
        .transition()
        .duration(2000)
        .ease(d3.easeSinInOut)
        .attr("transform", "scale(1)")
        .on("end", function repeat() {
          d3.select(this)
            .transition()
            .duration(2000)
            .attr("transform", "scale(1.1)")
            .transition()
            .duration(2000)
            .attr("transform", "scale(1)")
            .on("end", repeat);
        });
    });

  // 8) Efecto de confeti para el ganador final
  champion.each(function() {
    const group = d3.select(this);
    const colors = ["#ff0080", "#00ff80", "#80ff00", "#ff8000", "#8000ff", "#ff0040"];
    
    for (let i = 0; i < 20; i++) {
      group.append("rect")
        .attr("width", 5)
        .attr("height", 10)
        .attr("fill", colors[i % colors.length])
        .attr("x", 0)
        .attr("y", 0)
        .attr("opacity", 0)
        .transition()
        .delay(3000 + i * 50)
        .duration(2000)
        .attr("opacity", 1)
        .attr("x", (Math.random() - 0.5) * 200)
        .attr("y", -Math.random() * 150 - 50)
        .attr("transform", `rotate(${Math.random() * 360})`)
        .transition()
        .duration(1000)
        .attr("y", 100)
        .attr("opacity", 0)
        .remove();
    }
  });
}