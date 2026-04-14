import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,forkJoin,of } from 'rxjs';
import { environment } from '../../environments/environments';
import { map, switchMap } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private enfantsBase = `${environment.apiUrl}/enfants`;
  private notifBase   = `${environment.apiUrl}/notifications`;
  private eventBase   = `${environment.apiUrl}/evenements`;
  private journalBase = `${environment.apiUrl}/journal`;

  getParentDashboard(): Observable<any> {
    return forkJoin({
      enfants      : this.http.get<any[]>(`${this.enfantsBase}`),
      notifications: this.http.get<any[]>(`${this.notifBase}`),
      evenements   : this.http.get<any[]>(`${this.eventBase}`),
    }).pipe(
      switchMap(({ enfants, notifications, evenements }) => {

        // ← KEY FIX: if no enfants, skip forkJoin and return empty array directly
        const enfants$ = enfants.length === 0
          ? of([])
          : forkJoin(
              enfants.map((e: any) =>
                forkJoin({
                  journal: this.http.get<any[]>(`${this.journalBase}/enfant/${e.id}`),
                  classe  : e.classe_id
                           ? this.http.get<any>(`${environment.apiUrl}/classes/${e.classe_id}`)
                           : of(null),
                }).pipe(
                  map(({ journal, classe }) => ({ ...e, journal, classe }))
                )
              )
            );

        return enfants$.pipe(
          map((enfantsWithJournal: any[]) => ({
            parent_nom          : '',
            total_evenements    : evenements.length,
            total_notifications : notifications.filter((n: any) => !n.lu).length,
            enfants             : enfantsWithJournal.map((e: any) => ({
              id         : e.id,
              nom        : e.nom,
              genre      : e.genre,
              animatrice : e.classe?.animatrice_nom ?? '—',
              journal    : e.journal.map((j: any) => ({
                date       : j.date,
                appris     : j.cours    ?? '',
                activite   : j.activite ?? '',
                evaluation : this.formatEval(j.evaluation),
                humeur     : j.humeur,
                note       : j.note     ?? '',
              }))
            })),
            notifications: notifications.slice(0, 4).map((n: any) => ({
              id           : n.id,
              message      : n.message,
              temps_relatif: this.timeAgo(n.date_envoi ?? n.created_at ?? n.date),
              type         : this.formatType(n.type ?? n.categorie ?? 'info'),
            }))
          }))
        );
      })
    );
  }

  private formatEval(val: string): string {
    return {
      'tres_bien'   : 'Très bien',
      'bien'        : 'Bien',
      'moyen'       : 'Moyen',
      'a_ameliorer' : 'À améliorer',
      'Très bien'   : 'Très bien',
      'Bien'        : 'Bien',
      'Moyen'       : 'Moyen',
      'À améliorer' : 'À améliorer',
    }[val] ?? val;
  }

  private formatType(val: string): string {
    return {
      'info'   : 'Info',
      'alerte' : 'Alerte',
      'nouveau': 'Nouveau',
      'Info'   : 'Info',
      'Alerte' : 'Alerte',
      'Nouveau': 'Nouveau',
    }[val] ?? 'Info';
  }

  private timeAgo(dateStr: string): string {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '—';
    const diff  = Date.now() - date.getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins  <  1) return 'À l\'instant';
    if (mins  < 60) return `Il y a ${mins}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days === 1) return 'Hier';
    return `Il y a ${days}j`;
  }
}