// App.tsx
import TournamentTable, { type Round } from "./components/TournamentTable";
import "./App.css";

// ✱ Ejemplo simplificado de datos del torneo.
//   • En "Octavos" (8 partidos) cada partido tiene un id único, p.ej. "psv-juventus".
//   • En "Cuartos" (4 partidos), el id de cada partido es: "idPadre1|idPadre2".
//   • En "Semifinal" (2 partidos), idéntico: "idPartidoCuarto1|idPartidoCuarto2".
const rounds: Round[] = [
  {
    name: "",
    matches: [
      {
        id: "jugador1-jugador2",
        team1: { name: "jugador1", score: 3, logo: "/src/res/gamblerPlayer.png" },
        team2: { name: "jugador2", score: 1, logo: "/src/res/gamblerPlayer.png" },
        winner: 1,
      },
      {
        id: "jugador3-jugador4",
        team1: { name: "jugador3", score: 3, logo: "/src/res/gamblerPlayer.png" },
        team2: { name: "jugador4", score: 1, logo: "/src/res/gamblerPlayer.png" },
        winner: 1,
      },
      {
        id: "jugador5-jugador6",
        team1: { name: "jugador5", score: 7, logo: "/src/res/gamblerPlayer.png" },
        team2: { name: "jugador6", score: 0, logo: "/src/res/gamblerPlayer.png" },
        winner: 1,
      },
      {
        id: "jugador7-jugador8",
        team1: { name: "jugador7", score: 1, logo: "/src/res/gamblerPlayer.png" },
        team2: { name: "jugador8", score: 3, logo: "/src/res/gamblerPlayer.png" },
        winner: 2,
      },
      {
        id: "jugador9-jugador10",
        team1: { name: "jugador9", score: 3, logo: "/src/res/gamblerPlayer.png" },
        team2: { name: "jugador10", score: 3, logo: "/src/res/gamblerPlayer.png" },
        winner: 1,
      },
      {
        id: "jugador11-jugador12",
        team1: { name: "jugador11", score: 0, logo: "/src/res/gamblerPlayer.png" },
        team2: { name: "jugador12", score: 0, logo: "/src/res/gamblerPlayer.png" },
        winner: 1,
      },
      {
        id: "jugador13-jugador14",
        team1: { name: "jugador13", score: 1, logo: "/src/res/gamblerPlayer.png" },
        team2: { name: "jugador14", score: 1, logo: "/src/res/gamblerPlayer.png" },
        winner: 1,
      },
      {
        id: "jugador15-jugador16",
        team1: { name: "jugador15", score: 2, logo: "/src/res/gamblerPlayer.png" },
        team2: { name: "jugador16", score: 1, logo: "/src/res/gamblerPlayer.png" },
        winner: 1,
      },
    ],
  },
  {
    name: "",
    matches: [
      {
        id: "jugador1-jugador2|jugador3-jugador4",
        team1: { name: "jugador1", score: 2, logo: "/src/res/gamblerPlayer.png" },
        team2: { name: "jugador3", score: 0, logo: "/src/res/gamblerPlayer.png" },
        winner: 1,
      },
      {
        id: "jugador5-jugador6|jugador7-jugador8",
        team1: { name: "jugador5", score: 3, logo: "/src/res/gamblerPlayer.png" },
        team2: { name: "jugador17", score: 3, logo: "/src/res/gamblerPlayer.png" },
        winner: 1,
      },
      {
        id: "jugador9-jugador10|jugador11-jugador12",
        team1: { name: "jugador18", score: 3, logo: "/src/res/gamblerPlayer.png" },
        team2: { name: "jugador11", score: 1, logo: "/src/res/gamblerPlayer.png" },
        winner: 1,
      },
      {
        id: "jugador13-jugador14|jugador15-jugador16",
        team1: { name: "jugador13", score: 2, logo: "/src/res/gamblerPlayer.png" },
        team2: { name: "jugador15", score: 2, logo: "/src/res/gamblerPlayer.png" },
        winner: 2,
      },
    ],
  },
  {
    name: "",
    matches: [
      {
        id: "jugador1-jugador2|jugador3-jugador4|jugador5-jugador6|jugador7-jugador8",
        team1: { name: "jugador19", score: 2, logo: "/src/res/gamblerPlayer.png" },
        team2: { name: "jugador3", score: 1, logo: "/src/res/gamblerPlayer.png" },
        winner: 1,
      },
      {
        id: "jugador9-jugador10|jugador11-jugador12|jugador13-jugador14|jugador15-jugador16",
        team1: { name: "jugador11", score: 3, logo: "/src/res/gamblerPlayer.png" },
        team2: { name: "jugador18", score: 1, logo: "/src/res/gamblerPlayer.png" },
        winner: 1,
      },
    ],
  },
  {
    name: " ",
    matches: [
      {
        id: "jugador1-jugador2|jugador3-jugador4|jugador5-jugador6|jugador7-jugador8|jugador9-jugador10|jugador11-jugador12|jugador13-jugador14|jugador15-jugador16",
        team1: { name: "jugador5", score: 2, logo: "/src/res/gamblerPlayer.png" },
        team2: { name: "jugador19", score: 1, logo: "/src/res/gamblerPlayer.png" },
        winner: 1,
      },
    ],
  },
];

export default function App() {
  return (
    <div className="tournament-container">
      
      <TournamentTable rounds={rounds} width={1100} matchGap={80} />
    </div>
  );
}
