// src/components/TournamentTable/drawDefs.ts
import * as d3 from "d3";

export function drawDefs(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) {
  const defs = svg.append("defs");
  
  // Filtro de brillo básico
  const glow = defs.append("filter")
    .attr("id", "glow")
    .attr("x", "-50%")
    .attr("y", "-50%")
    .attr("width", "200%")
    .attr("height", "200%");
    
  glow.append("feGaussianBlur")
    .attr("stdDeviation", 1.5)
    .attr("result", "coloredBlur");
    
  const glowMerge = glow.append("feMerge");
  glowMerge.append("feMergeNode").attr("in", "coloredBlur");
  glowMerge.append("feMergeNode").attr("in", "SourceGraphic");

  // Filtro de brillo intenso para ganadores
  const intenseGlow = defs.append("filter")
    .attr("id", "intense-glow")
    .attr("x", "-50%")
    .attr("y", "-50%")
    .attr("width", "200%")
    .attr("height", "200%");
    
  intenseGlow.append("feGaussianBlur")
    .attr("stdDeviation", 3)
    .attr("result", "coloredBlur");
    
  const intenseGlowMerge = intenseGlow.append("feMerge");
  intenseGlowMerge.append("feMergeNode").attr("in", "coloredBlur");
  intenseGlowMerge.append("feMergeNode").attr("in", "coloredBlur");
  intenseGlowMerge.append("feMergeNode").attr("in", "SourceGraphic");

  // Filtro de sombra
  const shadow = defs.append("filter")
    .attr("id", "shadow")
    .attr("x", "-50%")
    .attr("y", "-50%")
    .attr("width", "200%")
    .attr("height", "200%");
    
  shadow.append("feDropShadow")
    .attr("dx", 2)
    .attr("dy", 2)
    .attr("stdDeviation", 3)
    .attr("flood-opacity", 0.3);

  // Patrón de puntos para fondos
  const dotPattern = defs.append("pattern")
    .attr("id", "dot-pattern")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 20)
    .attr("height", 20)
    .attr("patternUnits", "userSpaceOnUse");
    
  dotPattern.append("circle")
    .attr("cx", 10)
    .attr("cy", 10)
    .attr("r", 1)
    .attr("fill", "#c6aae8")
    .attr("opacity", 0.2);

  // Gradiente radial para efectos de explosión
  const explosionGradient = defs.append("radialGradient")
    .attr("id", "explosion-gradient");
    
  explosionGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#ffffff")
    .attr("stop-opacity", 1);
    
  explosionGradient.append("stop")
    .attr("offset", "30%")
    .attr("stop-color", "#ffd700")
    .attr("stop-opacity", 0.8);
    
  explosionGradient.append("stop")
    .attr("offset", "70%")
    .attr("stop-color", "#ff6b6b")
    .attr("stop-opacity", 0.4);
    
  explosionGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#ff0000")
    .attr("stop-opacity", 0);

  // Gradiente animado para efectos de energía
  const energyGradient = defs.append("linearGradient")
    .attr("id", "energy-gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "100%");
    
  energyGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#00ffff")
    .attr("stop-opacity", 0);
    
  const energyStop1 = energyGradient.append("stop")
    .attr("offset", "40%")
    .attr("stop-color", "#00ffff")
    .attr("stop-opacity", 1);
    
  const energyStop2 = energyGradient.append("stop")
    .attr("offset", "60%")
    .attr("stop-color", "#ff00ff")
    .attr("stop-opacity", 1);
    
  energyGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#ff00ff")
    .attr("stop-opacity", 0);

  // Animar el gradiente de energía
  energyStop1.append("animate")
    .attr("attributeName", "offset")
    .attr("values", "0%;50%;100%;50%;0%")
    .attr("dur", "4s")
    .attr("repeatCount", "indefinite");
    
  energyStop2.append("animate")
    .attr("attributeName", "offset")
    .attr("values", "0%;50%;100%;50%;0%")
    .attr("dur", "4s")
    .attr("begin", "0.5s")
    .attr("repeatCount", "indefinite");

  // Filtro de distorsión para efectos especiales
  const turbulence = defs.append("filter")
    .attr("id", "turbulence")
    .attr("x", "-50%")
    .attr("y", "-50%")
    .attr("width", "200%")
    .attr("height", "200%");
    
  turbulence.append("feTurbulence")
    .attr("type", "fractalNoise")
    .attr("baseFrequency", 0.01)
    .attr("numOctaves", 2)
    .attr("result", "turbulence");
    
  turbulence.append("feColorMatrix")
    .attr("in", "turbulence")
    .attr("type", "saturate")
    .attr("values", "0");

  // Máscara circular para efectos de revelado
  const clipPath = defs.append("clipPath")
    .attr("id", "circle-clip");
    
  clipPath.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 100);

  // Patrón de líneas diagonales
  const diagonalPattern = defs.append("pattern")
    .attr("id", "diagonal-lines")
    .attr("patternUnits", "userSpaceOnUse")
    .attr("width", 10)
    .attr("height", 10);
    
  diagonalPattern.append("path")
    .attr("d", "M0,10 L10,0")
    .attr("stroke", "#c6aae8")
    .attr("stroke-width", 0.5)
    .attr("opacity", 0.2);

  // Gradiente metálico para efectos premium
  const metalGradient = defs.append("linearGradient")
    .attr("id", "metal-gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%");
    
  metalGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#e8e8e8");
    
  metalGradient.append("stop")
    .attr("offset", "50%")
    .attr("stop-color", "#ffffff");
    
  metalGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#c0c0c0");
}