// src/components/TournamentTable/types.ts
export interface Team {
    name: string;
    score: number;
    logo?: string;
  }
  
  export interface Match {
    id: string;
    team1: Team;
    team2: Team;
    winner: 1 | 2;
  }
  
  export interface Round {
    name: string;
    matches: Match[];
  }
  
  export interface Props {
    rounds: Round[];
    width?: number;
    matchGap?: number;
  }
  