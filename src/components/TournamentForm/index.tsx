// src/components/TournamentForm/index.tsx
import React, { useState, useEffect } from "react";
import "./TournamentForm.css";
import { type Team, type Match, type Round } from "../TournamentTable/types";
import { generateTournament } from "../../mockGenerator";
import TeamEditor from "./TeamEditor";
import MatchEditor from "./MatchEditor";

interface TournamentFormProps {
  onCreateTournament: (rounds: Round[]) => void;
  initialRounds?: Round[];
}

const TournamentForm: React.FC<TournamentFormProps> = ({
  onCreateTournament,
  initialRounds
}) => {
  const [teamCount, setTeamCount] = useState<number>(initialRounds ? Math.pow(2, initialRounds.length) : 8);
  const [teams, setTeams] = useState<Team[]>([]);
  const [rounds, setRounds] = useState<Round[]>(initialRounds || []);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [step, setStep] = useState<"teams" | "matches" | "review">("teams");

  // Inicializar equipos basados en el recuento o los datos iniciales
  useEffect(() => {
    if (initialRounds && initialRounds.length > 0) {
      // Extraer equipos de las rondas iniciales
      const extractedTeams: Team[] = initialRounds[0].matches.flatMap(match => [match.team1, match.team2]);
      setTeams(extractedTeams);
    } else {
      // Crear equipos iniciales
      const newTeams: Team[] = [];
      for (let i = 0; i < teamCount; i++) {
        newTeams.push({
          name: `Equipo ${i + 1}`,
          score: 0,
          logo: "/src/res/gamblerPlayer.png"
        });
      }
      setTeams(newTeams);
    }
  }, [teamCount, initialRounds]);

  // Generar torneo basado en los equipos actuales
  const generateInitialTournament = () => {
    if (teams.length < 2 || teams.length % 2 !== 0) {
      alert("El número de equipos debe ser par y al menos 2");
      return;
    }

    // Crear la primera ronda de partidos
    const firstRoundMatches: Match[] = [];
    for (let i = 0; i < teams.length / 2; i++) {
      firstRoundMatches.push({
        id: `match${i + 1}`,
        team1: teams[i * 2],
        team2: teams[i * 2 + 1],
        winner: 0 // Sin ganador todavía
      });
    }

    const firstRound: Round = {
      name: `Ronda de ${teams.length}`,
      matches: firstRoundMatches
    };

    const numRounds = Math.log2(teams.length);
    const emptyRounds: Round[] = [firstRound];

    // Crear rondas subsiguientes vacías
    for (let i = 1; i < numRounds; i++) {
      const matchCount = Math.pow(2, numRounds - i - 1);
      const matches: Match[] = [];
      
      for (let j = 0; j < matchCount; j++) {
        matches.push({
          id: `round${i}_match${j + 1}`,
          team1: { name: "Por definir", score: 0 },
          team2: { name: "Por definir", score: 0 },
          winner: 0
        });
      }

      let roundName = `Ronda ${i + 1}`;
      if (matchCount === 1) roundName = "Final";
      else if (matchCount === 2) roundName = "Semifinales";
      else if (matchCount === 4) roundName = "Cuartos de Final";
      else if (matchCount === 8) roundName = "Octavos de Final";
      else if (matchCount === 16) roundName = "Dieciseisavos";

      emptyRounds.push({
        name: roundName,
        matches
      });
    }

    setRounds(emptyRounds);
    setStep("matches");
  };

  // Actualizar un equipo
  const updateTeam = (index: number, updatedTeam: Team) => {
    const newTeams = [...teams];
    newTeams[index] = updatedTeam;
    setTeams(newTeams);
  };

  // Actualizar un partido
  const updateMatch = (roundIndex: number, matchIndex: number, updatedMatch: Match) => {
    const newRounds = [...rounds];
    newRounds[roundIndex].matches[matchIndex] = updatedMatch;
    
    // Si hay un ganador y hay una siguiente ronda, actualizar el siguiente partido
    if (updatedMatch.winner > 0 && roundIndex < rounds.length - 1) {
      const nextRoundIndex = roundIndex + 1;
      const nextMatchIndex = Math.floor(matchIndex / 2);
      const nextMatch = newRounds[nextRoundIndex].matches[nextMatchIndex];
      
      // Determinar si este partido corresponde al primer o segundo equipo del siguiente partido
      const isFirstTeam = matchIndex % 2 === 0;
      const winnerTeam = updatedMatch.winner === 1 ? updatedMatch.team1 : updatedMatch.team2;
      
      // Actualizar el equipo correspondiente en el siguiente partido
      if (isFirstTeam) {
        nextMatch.team1 = { ...winnerTeam, score: 0 };
      } else {
        nextMatch.team2 = { ...winnerTeam, score: 0 };
      }
      
      // Resetear el ganador si ambos equipos han cambiado
      if (nextMatch.team1.name !== "Por definir" && nextMatch.team2.name !== "Por definir") {
        nextMatch.winner = 0;
      }
      
      newRounds[nextRoundIndex].matches[nextMatchIndex] = nextMatch;
    }
    
    setRounds(newRounds);
  };

  // Cambiar a la siguiente ronda
  const nextRound = () => {
    // Verificar si todos los partidos de la ronda actual tienen ganador
    const allMatchesComplete = rounds[currentRound].matches.every(match => match.winner > 0);
    
    if (!allMatchesComplete) {
      alert("Todos los partidos de esta ronda deben tener un ganador definido");
      return;
    }
    
    if (currentRound < rounds.length - 1) {
      setCurrentRound(currentRound + 1);
    } else {
      setStep("review");
    }
  };

  // Cambiar a la ronda anterior
  const previousRound = () => {
    if (currentRound > 0) {
      setCurrentRound(currentRound - 1);
    } else {
      setStep("teams");
    }
  };

  // Finalizar y enviar el torneo
  const finalizeTournament = () => {
    onCreateTournament(rounds);
  };

  // Generar rápidamente un torneo aleatorio
  const generateRandomTournament = () => {
    const numRounds = Math.log2(teamCount);
    const randomRounds = generateTournament(numRounds);
    setRounds(randomRounds);
    setStep("review");
  };

  return (
    <div className="tournament-form">
      <h2>Creador de Torneos</h2>
      
      {step === "teams" && (
        <div className="form-step">
          <h3>Paso 1: Configurar Equipos</h3>
          
          <div className="form-group">
            <label htmlFor="teamCount">Número de Equipos (potencia de 2):</label>
            <select 
              id="teamCount" 
              value={teamCount} 
              onChange={(e) => setTeamCount(parseInt(e.target.value))}
            >
              <option value="4">4 equipos</option>
              <option value="8">8 equipos</option>
              <option value="16">16 equipos</option>
              <option value="32">32 equipos</option>
            </select>
          </div>
          
          <div className="teams-container">
            {teams.map((team, index) => (
              <TeamEditor 
                key={index} 
                team={team} 
                index={index} 
                onChange={updateTeam} 
              />
            ))}
          </div>
          
          <div className="button-group">
            <button 
              className="primary-button" 
              onClick={generateInitialTournament}
            >
              Continuar a Partidos
            </button>
            <button 
              className="secondary-button" 
              onClick={generateRandomTournament}
            >
              Generar Torneo Aleatorio
            </button>
          </div>
        </div>
      )}
      
      {step === "matches" && (
        <div className="form-step">
          <h3>Paso 2: {rounds[currentRound].name}</h3>
          
          <div className="matches-container">
            {rounds[currentRound].matches.map((match, index) => (
              <MatchEditor
                key={index}
                match={match}
                index={index}
                onChange={(updatedMatch) => updateMatch(currentRound, index, updatedMatch)}
              />
            ))}
          </div>
          
          <div className="button-group">
            <button 
              className="secondary-button" 
              onClick={previousRound}
            >
              Anterior
            </button>
            <button 
              className="primary-button" 
              onClick={nextRound}
            >
              {currentRound < rounds.length - 1 ? "Siguiente Ronda" : "Finalizar"}
            </button>
          </div>
        </div>
      )}
      
      {step === "review" && (
        <div className="form-step">
          <h3>Paso 3: Revisar y Finalizar</h3>
          
          <div className="review-summary">
            <p>Torneo con {teamCount} equipos y {rounds.length} rondas.</p>
            <p>Campeón: {
              rounds[rounds.length - 1].matches[0].winner === 1 
                ? rounds[rounds.length - 1].matches[0].team1.name 
                : rounds[rounds.length - 1].matches[0].winner === 2 
                  ? rounds[rounds.length - 1].matches[0].team2.name
                  : "Sin definir"
            }</p>
          </div>
          
          <div className="button-group">
            <button 
              className="secondary-button" 
              onClick={() => {
                setCurrentRound(rounds.length - 1);
                setStep("matches");
              }}
            >
              Editar Partidos
            </button>
            <button 
              className="primary-button" 
              onClick={finalizeTournament}
            >
              Crear Torneo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentForm;