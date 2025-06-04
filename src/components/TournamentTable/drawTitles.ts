// src/components/TournamentTable/drawTitles.ts
import * as d3 from "d3";
import { type Round } from "./types";

export function drawTitles(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  rounds: Round[],
  columnW: number,
  width: number
) {
  // Crear grupo para los títulos
  const titlesGroup = svg.append("g").attr("class", "titles-group");

  // Definir colores y efectos para cada ronda
  const roundStyles = [
    { color: "#6366f1", size: 16, weight: "bold" },
    { color: "#8b5cf6", size: 17, weight: "bold" },
    { color: "#a855f7", size: 18, weight: "bold" },
    { color: "#c026d3", size: 19, weight: "bold" },
    { color: "#d946ef", size: 20, weight: "bold" }
  ];

  // Crear definiciones para efectos de texto
  const defs = svg.select("defs");
  
  // Filtro de brillo para texto
  const textGlow = defs.append("filter")
    .attr("id", "text-glow")
    .attr("x", "-50%")
    .attr("y", "-50%")
    .attr("width", "200%")
    .attr("height", "200%");
  
  textGlow.append("feGaussianBlur")
    .attr("stdDeviation", 3)
    .attr("result", "coloredBlur");
    
  const feMerge = textGlow.append("feMerge");
  feMerge.append("feMergeNode").attr("in", "coloredBlur");
  feMerge.append("feMergeNode").attr("in", "SourceGraphic");

  rounds.forEach((round, i) => {
    const style = roundStyles[Math.min(i, roundStyles.length - 1)];
    const titleY = 45; // Ajustado para dar espacio suficiente arriba
    
    // Contenedor del título
    const titleGroup = titlesGroup.append("g")
      .attr("class", `title-round-${i}`)
      .attr("transform", `translate(${columnW * i + columnW / 2}, ${titleY})`);

    // Fondo decorativo para el título
    const bgRect = titleGroup.append("rect")
      .attr("x", -60)
      .attr("y", -20)
      .attr("width", 120)
      .attr("height", 35)
      .attr("rx", 17.5)
      .attr("fill", style.color)
      .attr("opacity", 0)
      .attr("transform", "scale(0)");

    // Texto principal
    const mainText = titleGroup.append("text")
      .attr("class", "round-title")
      .attr("text-anchor", "middle")
      .attr("font-weight", style.weight)
      .attr("font-size", 0)
      .attr("fill", "#ffffff")
      .attr("filter", "url(#text-glow)")
      .text(round.name)
      .attr("opacity", 0)
      .attr("transform", "translateY(-50px)");

    // Texto sombra/duplicado para efecto 3D
    const shadowText = titleGroup.append("text")
      .attr("class", "round-title-shadow")
      .attr("text-anchor", "middle")
      .attr("font-weight", style.weight)
      .attr("font-size", style.size)
      .attr("fill", style.color)
      .attr("opacity", 0)
      .attr("transform", "translate(2, 2)")
      .text(round.name);

    // Animación de entrada del fondo
    bgRect.transition()
      .duration(600)
      .delay(i * 150)
      .ease(d3.easeBackOut.overshoot(1.7))
      .attr("opacity", 0.15)
      .attr("transform", "scale(1)");

    // Animación de entrada del texto principal
    mainText.transition()
      .duration(800)
      .delay(i * 150 + 100)
      .ease(d3.easeElastic)
      .attr("font-size", style.size)
      .attr("opacity", 1)
      .attr("transform", "translateY(0)");

    // Animación de la sombra
    shadowText.transition()
      .duration(800)
      .delay(i * 150 + 200)
      .attr("opacity", 0.3);

    // Efecto especial para la final
    if (i === rounds.length - 1) {
      // Corona para el título de la final
      const crown = titleGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -25)
        .attr("font-size", 24)
        .text("👑")
        .attr("opacity", 0)
        .attr("transform", "scale(0) rotate(0)");

      crown.transition()
        .duration(1000)
        .delay(1000)
        .ease(d3.easeElastic)
        .attr("opacity", 1)
        .attr("transform", "scale(1) rotate(0)")
        .on("end", function() {
          // Animación de balanceo continuo
          d3.select(this)
            .transition()
            .duration(2000)
            .ease(d3.easeSinInOut)
            .attr("transform", "scale(1) rotate(-10)")
            .transition()
            .duration(2000)
            .ease(d3.easeSinInOut)
            .attr("transform", "scale(1) rotate(10)")
            .on("end", function repeat() {
              d3.select(this)
                .transition()
                .duration(2000)
                .attr("transform", "scale(1) rotate(-10)")
                .transition()
                .duration(2000)
                .attr("transform", "scale(1) rotate(10)")
                .on("end", repeat);
            });
        });

      // Estrellas alrededor del título final
      const starPositions = [
        { x: -80, y: 0, delay: 1200 },
        { x: 80, y: 0, delay: 1400 },
        { x: -60, y: -15, delay: 1600 },
        { x: 60, y: -15, delay: 1800 }
      ];

      starPositions.forEach((pos) => {
        const star = titleGroup.append("text")
          .attr("x", pos.x)
          .attr("y", pos.y)
          .attr("text-anchor", "middle")
          .attr("font-size", 16)
          .text("✨")
          .attr("opacity", 0)
          .attr("transform", `translate(${pos.x}, ${pos.y}) scale(0)`);

        star.transition()
          .duration(600)
          .delay(pos.delay)
          .ease(d3.easeBackOut)
          .attr("opacity", 1)
          .attr("transform", `translate(${pos.x}, ${pos.y}) scale(1)`)
          .on("end", function() {
            // Efecto de parpadeo
            d3.select(this)
              .transition()
              .duration(1000 + Math.random() * 1000)
              .ease(d3.easeSinInOut)
              .attr("opacity", 0.3)
              .transition()
              .duration(1000 + Math.random() * 1000)
              .ease(d3.easeSinInOut)
              .attr("opacity", 1)
              .on("end", function twinkle() {
                d3.select(this)
                  .transition()
                  .duration(1000 + Math.random() * 1000)
                  .attr("opacity", 0.3)
                  .transition()
                  .duration(1000 + Math.random() * 1000)
                  .attr("opacity", 1)
                  .on("end", twinkle);
              });
          });
      });
    }

    // Hover effect
    titleGroup
      .on("mouseover", function() {
        d3.select(this).select("rect")
          .transition()
          .duration(200)
          .attr("opacity", 0.3)
          .attr("transform", "scale(1.1)");
          
        d3.select(this).select(".round-title")
          .transition()
          .duration(200)
          .attr("font-size", style.size + 2);
      })
      .on("mouseout", function() {
        d3.select(this).select("rect")
          .transition()
          .duration(200)
          .attr("opacity", 0.15)
          .attr("transform", "scale(1)");
          
        d3.select(this).select(".round-title")
          .transition()
          .duration(200)
          .attr("font-size", style.size);
      });

    // Añadir líneas decorativas entre títulos
    if (i < rounds.length - 1) {
      const lineY = titleY; // Actualizado para usar la nueva posición
      const startX = columnW * i + columnW / 2 + 70;
      const endX = columnW * (i + 1) + columnW / 2 - 70;
      
      const decorativeLine = titlesGroup.append("line")
        .attr("x1", startX)
        .attr("y1", lineY)
        .attr("x2", startX)
        .attr("y2", lineY)
        .attr("stroke", style.color)
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5 5")
        .attr("opacity", 0);

      decorativeLine.transition()
        .duration(600)
        .delay(i * 150 + 400)
        .attr("x2", endX)
        .attr("opacity", 0.3);

      // Añadir flecha al final de la línea
      const arrow = titlesGroup.append("text")
        .attr("x", endX - 10)
        .attr("y", lineY + 5)
        .attr("font-size", 16)
        .attr("fill", style.color)
        .text("▶")
        .attr("opacity", 0)
        .attr("transform", `translate(${endX - 10}, ${lineY}) scale(0)`);

      arrow.transition()
        .duration(400)
        .delay(i * 150 + 800)
        .ease(d3.easeBackOut)
        .attr("opacity", 0.5)
        .attr("transform", `translate(${endX - 10}, ${lineY}) scale(1)`);
    }
  });

  // Añadir subtítulo general del torneo
  const tournamentTitle = svg.append("text")
    .attr("x", width / 2)
    .attr("y", 10)
    .attr("text-anchor", "middle")
    .attr("font-size", 24)
    .attr("font-weight", "bold")
    .attr("fill", "#333333")
    .text("🎮 TORNEO DE CAMPEONES 2025 🎮")
    .attr("opacity", 0)
    .attr("transform", "translateY(-20)");

  tournamentTitle.transition()
    .duration(1000)
    .delay(rounds.length * 150)
    .ease(d3.easeElastic)
    .attr("opacity", 1)
    .attr("transform", "translateY(0)");
}