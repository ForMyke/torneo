// src/components/TournamentForm/TeamEditor.tsx
import React from "react";
import { type Team } from "../TournamentTable/types";

interface TeamEditorProps {
  team: Team;
  index: number;
  onChange: (index: number, team: Team) => void;
}

const TeamEditor: React.FC<TeamEditorProps> = ({ team, index, onChange }) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(index, {
      ...team,
      name: e.target.value
    });
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const score = parseInt(e.target.value) || 0;
    onChange(index, {
      ...team,
      score: score
    });
  };

  return (
    <div className="team-editor">
      <div className="team-number">{index + 1}</div>
      <div className="team-inputs">
        <input
          type="text"
          value={team.name}
          onChange={handleNameChange}
          placeholder="Nombre del equipo"
          className="team-name-input"
        />
        <input
          type="number"
          value={team.score !== undefined ? team.score : ""}
          onChange={handleScoreChange}
          placeholder="Puntaje inicial"
          className="team-score-input"
          min="0"
        />
      </div>
    </div>
  );
};

export default TeamEditor;