from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from dependencies import get_db, get_current_user
from models.participation import EventParticipation, StatusEnum
from models.user import User
from models.evenement import Evenement
from schemas.participation import ParticipationUpdate, ParticipationOut, EventStatsOut

router = APIRouter()

# ✅ Voter : participer ou décliner
@router.post("/{event_id}/participer", response_model=ParticipationOut)
def voter(
    event_id: int,
    data: ParticipationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    evenement = db.query(Evenement).filter(Evenement.id == event_id).first()
    if not evenement:
        raise HTTPException(status_code=404, detail="Événement introuvable")

    participation = db.query(EventParticipation).filter(
        EventParticipation.event_id == event_id,
        EventParticipation.user_id == current_user.id
    ).first()

    if participation:
        participation.status = data.status
    else:
        participation = EventParticipation(
            event_id=event_id,
            user_id=current_user.id,
            status=data.status
        )
        db.add(participation)

    db.commit()
    db.refresh(participation)
    return participation

# ✅ Stats pour la directrice (voir détails)
@router.get("/{event_id}/stats", response_model=EventStatsOut)
def get_stats(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from sqlalchemy.orm import joinedload

    participations = db.query(EventParticipation).options(
        joinedload(EventParticipation.user)
    ).filter(EventParticipation.event_id == event_id).all()

    # Récupérer tous les users sauf directrice pour le total
    total_invites = db.query(User).filter(User.role != "directrice").count()

    nb_participe = [p for p in participations if p.status == StatusEnum.participe]
    nb_decline = [p for p in participations if p.status == StatusEnum.decline]
    nb_en_attente = total_invites - len(nb_participe) - len(nb_decline)

    taux_participation = (len(nb_participe) / total_invites * 100) if total_invites > 0 else 0
    taux_reponse = ((len(nb_participe) + len(nb_decline)) / total_invites * 100) if total_invites > 0 else 0

    mon_status = next(
        (p.status for p in participations if p.user_id == current_user.id), None
    )

    return EventStatsOut(
        total_invites=total_invites,
        nb_participe=len(nb_participe),
        nb_decline=len(nb_decline),
        nb_en_attente=nb_en_attente,
        taux_participation=round(taux_participation, 1),
        taux_reponse=round(taux_reponse, 1),          # ← nouveau champ
        participants=[p.user for p in nb_participe],
        declines=[p.user for p in nb_decline],
        en_attente=[],
        mon_status=mon_status
    )

# ✅ Mon statut sur un événement (pour afficher le bon bouton actif)
@router.get("/{event_id}/mon-statut")
def mon_statut(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    participation = db.query(EventParticipation).filter(
        EventParticipation.event_id == event_id,
        EventParticipation.user_id == current_user.id
    ).first()

    return {"status": participation.status if participation else "en_attente"}