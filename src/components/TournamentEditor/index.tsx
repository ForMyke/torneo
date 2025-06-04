// src/components/TournamentEditor/index.tsx
import React, { useState } from "react";
import TournamentForm from "../TournamentForm";
import { createTournament, updateTournament, Tournament } from "../../services/tournamentService";
import { Round } from "../TournamentTable/types";
import "./TournamentEditor.css";

interface TournamentEditorProps {
  tournament?: Tournament;
  onSave: (tournament: Tournament) => void;
  onCancel: () => void;
}

const TournamentEditor: React.FC<TournamentEditorProps> = ({
  tournament,
  onSave,
  onCancel
}) => {
  const [name, setName] = useState<string>(tournament?.name || "");
  const [description, setDescription] = useState<string>(tournament?.description || "");
  const [rounds, setRounds] = useState<Round[]>(tournament?.rounds || []);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateTournament = (tournamentRounds: Round[]) => {
    setRounds(tournamentRounds);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Por favor, ingresa un nombre para el torneo");
      return;
    }
    
    if (rounds.length === 0) {
      setError("Debes crear un torneo con al menos una ronda");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const tournamentData: Tournament = {
        id: tournament?.id,
        name,
        description: description.trim() ? description : undefined,
        rounds
      };
      
      if (tournament?.id) {
        // Actualizar torneo existente
        await updateTournament(tournament.id, tournamentData);
        tournamentData.createdAt = tournament.createdAt;
        tournamentData.updatedAt = new Date();
      } else {
        // Crear nuevo torneo
        const newId = await createTournament(tournamentData);
        tournamentData.id = newId;
      }
      
      onSave(tournamentData);
    } catch (err) {
      console.error("Error al guardar el torneo:", err);
      setError("Ocurrió un error al guardar el torneo. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tournament-editor">
      <div className="tournament-editor-header">
        <h2>{tournament ? "Editar Torneo" : "Crear Nuevo Torneo"}</h2>
        <button className="close-button" onClick={onCancel}>
          ✕
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="tournament-name">Nombre del Torneo *</label>
          <input
            id="tournament-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Copa Mundial 2024"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="tournament-description">Descripción (opcional)</label>
          <textarea
            id="tournament-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe brevemente el torneo"
            rows={3}
          />
        </div>
        
        <div className="tournament-structure">
          <h3>Estructura del Torneo</h3>
          
          <TournamentForm
            onCreateTournament={handleCreateTournament}
            initialRounds={tournament?.rounds}
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            className="save-button"
            disabled={isSubmitting || rounds.length === 0}
          >
            {isSubmitting
              ? "Guardando..."
              : tournament
                ? "Actualizar Torneo"
                : "Crear Torneo"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TournamentEditor;