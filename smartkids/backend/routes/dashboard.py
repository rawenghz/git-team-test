from sqlalchemy import text
from database import engine
from fastapi import APIRouter

router = APIRouter()

def _build_dashboard():

    with engine.connect() as conn:

        nb_users    = conn.execute(text("SELECT COUNT(*) FROM users")).scalar()
        nb_notifs   = conn.execute(text("SELECT COUNT(*) FROM notifications")).scalar()
        nb_events   = conn.execute(text("SELECT COUNT(*) FROM evenements")).scalar()
        nb_enfants  = conn.execute(text("SELECT COUNT(*) FROM enfants")).scalar()

                # Taux d'absence global
        taux_absence = conn.execute(text("""
            SELECT
                SUM(absent)                          AS total_absences,
                COUNT(DISTINCT date)                 AS total_jours,
                COUNT(*)                             AS total_lignes,
                ROUND(
                    CASE
                        WHEN COUNT(*) = 0 THEN 0
                        ELSE SUM(absent) * 100.0 / COUNT(*)
                    END, 2
                ) AS taux_pourcentage
            FROM journal
        """)).mappings().one()

        # Taux d'absence par enfant
        taux_par_enfant = conn.execute(text("""
            SELECT
                e.id                                        AS enfant_id,
                e.nom,
                COUNT(j.id)                                 AS total_jours,
                SUM(j.absent)                               AS total_absences,
                ROUND(
                    CASE
                        WHEN COUNT(j.id) = 0 THEN 0
                        ELSE SUM(j.absent) * 100.0 / COUNT(j.id)
                    END, 2
                )                                           AS taux_pourcentage
            FROM enfants e
            LEFT JOIN journal j ON j.enfant_id = e.id
            GROUP BY e.id, e.nom
            ORDER BY taux_pourcentage DESC
        """)).mappings().all()

        users = conn.execute(text("""
            SELECT id, nom, email, role
            FROM users
            ORDER BY id DESC
            LIMIT 5
        """)).mappings().all()

        notifs = conn.execute(text("""
            SELECT id, message, type, created_at
            FROM notifications
            ORDER BY created_at DESC
            LIMIT 5
        """)).mappings().all()

    return {
        "nb_enfants":        nb_enfants,
        "nb_utilisateurs":   nb_users,
        "nb_evenements":     nb_events,
        "nb_notifications":  nb_notifs,
        "taux_absence": {
            "total_absences":        taux_absence["total_absences"]        or 0,
            "total_jours":    taux_absence["total_jours"]    or 0,
            "taux_pourcentage":      taux_absence["taux_pourcentage"]      or 0.0
        },
        "taux_absence_par_enfant": [dict(e) for e in taux_par_enfant],
        "derniers_utilisateurs":  [dict(u) for u in users],
        "notifications_recentes": [dict(n) for n in notifs]
    }

@router.get("/dashboard")
def dashboard():
    return _build_dashboard()

@router.get("/")
def dashboard_root():
    return _build_dashboard()
