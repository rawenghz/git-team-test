from sqlalchemy import text
from database import engine
from fastapi import APIRouter

router = APIRouter()

def _build_dashboard():

    with engine.connect() as conn:

        nb_users = conn.execute(text("SELECT COUNT(*) FROM users")).scalar()
        nb_notifs = conn.execute(text("SELECT COUNT(*) FROM notifications")).scalar()
        nb_events = conn.execute(text("SELECT COUNT(*) FROM evenements")).scalar()
        nb_enfants = conn.execute(text("SELECT COUNT(*) FROM enfants")).scalar()

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
        "nb_enfants": nb_enfants,
        "nb_utilisateurs": nb_users,
        "nb_evenements": nb_events,
        "nb_notifications": nb_notifs,
        "derniers_utilisateurs": users,
        "notifications_recentes": notifs
    }

@router.get("/dashboard")
def dashboard():
    return _build_dashboard()

@router.get("/")
def dashboard_root():
    return _build_dashboard()