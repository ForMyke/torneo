// src/services/tournamentService.ts
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, orderBy, serverTimestamp, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { app, db } from '../firebase';
import { Round } from '../components/TournamentTable/types';

// Referencia a la colección
const tournamentsCollection = collection(db, 'tournaments');

// Interfaz para el torneo guardado
export interface Tournament {
  id?: string;
  name: string;
  description?: string;
  rounds: Round[];
  createdAt?: any;
  updatedAt?: any;
}

// Crear un nuevo torneo
export const createTournament = async (tournament: Tournament): Promise<string> => {
  try {
    const docRef = await addDoc(tournamentsCollection, {
      ...tournament,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating tournament:', error);
    throw error;
  }
};

// Obtener todos los torneos
export const getTournaments = async (): Promise<Tournament[]> => {
  try {
    const q = query(tournamentsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data()
    } as Tournament));
  } catch (error) {
    console.error('Error getting tournaments:', error);
    // En caso de error, devolver un array vacío para evitar bloqueos
    return [];
  }
};

// Obtener un torneo por ID
export const getTournamentById = async (id: string): Promise<Tournament | null> => {
  try {
    const docRef = doc(db, 'tournaments', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Tournament;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting tournament:', error);
    throw error;
  }
};

// Actualizar un torneo
export const updateTournament = async (id: string, tournament: Partial<Tournament>): Promise<void> => {
  try {
    const docRef = doc(db, 'tournaments', id);
    await updateDoc(docRef, {
      ...tournament,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating tournament:', error);
    throw error;
  }
};

// Eliminar un torneo
export const deleteTournament = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'tournaments', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting tournament:', error);
    throw error;
  }
};
