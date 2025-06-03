// App.tsx
// import React from "react";
import TournamentTable, { type Round } from "./components/TournamentTable";

// ✱ Ejemplo simplificado de datos del torneo.
//   • En "Octavos" (8 partidos) cada partido tiene un id único, p.ej. "psv-juventus".
//   • En "Cuartos" (4 partidos), el id de cada partido es: "idPadre1|idPadre2".
//   • En "Semifinal" (2 partidos), idéntico: "idPartidoCuarto1|idPartidoCuarto2".
const rounds: Round[] = [
  {
    name: "",
    matches: [
      {
        id: "jugador1-jugador2", // Original: psv-juventus
        team1: { name: "jugador1", score: 3, logo: "/logos/psv.png" }, // PSV -> jugador1
        team2: { name: "jugador2", score: 1, logo: "/logos/juventus.png" }, // Juventus -> jugador2
        winner: 1,
      },
      {
        id: "jugador3-jugador4", // Original: realmadrid-mancity
        team1: { name: "jugador3", score: 3, logo: "/logos/realmadrid.png" }, // Real Madrid -> jugador3
        team2: { name: "jugador4", score: 1, logo: "/logos/mancity.png" }, // Man City -> jugador4
        winner: 1,
      },
      {
        id: "jugador5-jugador6", // Original: paris-brest
        team1: { name: "jugador5", score: 7, logo: "/logos/psg.png" }, // Paris -> jugador5
        team2: { name: "jugador6", score: 0, logo: "/logos/brest.png" }, // Brest -> jugador6
        winner: 1,
      },
      {
        id: "jugador7-jugador8", // Original: atalanta-clubbrugge
        team1: { name: "jugador7", score: 1, logo: "/logos/atalanta.png" }, // Atalanta -> jugador7
        team2: { name: "jugador8", score: 3, logo: "/logos/clubbrugge.png" }, // Club Brugge -> jugador8
        winner: 2,
      },
      {
        id: "jugador9-jugador10", // Original: benfica-monaco
        team1: { name: "jugador9", score: 3, logo: "/logos/benfica.png" }, // Benfica -> jugador9
        team2: { name: "jugador10", score: 3, logo: "/logos/monaco.png" }, // Monaco -> jugador10
        winner: 1, // ganar por away goals, por ejemplo
      },
      {
        id: "jugador11-jugador12", // Original: dortmund-sporting
        team1: { name: "jugador11", score: 0, logo: "/logos/dortmund.png" }, // B. Dortmund -> jugador11
        team2: { name: "jugador12", score: 0, logo: "/logos/sporting.png" }, // Sporting CP -> jugador12
        winner: 1,
      },
      {
        id: "jugador13-jugador14", // Original: bayern-celtic
        team1: { name: "jugador13", score: 1, logo: "/logos/bayern.png" }, // Bayern München -> jugador13
        team2: { name: "jugador14", score: 1, logo: "/logos/celtic.png" }, // Celtic -> jugador14
        winner: 1,
      },
      {
        id: "jugador15-jugador16", // Original: inter-feyenoord
        team1: { name: "jugador15", score: 2, logo: "/logos/inter.png" }, // Inter -> jugador15
        team2: { name: "jugador16", score: 1, logo: "/logos/feyenoord.png" }, // Feyenoord -> jugador16
        winner: 1,
      },
    ],
  },
  {
    name: "",
    matches: [
      {
        id: "jugador1-jugador2|jugador3-jugador4", // Original: psv-juventus|realmadrid-mancity
        team1: { name: "jugador1", score: 2, logo: "/logos/psv.png" }, // PSV -> jugador1
        team2: { name: "jugador3", score: 0, logo: "/logos/realmadrid.png" }, // Real Madrid -> jugador3
        winner: 1,
      },
      {
        id: "jugador5-jugador6|jugador7-jugador8", // Original: paris-brest|atalanta-clubbrugge
        team1: { name: "jugador5", score: 3, logo: "/logos/psg.png" }, // Paris -> jugador5
        team2: { name: "jugador17", score: 3, logo: "/logos/astonvilla.png" }, // Aston Villa -> jugador17
        winner: 1,
      },
      {
        id: "jugador9-jugador10|jugador11-jugador12", // Original: benfica-monaco|dortmund-sporting
        team1: { name: "jugador18", score: 3, logo: "/logos/barcelona.png" }, // Barcelona -> jugador18
        team2: { name: "jugador11", score: 1, logo: "/logos/dortmund.png" }, // B. Dortmund -> jugador11
        winner: 1,
      },
      {
        id: "jugador13-jugador14|jugador15-jugador16", // Original: bayern-celtic|inter-feyenoord
        team1: { name: "jugador13", score: 2, logo: "/logos/bayern.png" }, // Bayern München -> jugador13
        team2: { name: "jugador15", score: 2, logo: "/logos/inter.png" }, // Inter -> jugador15
        winner: 2,
      },
    ],
  },
  {
    name: "",
    matches: [
      {
        id: "jugador1-jugador2|jugador3-jugador4|jugador5-jugador6|jugador7-jugador8", // Original: psv-juventus|realmadrid-mancity|paris-brest|atalanta-clubbrugge
        team1: { name: "jugador19", score: 2, logo: "/logos/arsenal.png" }, // Arsenal -> jugador19
        team2: { name: "jugador3", score: 1, logo: "/logos/realmadrid.png" }, // Real Madrid -> jugador3
        winner: 1,
      },
      {
        id: "jugador9-jugador10|jugador11-jugador12|jugador13-jugador14|jugador15-jugador16", // Original: benfica-monaco|dortmund-sporting|bayern-celtic|inter-feyenoord
        team1: { name: "jugador11", score: 3, logo: "/logos/dortmund.png" }, // B. Dortmund -> jugador11
        team2: { name: "jugador18", score: 1, logo: "/logos/barcelona.png" }, // Barcelona -> jugador18
        winner: 1,
      },
    ],
  },
  {
    name: " ",
    matches: [
      {
        id:
          "jugador1-jugador2|jugador3-jugador4|jugador5-jugador6|jugador7-jugador8" +
          "|" +
          "jugador9-jugador10|jugador11-jugador12|jugador13-jugador14|jugador15-jugador16",
        // Original: "psv-juventus|realmadrid-mancity|paris-brest|atalanta-clubbrugge" + "|" + "benfica-monaco|dortmund-sporting|bayern-celtic|inter-feyenoord"
        team1: { name: "jugador5", score: 2, logo: "/logos/psg.png" }, // Paris -> jugador5
        team2: { name: "jugador19", score: 1, logo: "/logos/arsenal.png" }, // Arsenal -> jugador19
        winner: 1,
      },
    ],
  },
];
export default function App() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ textAlign: "center" }}>Torneo</h2>
      <TournamentTable rounds={rounds} width={1100} matchGap={80} />
    </div>
  );
}
