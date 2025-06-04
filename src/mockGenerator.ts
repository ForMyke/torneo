import type { Round, Match, Team } from './components/TournamentTable/types';

function generateTeamName(index: number): string {
  // Nombres genéricos para participantes
  return `Participante ${index + 1}`;
}

function createTeam(index: number): Team {
  return {
    name: generateTeamName(index),
    score: Math.floor(Math.random() * 5),
    logo: "/src/res/gamblerPlayer.png"
  };
}

function createInitialRound(numTeams: number): Round {
  const matches: Match[] = [];
  
  for (let i = 0; i < numTeams / 2; i++) {
    matches.push({
      id: `match${i + 1}`,
      team1: createTeam(i * 2),
      team2: createTeam(i * 2 + 1),
      winner: Math.random() > 0.5 ? 1 : 2
    });
  }

  return {
    name: `Ronda de ${numTeams}`,
    matches
  };
}

function createNextRound(previousRound: Round, roundIndex: number): Round {
  const matches: Match[] = [];
  const previousMatches = previousRound.matches;

  for (let i = 0; i < previousMatches.length / 2; i++) {
    const match1 = previousMatches[i * 2];
    const match2 = previousMatches[i * 2 + 1];
    
    const team1 = match1.winner === 1 ? match1.team1 : match1.team2;
    const team2 = match2.winner === 1 ? match2.team1 : match2.team2;
    
    matches.push({
      id: `${match1.id}|${match2.id}`,
      team1: { ...team1, score: Math.floor(Math.random() * 5) },
      team2: { ...team2, score: Math.floor(Math.random() * 5) },
      winner: Math.random() > 0.5 ? 1 : 2
    });
  }

  let roundName = `Ronda ${roundIndex + 1}`;
  if (matches.length === 1) roundName = "Final";
  else if (matches.length === 2) roundName = "Semifinales";
  else if (matches.length === 4) roundName = "Cuartos de Final";
  else if (matches.length === 8) roundName = "Octavos de Final";
  else if (matches.length === 16) roundName = "16vos de Final";

  return {
    name: roundName,
    matches
  };
}

export function generateTournament(numRounds: number): Round[] {
  const numTeams = Math.pow(2, numRounds);
  const rounds: Round[] = [];
  
  // Create initial round
  rounds.push(createInitialRound(numTeams));
  
  // Create subsequent rounds
  for (let i = 1; i < numRounds; i++) {
    rounds.push(createNextRound(rounds[i - 1], i));
  }
  
  return rounds;
} 