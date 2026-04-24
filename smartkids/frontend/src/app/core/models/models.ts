// ── User ──────────────────────────────────────────
export type Role = 'parent' | 'animatrice' | 'directrice';

export interface User {
  id: number;
  nom: string;
  email: string;
  role: Role;
  created_at?: string;
}

export interface Animatrice {
  id: number;
  nom: string;
}

export interface LoginRequest {
  email: string;
  mot_de_passe: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  role: string;
  nom: string;
  user_id: number;
}

// ── Enfant ────────────────────────────────────────
export type Genre = 'garcon' | 'fille';

export interface Enfant {
  id: number;
  nom: string;
  date_naissance: string;
  age: number;
  genre: Genre;
  notes_medicales?: string;
  parent_id: number;
  classe_id?: number;
  classe?: Classe;
  allergies?: string;
  contact_urgence?: string;
  notes_sup?: string;
  _open?: boolean;
}

// ── Classe ────────────────────────────────────────
export type Section = 'petite' | 'moyenne' | 'grande';

export interface Classe {
  id: number;
  nom: string;
  section: string;
  animatrice_id: number | null;
  animatrice_nom?: string;
}

export interface ClasseForm {
  nom: string;
  section: string;
  animatrice_id: number | null;
}

// ── Événement ─────────────────────────────────────
export type StatutEvenement = 'a_venir' | 'en_cours' | 'termine';

export interface Evenement {
  id: number;
  titre: string;
  description?: string;
  date: string;
  heure_debut?: string;
  heure_fin?: string;
  lieu?: string;
  statut: StatutEvenement;
  created_at?: string;
}

// ── Notification ──────────────────────────────────
export type TypeNotification = 'info' | 'alerte' | 'nouveau';

export interface Notification {
  id: number;
  message: string;
  type: TypeNotification;
  lu?: boolean;
  user_id?: number;
  date_envoi?: string;
  created_at?: string;
}

export type DestinataireNotif = 'directrice' | 'animatrice' | 'tous';

export interface NotificationEnvoi {
  message: string;
  type: TypeNotification;
  destinataire: DestinataireNotif;
}

// ── Journal ───────────────────────────────────────
export type Evaluation = 'tres_bien' | 'bien' | 'moyen' | 'a_ameliorer';
export type Humeur     = 'heureux' | 'neutre' | 'triste' | 'malade';

export interface JournalEntry {
  id: number;
  classe_id: number;
  enfant_id: number;
  date: string;
  cours?: string;
  activite?: string;
  evaluation?: Evaluation;
  humeur?: Humeur;
  note?: string;
  absent: boolean;
  created_at?: string;
}

// ── Dashboard ─────────────────────────────────────
export interface DashboardParent {
  parent_nom: string;
  total_evenements: number;
  total_notifications: number;
  enfants: EnfantDashboard[];
  notifications: NotifItem[];
}

export interface EnfantDashboard {
  id: number;
  nom: string;
  genre: Genre;
  animatrice: string;
  journal: JournalEntryDashboard[];
}

export interface JournalEntryDashboard {
  date: string;
  appris: string;
  activite: string;
  evaluation: string;
  humeur: string;
  note?: string;
}

export interface NotifItem {
  id: number;
  message: string;
  temps_relatif: string;
  type: 'Info' | 'Alerte' | 'Nouveau';
}
// ── EnfantCreate (pour création/modification) ──────
export interface EnfantCreate {
  nom: string;
  age?: number;
  genre: Genre;
  date_naissance?: string;
  notes_medicales?: string;
  classe_id?: number;
  
}








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
