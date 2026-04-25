import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChatbotWidgetComponent } from '../../shared/components/chatbot-widget/chatbot-widget';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ChatbotWidgetComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {

  services = [
    { icon: 'bi-book',         title: 'Programme éducatif',  desc: 'Un programme riche adapté à chaque tranche d\'âge.' },
    { icon: 'bi-palette',      title: 'Activités créatives',  desc: 'Arts plastiques, musique et expression corporelle.' },
    { icon: 'bi-shield-check', title: 'Environnement sûr',    desc: 'Sécurité et bien-être de chaque enfant garantis.' },
    { icon: 'bi-heart',        title: 'Suivi personnalisé',   desc: 'Journal quotidien et communication avec les parents.' },
    { icon: 'bi-people',       title: 'Équipe qualifiée',     desc: 'Animatrices diplômées et passionnées.' },
    { icon: 'bi-star',         title: 'Épanouissement',       desc: 'Développement social, cognitif et moteur.' },
  ];

  infos = [
    { icon: 'bi-clock',     label: 'Horaires',   value: 'Lun – Ven · 7h30 – 17h30' },
    { icon: 'bi-geo-alt',   label: 'Adresse',    value: '12 Rue des Enfants, Alger' },
    { icon: 'bi-telephone', label: 'Téléphone',  value: '01 23 45 67 89' },
  ];
}