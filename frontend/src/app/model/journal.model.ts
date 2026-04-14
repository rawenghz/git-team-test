export interface JournalOut {
  id: number;
  enfant_id: number;
  classe_id: number;
  date: string;
  cours: string;
  activite: string;
  absent: boolean;
  evaluation: string;
  humeur: string;
  note: string;
}

export interface JournalCreate {
  enfant_id: number;
  classe_id: number;
  date: string;
  cours: string;
  activite: string;
  absent: boolean;
  evaluation: string;
  humeur: string;
  note: string;
}

export interface JournalUpdate {
  cours?: string;
  activite?: string;
  absent?: boolean;
  evaluation?: string;
  humeur?: string;
  note?: string;
}

export interface Enfant {
  id: number;
  nom: string;
  prenom: string;
classe_id: number;
}