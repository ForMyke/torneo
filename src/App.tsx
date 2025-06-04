// src/App.tsx
import { useState, useEffect } from "react";
import TournamentTable from "./components/TournamentTable";
import { generateTournament } from "./mockGenerator";
import "./App.css";

export default function App() {
  const [rounds, setRounds] = useState(generateTournament(5));
  const [isLoading, setIsLoading] = useState(true);

  // Simulamos una carga breve
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app-container">
      {/* Eliminamos el encabezado */}
      <main className="app-content">
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Cargando torneo...</p>
          </div>
        ) : (
          <div className="tournament-container">
            <TournamentTable 
              rounds={rounds} 
              width={2400}    // Ancho extra para mayor separación horizontal
              matchGap={65}   // Espaciado vertical aumentado significativamente
            />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>© 2025 Gestor de Torneos</p>
      </footer>
    </div>
  );
}
