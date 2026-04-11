export interface Enfant {
  id: number;
  nom: string;
  date_naissance?: string;
  age?: number;
  genre: 'fille' | 'garcon';
  notes_medicales?: string;
  parent_id?: number;   // optionnel — assigné plus tard via "créer compte"
  classe_id?: number;
  classe_nom?: string;  // résolu côté frontend
}

export interface EnfantCreate {
  nom: string;
  date_naissance?: string;
  age?: number;
  genre: 'fille' | 'garcon';
  notes_medicales?: string;
  parent_id?: number;
  classe_id?: number;
}