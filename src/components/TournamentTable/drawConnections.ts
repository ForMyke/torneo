// src/components/TournamentTable/drawConnections.ts
import * as d3 from "d3";
import { type Round } from "./types";
import { type Pos } from "./layout";

/**
 * Dibuja conexiones animadas con efectos creativos entre rondas
 */
export function drawConnections(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  rounds: Round[],
  pos: Map<string, Pos>,
  columnW: number
) {
  // Crear grupo para las conexiones
  const connectionsGroup = svg.append("g").attr("class", "connections");

  // Definir diferentes estilos de línea
  const lineStyles = [
    { dash: "5 5", color: "#c6aae8", width: 2 },
    { dash: "10 5", color: "#a89cc8", width: 2.5 },
    { dash: "5 10", color: "#8b7ab8", width: 3 },
    { dash: "15 5", color: "#6e5ba8", width: 2 }
  ];

  // Crear gradientes para las líneas
  const defs = svg.select("defs");
  const connectionGradient = defs.append("linearGradient")
    .attr("id", "connection-gradient")
    .attr("x1", "0%").attr("y1", "0%")
    .attr("x2", "100%").attr("y2", "0%");
  
  connectionGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#333333")
    .attr("stop-opacity", 0.3);
  
  connectionGradient.append("stop")
    .attr("offset", "50%")
    .attr("stop-color", "#c6aae8")
    .attr("stop-opacity", 1);
    
  connectionGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#333333")
    .attr("stop-opacity", 0.3);

  rounds.forEach((round, r) => {
    if (r === 0) return;

    const style = lineStyles[r % lineStyles.length];

    round.matches.forEach((m, matchIndex) => {
      const parts = m.id.split("|");
      const mid = Math.floor(parts.length / 2);
      const leftId = parts.slice(0, mid).join("|");
      const rightId = parts.slice(mid).join("|");
      const pL = pos.get(leftId)!;
      const pR = pos.get(rightId)!;
      const to = pos.get(m.id)!;

      // Crear path con curvas más suaves y orgánicas
      const createPath = (from: Pos, isLeft: boolean) => {
        const midX = from.x + (to.x - from.x) / 2;
        const controlOffset = isLeft ? -20 : 20;
        
        // Usar curvas de Bézier cúbicas para paths más suaves
        return `M${from.x} ${from.y} 
                C${from.x + columnW/3} ${from.y + controlOffset}, 
                  ${midX} ${(from.y + to.y) / 2}, 
                  ${midX} ${to.y}
                L${to.x} ${to.y}`;
      };

      // Dibujar conexiones con efectos
      [pL, pR].forEach((from, idx) => {
        const pathGroup = connectionsGroup.append("g")
          .attr("class", "connection-group");

        // Línea de fondo (glow)
        const glowPath = pathGroup.append("path")
          .attr("d", createPath(from, idx === 0))
          .attr("fill", "none")
          .attr("stroke", style.color)
          .attr("stroke-width", style.width + 3)
          .attr("stroke-linecap", "round")
          .attr("opacity", 0)
          .attr("filter", "url(#glow)");

        // Línea principal
        const mainPath = pathGroup.append("path")
          .attr("d", createPath(from, idx === 0))
          .attr("fill", "none")
          .attr("stroke", "url(#connection-gradient)")
          .attr("stroke-width", style.width)
          .attr("stroke-linecap", "round")
          .attr("stroke-dasharray", style.dash)
          .attr("opacity", 0);

        const pathLength = (mainPath.node() as SVGPathElement).getTotalLength();
        
        // Animación de dibujo inicial
        mainPath
          .attr("stroke-dasharray", `${pathLength} ${pathLength}`)
          .attr("stroke-dashoffset", pathLength)
          .transition()
          .duration(800)
          .delay(r * 400 + matchIndex * 100 + idx * 50)
          .ease(d3.easeQuadInOut)
          .attr("stroke-dashoffset", 0)
          .attr("opacity", 0.8)
          .on("end", function() {
            // Cambiar a animación de dash después del dibujo inicial
            d3.select(this)
              .attr("stroke-dasharray", style.dash)
              .attr("stroke-dashoffset", 0);
            
            // Iniciar animación de flujo
            animateFlow(d3.select(this), pathLength, style.dash);
          });

        // Animar glow
        glowPath.transition()
          .duration(800)
          .delay(r * 400 + matchIndex * 100 + idx * 50)
          .attr("opacity", 0.2);

        // Añadir partículas que fluyen por las líneas
        if (r === rounds.length - 1) {
          createFlowingParticles(pathGroup, mainPath, style.color);
        }

        // Efecto de pulso para las conexiones finales
        if (r >= rounds.length - 2) {
          pathGroup.append("circle")
            .attr("r", 0)
            .attr("fill", "none")
            .attr("stroke", style.color)
            .attr("stroke-width", 2)
            .attr("cx", to.x)
            .attr("cy", to.y)
            .attr("opacity", 0)
            .transition()
            .delay(1500 + r * 200)
            .duration(1000)
            .attr("r", 30)
            .attr("opacity", 0.5)
            .transition()
            .duration(1000)
            .attr("r", 50)
            .attr("opacity", 0)
            .remove();
        }
      });

      // Añadir nodo de conexión animado
      const nodeGroup = connectionsGroup.append("g")
        .attr("transform", `translate(${to.x - columnW/2}, ${to.y})`);

      const node = nodeGroup.append("circle")
        .attr("r", 0)
        .attr("fill", style.color)
        .attr("opacity", 0);

      node.transition()
        .duration(400)
        .delay(r * 400 + matchIndex * 100 + 200)
        .attr("r", 4)
        .attr("opacity", 0.8)
        .transition()
        .duration(400)
        .attr("r", 3);

      // Animación de respiración para los nodos
      node.transition()
        .delay(2000)
        .duration(1500)
        .ease(d3.easeSinInOut)
        .attr("r", 5)
        .transition()
        .duration(1500)
        .ease(d3.easeSinInOut)
        .attr("r", 3)
        .on("end", function repeat() {
          d3.select(this)
            .transition()
            .duration(1500)
            .attr("r", 5)
            .transition()
            .duration(1500)
            .attr("r", 3)
            .on("end", repeat);
        });
    });
  });
}

