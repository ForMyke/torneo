// src/components/TournamentList/index.tsx
import React, { useState, useEffect } from "react";
import { getTournaments, deleteTournament, Tournament } from "../../services/tournamentService";
import "./TournamentList.css";

interface TournamentListProps {
  onSelectTournament: (tournament: Tournament) => void;
  onCreateNew: () => void;
}

const TournamentList: React.FC<TournamentListProps> = ({ onSelectTournament, onCreateNew }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("TournamentList: Cargando torneos...");
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      console.log("TournamentList: Iniciando carga de torneos...");
      setLoading(true);
      const tournamentsData = await getTournaments();
      console.log("TournamentList: Torneos cargados:", tournamentsData);
      setTournaments(tournamentsData);
      setError(null);
    } catch (err) {
      console.error("TournamentList: Error al cargar torneos:", err);
      setError("Error al cargar los torneos. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este torneo?")) {
      return;
    }

    try {
      await deleteTournament(id);
      // Actualizar la lista después de eliminar
      setTournaments(tournaments.filter(t => t.id !== id));
    } catch (err) {
      setError("Error al eliminar el torneo. Por favor, inténtalo de nuevo.");
      console.error(err);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Fecha desconocida";
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return "Fecha inválida";
    }
  };

  console.log("TournamentList: Renderizando. Estado de carga:", loading);

  if (loading) {
    return <div className="tournament-list-loading">Cargando torneos...</div>;
  }

  return (
    <div className="tournament-list-container">
      <div className="tournament-list-header">
        <h2>Mis Torneos</h2>
        <button className="create-button" onClick={onCreateNew}>
          + Crear Nuevo Torneo
        </button>
      </div>

      {error && <div className="tournament-list-error">{error}</div>}

      {tournaments.length === 0 ? (
        <div className="tournament-list-empty">
          <p>No hay torneos creados.</p>
          <button className="create-button" onClick={onCreateNew}>
            Crear Primer Torneo
          </button>
        </div>
      ) : (
        <div className="tournament-list">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="tournament-card">
              <div className="tournament-card-content">
                <h3 className="tournament-card-title">{tournament.name}</h3>
                {tournament.description && (
                  <p className="tournament-card-description">{tournament.description}</p>
                )}
                <div className="tournament-card-details">
                  <span className="tournament-card-rounds">
                    {tournament.rounds?.length || 0} rondas
                  </span>
                  <span className="tournament-card-teams">
                    {tournament.rounds?.[0]?.matches?.length * 2 || 0} equipos
                  </span>
                  <span className="tournament-card-date">
                    Creado: {formatDate(tournament.createdAt)}
                  </span>
                </div>
                
                <div className="tournament-card-winner">
                  {tournament.rounds?.[tournament.rounds.length - 1]?.matches?.[0]?.winner ? (
                    <span>
                      Campeón: {
                        tournament.rounds[tournament.rounds.length - 1].matches[0].winner === 1
                          ? tournament.rounds[tournament.rounds.length - 1].matches[0].team1.name
                          : tournament.rounds[tournament.rounds.length - 1].matches[0].team2.name
                      }
                    </span>
                  ) : (
                    <span>Sin campeón definido</span>
                  )}
                </div>
              </div>
              
              <div className="tournament-card-actions">
                <button 
                  className="view-button"
                  onClick={() => onSelectTournament(tournament)}
                >
                  Ver Torneo
                </button>
                <button 
                  className="delete-button"
                  onClick={() => tournament.id && handleDelete(tournament.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TournamentList;