// src/components/TournamentForm/MatchEditor.tsx
import React, { useState } from "react";
import { type Match, type Team } from "../TournamentTable/types";

interface MatchEditorProps {
  match: Match;
  index: number;
  onChange: (match: Match) => void;
}

const MatchEditor: React.FC<MatchEditorProps> = ({ match, index, onChange }) => {
  const [team1Score, setTeam1Score] = useState<number>(match.team1.score || 0);
  const [team2Score, setTeam2Score] = useState<number>(match.team2.score || 0);

  const updateTeam1Score = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScore = parseInt(e.target.value) || 0;
    setTeam1Score(newScore);
    
    const updatedTeam1: Team = {
      ...match.team1,
      score: newScore
    };
    
    // Determinar ganador automáticamente si los puntajes son diferentes
    let winner = match.winner;
    if (newScore > team2Score) {
      winner = 1;
    } else if (newScore < team2Score) {
      winner = 2;
    } else {
      winner = 0; // Empate
    }
    
    onChange({
      ...match,
      team1: updatedTeam1,
      winner
    });
  };

  const updateTeam2Score = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScore = parseInt(e.target.value) || 0;
    setTeam2Score(newScore);
    
    const updatedTeam2: Team = {
      ...match.team2,
      score: newScore
    };
    
    // Determinar ganador automáticamente si los puntajes son diferentes
    let winner = match.winner;
    if (team1Score > newScore) {
      winner = 1;
    } else if (team1Score < newScore) {
      winner = 2;
    } else {
      winner = 0; // Empate
    }
    
    onChange({
      ...match,
      team2: updatedTeam2,
      winner
    });
  };

  const setWinner = (winner: 1 | 2 | 0) => {
    onChange({
      ...match,
      winner
    });
  };

  const isPredefined = match.team1.name === "Por definir" || match.team2.name === "Por definir";

  return (
    <div className="match-editor">
      <div className="match-number">Partido {index + 1}</div>
      
      {!isPredefined ? (
        <>
          <div className="match-teams">
            <div className={`team-info ${match.winner === 1 ? 'winner' : ''}`}>
              <div className="team-name">{match.team1.name}</div>
              <input
                type="number"
                value={team1Score}
                onChange={updateTeam1Score}
                className="score-input"
                min="0"
              />
            </div>
            
            <div className="vs">VS</div>
            
            <div className={`team-info ${match.winner === 2 ? 'winner' : ''}`}>
              <div className="team-name">{match.team2.name}</div>
              <input
                type="number"
                value={team2Score}
                onChange={updateTeam2Score}
                className="score-input"
                min="0"
              />
            </div>
          </div>
          
          <div className="winner-selection">
            <button 
              className={`winner-button ${match.winner === 1 ? 'selected' : ''}`}
              onClick={() => setWinner(1)}
            >
              {match.team1.name} Ganador
            </button>
            
            <button 
              className={`winner-button ${match.winner === 2 ? 'selected' : ''}`}
              onClick={() => setWinner(2)}
            >
              {match.team2.name} Ganador
            </button>
          </div>
        </>
      ) : (
        <div className="pending-match">
          Partido pendiente de definir
        </div>
      )}
    </div>
  );
};

export default MatchEditor;