/**
 * Anima el flujo del dash pattern
 */
function animateFlow(
  path: d3.Selection<SVGPathElement, unknown, any, unknown>,
  pathLength: number,
  dashPattern: string
) {
  const dashArray = dashPattern.split(" ").map(Number);
  const dashLength = dashArray.reduce((a, b) => a + b, 0);
  
  path
    .attr("stroke-dasharray", dashPattern)
    .attr("stroke-dashoffset", 0)
    .transition()
    .duration(3000)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", -dashLength)
    .on("end", () => animateFlow(path, pathLength, dashPattern));
}

/**
 * Crea partículas que fluyen a lo largo de un path
 */
function createFlowingParticles(
  group: d3.Selection<SVGGElement, unknown, any, unknown>,
  path: d3.Selection<SVGPathElement, unknown, any, unknown>,
  color: string
) {
  const pathNode = path.node() as SVGPathElement;
  const pathLength = pathNode.getTotalLength();

  // Crear múltiples partículas
  for (let i = 0; i < 3; i++) {
    const particle = group.append("circle")
      .attr("r", 2)
      .attr("fill", color)
      .attr("opacity", 0);

    const animateParticle = () => {
      particle
        .attr("opacity", 0)
        .transition()
        .delay(i * 1000)
        .duration(100)
        .attr("opacity", 0.8)
        .transition()
        .duration(2500)
        .ease(d3.easeQuadInOut)
        .attrTween("transform", () => {
          return (t: number) => {
            const point = pathNode.getPointAtLength(t * pathLength);
            return `translate(${point.x}, ${point.y})`;
          };
        })
        .transition()
        .duration(100)
        .attr("opacity", 0)
        .on("end", animateParticle);
    };

    particle.transition()
      .delay(2000 + i * 500)
      .on("end", animateParticle);
  }
}