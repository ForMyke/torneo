// src/App.tsx
// import React from "react";
import TournamentTable, { type Round } from "./components/TournamentTable";
import { generateTournament } from "./mockGenerator";
import "./App.css";

const rounds: Round[] = generateTournament(5);

export default function App() {
  return (
    <div className="tournament-container">
      <TournamentTable rounds={rounds} width={5000} matchGap={20} />
    </div>
  );
}
