-- =============================================
-- Base de données
-- =============================================
CREATE DATABASE IF NOT EXISTS smartkids;
USE smartkids;

-- =============================================
-- Table users
-- =============================================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  mot_de_passe VARCHAR(255) NOT NULL,
  role ENUM('parent', 'animatrice', 'directrice') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Table classes
-- =============================================
CREATE TABLE classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  section ENUM('petite', 'moyenne', 'grande'),
  animatrice_id INT,
  FOREIGN KEY (animatrice_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- Table enfants
-- =============================================
CREATE TABLE enfants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  date_naissance DATE,
  age INT,
  genre ENUM('garcon', 'fille') NOT NULL,
  notes_medicales TEXT,
  parent_id INT NOT NULL,
  classe_id INT,
  FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (classe_id) REFERENCES classes(id) ON DELETE SET NULL
);

-- =============================================
-- Table evenements
-- =============================================
CREATE TABLE evenements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(200) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  heure_debut TIME,
  heure_fin TIME,
  lieu VARCHAR(200),
  statut ENUM('a_venir', 'en_cours', 'termine') DEFAULT 'a_venir',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Table notifications
-- =============================================
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  message VARCHAR(500) NOT NULL,
  type ENUM('info', 'alerte', 'nouveau') DEFAULT 'info',
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- Table journal (une seule table)
-- =============================================
CREATE TABLE journal (
  id INT AUTO_INCREMENT PRIMARY KEY,
  classe_id INT NOT NULL,
  enfant_id INT NOT NULL,
  date DATE NOT NULL,
  cours VARCHAR(200),
  activite VARCHAR(200),
  evaluation ENUM('tres_bien', 'bien', 'moyen') NULL,
  humeur ENUM('heureux', 'neutre', 'triste', 'malade') NULL,
  note TEXT,
  absent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (classe_id, enfant_id, date),
  FOREIGN KEY (classe_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (enfant_id) REFERENCES enfants(id) ON DELETE CASCADE
);

-- =============================================
-- Données d'exemple
-- =============================================

-- Utilisateurs
INSERT INTO users (nom, email, mot_de_passe, role) VALUES
('Mme Directrice', 'directrice@smartkids.com', SHA2('admin123', 256), 'directrice'),
('Mme Fatima', 'fatima@smartkids.com', SHA2('anim123', 256), 'animatrice'),
('Mme Benali', 'benali@email.com', SHA2('parent123', 256), 'parent'),
('M. Mourad', 'mourad@email.com', SHA2('parent123', 256), 'parent'),
('M. Khaled', 'khaled@email.com', SHA2('parent123', 256), 'parent');

-- Classes
INSERT INTO classes (nom, section, animatrice_id) VALUES
('Les Papillons', 'petite', 2),
('Les Petits Lions', 'moyenne', 2);

-- Enfants
INSERT INTO enfants (nom, date_naissance, age, genre, notes_medicales, parent_id, classe_id) VALUES
('Lina Benali', '2023-03-15', 3, 'fille', 'Allergie aux arachides', 3, 1),
('Adam Benali', '2021-08-22', 5, 'garcon', '', 3, 1),
('Sara Mourad', '2022-01-10', 4, 'fille', 'Asthme léger', 4, 2),
('Youssef Khaled', '2023-06-05', 3, 'garcon', '', 5, 1);

-- Événements
INSERT INTO evenements (titre, description, date, heure_debut, heure_fin, lieu, statut) VALUES
('Fête du printemps', 'Activités en plein air pour les enfants', '2026-03-15', '09:00', '12:00', 'Jardin de la crèche', 'a_venir'),
('Réunion parents', 'Rencontre avec l\'équipe pédagogique', '2026-03-20', '18:00', '19:30', 'Salle polyvalente', 'a_venir'),
('Journée sportive', 'Activités motrices et jeux collectifs', '2026-03-28', '10:00', '15:00', 'Gymnase', 'a_venir');

-- Notifications
INSERT INTO notifications (message, type, user_id) VALUES
('Réunion parents-enseignants le 28 février', 'info', NULL),
('Lina a été absente aujourd\'hui', 'alerte', 3),
('Nouvelle activité peinture ajoutée', 'nouveau', NULL),
('Photos de la sortie disponibles', 'info', 3),
('Rappel : vaccins à jour', 'alerte', 3);

-- Journal
INSERT INTO journal (classe_id, enfant_id, date, cours, activite, evaluation, humeur, note, absent) VALUES
(1, 1, '2026-02-10', 'Alphabet: lettres M/N + comptage 1-10', 'Dessin: animaux', 'tres_bien', 'heureux', 'Calme et attentif.', 0),
(1, 2, '2026-02-10', 'Alphabet: lettres M/N + comptage 1-10', 'Dessin: animaux', 'bien', 'heureux', 'Très participatif.', 0),
(1, 1, '2026-02-09', 'Formes: carré/triangle/cercle', 'Jeu de construction', 'bien', 'heureux', 'Bonne participation.', 0),
(2, 3, '2026-02-08', 'Chanson: couleurs', 'Atelier pâte à modeler', NULL, NULL, NULL, 1), -- Sara absente
(1, 4, '2026-02-10', 'Alphabet: lettres M/N + comptage 1-10', 'Dessin: animaux', 'moyen', 'neutre', 'Un peu fatigué.', 0);