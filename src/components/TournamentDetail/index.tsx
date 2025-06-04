// src/components/TournamentDetail/index.tsx
import React from "react";
import TournamentTable from "../TournamentTable";
import { Tournament } from "../../services/tournamentService";
import "./TournamentDetail.css";

interface TournamentDetailProps {
  tournament: Tournament;
  onBack: () => void;
  onEdit: (tournament: Tournament) => void;
}

const TournamentDetail: React.FC<TournamentDetailProps> = ({ 
  tournament, 
  onBack,
  onEdit 
}) => {
  // Determinar el campeón si existe
  const finalRound = tournament.rounds[tournament.rounds.length - 1];
  const finalMatch = finalRound?.matches[0];
  const champion = finalMatch?.winner === 1 
    ? finalMatch.team1.name 
    : finalMatch?.winner === 2 
      ? finalMatch.team2.name 
      : null;

  // Obtener todos los equipos desde la primera ronda
  const allTeams = tournament.rounds[0].matches.flatMap(match => [
    match.team1.name,
    match.team2.name
  ]);

  return (
    <div className="tournament-detail">
      <div className="tournament-detail-header">
        <button className="back-button" onClick={onBack}>
          ← Volver a la lista
        </button>
        <h2>{tournament.name}</h2>
        <button className="edit-button" onClick={() => onEdit(tournament)}>
          Editar Torneo
        </button>
      </div>
      
      {tournament.description && (
        <div className="tournament-description">
          <p>{tournament.description}</p>
        </div>
      )}
      
      <div className="tournament-stats">
        <div className="stat-card">
          <span className="stat-value">{allTeams.length}</span>
          <span className="stat-label">Equipos</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{tournament.rounds.length}</span>
          <span className="stat-label">Rondas</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{champion || "Pendiente"}</span>
          <span className="stat-label">Campeón</span>
        </div>
      </div>
      
      <div className="tournament-table-container">
        <TournamentTable 
          rounds={tournament.rounds} 
          width={5000} 
          matchGap={20} 
        />
      </div>
      
      <div className="tournament-teams">
        <h3>Equipos Participantes</h3>
        <div className="teams-grid">
          {allTeams.map((teamName, index) => (
            <div key={index} className="team-item">
              <div className="team-number">{index + 1}</div>
              <div className="team-name">{teamName}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TournamentDetail;