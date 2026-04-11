export interface Enfant {
  id: number;
  nom_complet: string;
  age: number;
  genre: 'Fille' | 'Garçon';
  date_naissance: string;
  classe_nom: string;
  notesMedicales?: string;
}