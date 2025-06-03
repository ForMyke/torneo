// App.tsx
import TournamentTable, { type Round } from "./components/TournamentTable";
import "./App.css";

// ✱ Ejemplo simplificado de datos del torneo.  
//   • En "Octavos" (8 partidos) cada partido tiene un id único, p.ej. "psv-juventus".  
//   • En "Cuartos" (4 partidos), el id de cada partido es: "idPadre1|idPadre2".  
//   • En "Semifinal" (2 partidos), idéntico: "idPartidoCuarto1|idPartidoCuarto2".  
//   • En "Final" (1 partido) el id es: "idSemi1|idSemi2".  

const rounds: Round[] = [
  {
    name: "Octavos",
    matches: [
      {
        id: "psv-juventus",
        team1: { name: "PSV",    score: 3, logo: "/logos/psv.png" },
        team2: { name: "Juventus", score: 1, logo: "/logos/juventus.png" },
        winner: 1,
      },
      {
        id: "realmadrid-mancity",
        team1: { name: "Real Madrid", score: 3, logo: "/logos/realmadrid.png" },
        team2: { name: "Man City",   score: 1, logo: "/logos/mancity.png" },
        winner: 1,
      },
      {
        id: "paris-brest",
        team1: { name: "Paris", score: 7, logo: "/logos/psg.png" },
        team2: { name: "Brest", score: 0, logo: "/logos/brest.png" },
        winner: 1,
      },
      {
        id: "atalanta-clubbrugge",
        team1: { name: "Atalanta",   score: 1, logo: "/logos/atalanta.png" },
        team2: { name: "Club Brugge", score: 3, logo: "/logos/clubbrugge.png" },
        winner: 2,
      },
      {
        id: "benfica-monaco",
        team1: { name: "Benfica", score: 3, logo: "/logos/benfica.png" },
        team2: { name: "Monaco",  score: 3, logo: "/logos/monaco.png" },
        winner: 1, // ganar por away goals, por ejemplo
      },
      {
        id: "dortmund-sporting",
        team1: { name: "B. Dortmund", score: 0, logo: "/logos/dortmund.png" },
        team2: { name: "Sporting CP", score: 0, logo: "/logos/sporting.png" },
        winner: 1,
      },
      {
        id: "bayern-celtic",
        team1: { name: "Bayern München", score: 1, logo: "/logos/bayern.png" },
        team2: { name: "Celtic",        score: 1, logo: "/logos/celtic.png" },
        winner: 1,
      },
      {
        id: "inter-feyenoord",
        team1: { name: "Inter",      score: 2, logo: "/logos/inter.png" },
        team2: { name: "Feyenoord",  score: 1, logo: "/logos/feyenoord.png" },
        winner: 1,
      },
    ],
  },
  {
    name: "Cuartos",
    matches: [
      // El primer cuartos se compone de los ganadores de “psv-juventus” y “realmadrid-mancity”
      {
        id: "psv-juventus|realmadrid-mancity",
        team1: { name: "PSV",        score: 2, logo: "/logos/psv.png" },
        team2: { name: "Real Madrid", score: 0, logo: "/logos/realmadrid.png" },
        winner: 1,
      },
      // El segundo cuartos: de “paris-brest” y “atalanta-clubbrugge”
      {
        id: "paris-brest|atalanta-clubbrugge",
        team1: { name: "Paris", score: 3, logo: "/logos/psg.png" },
        team2: { name: "Aston Villa", score: 3, logo: "/logos/astonvilla.png" },
        winner: 1,
      },
      // Tercer cuartos: “benfica-monaco” vs “dortmund-sporting”
      {
        id: "benfica-monaco|dortmund-sporting",
        team1: { name: "Barcelona", score: 3, logo: "/logos/barcelona.png" },
        team2: { name: "B. Dortmund", score: 1, logo: "/logos/dortmund.png" },
        winner: 1,
      },
      // Cuarto cuartos: “bayern-celtic” vs “inter-feyenoord”
      {
        id: "bayern-celtic|inter-feyenoord",
        team1: { name: "Bayern München", score: 2, logo: "/logos/bayern.png" },
        team2: { name: "Inter", score: 2, logo: "/logos/inter.png" },
        winner: 2,
      },
    ],
  },
  {
    name: "Semifinal",
    matches: [
      // Ganador de “psv-juventus|realmadrid-mancity” vs “paris-brest|atalanta-clubbrugge”
      {
        id: "psv-juventus|realmadrid-mancity|paris-brest|atalanta-clubbrugge",
        // Para evitar mucha concatenación confusa, puedes renombrar este id
        // a algo como “cuartos1|cuartos2”, pero en este ejemplo lo dejamos literal:
        team1: { name: "Arsenal", score: 2, logo: "/logos/arsenal.png" },
        team2: { name: "Real Madrid", score: 1, logo: "/logos/realmadrid.png" },
        winner: 1,
      },
      // Ganador de “benfica-monaco|dortmund-sporting” vs “bayern-celtic|inter-feyenoord”
      {
        id: "benfica-monaco|dortmund-sporting|bayern-celtic|inter-feyenoord",
        team1: { name: "B. Dortmund", score: 3, logo: "/logos/dortmund.png" },
        team2: { name: "Barcelona",   score: 1, logo: "/logos/barcelona.png" },
        winner: 1,
      },
    ],
  },
  {
    name: "Final",
    matches: [
      {
        id: 
          // Para simplificar, este id podría ser “semi1|semi2” en vez de concatenar 4 id. 
          // Pero mantendremos el mismo esquema:
          "psv-juventus|realmadrid-mancity|paris-brest|atalanta-clubbrugge" +
          "|" +
          "benfica-monaco|dortmund-sporting|bayern-celtic|inter-feyenoord",
        team1: { name: "Paris", score: 2, logo: "/logos/psg.png" },
        team2: { name: "Arsenal", score: 1, logo: "/logos/arsenal.png" },
        winner: 1,
      },
    ],
  },
];

export default function App() {
  return (
    <div className="tournament-container">
      <h2 className="tournament-title">Campeones de la UEFA 2024/25</h2>
      <TournamentTable rounds={rounds} width={1100} matchGap={80} />
    </div>
  );
}
