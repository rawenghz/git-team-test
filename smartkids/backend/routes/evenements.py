# ============================================
# routes/evenements.py — Gestion des événements (Personne 4)
# ============================================

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from dependencies import get_db, get_current_user, require_role
from models.evenement import Evenement
from models.user import User
from schemas.evenement import EvenementCreate, EvenementUpdate, EvenementOut

router = APIRouter()


@router.get("/", response_model=List[EvenementOut])
def get_evenements(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    return db.query(Evenement).order_by(Evenement.date.asc()).all()


@router.get("/{evenement_id}", response_model=EvenementOut)
def get_evenement(evenement_id: int,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    event = db.query(Evenement).filter(Evenement.id == evenement_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Événement introuvable")
    return event


@router.post("/", response_model=EvenementOut, status_code=status.HTTP_201_CREATED)
def create_evenement(data: EvenementCreate,db: Session = Depends(get_db),current_user: User = Depends(require_role("directrice"))):
    new_event = Evenement(**data.model_dump())
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event


@router.put("/{evenement_id}", response_model=EvenementOut)
def update_evenement(evenement_id: int,data: EvenementUpdate,db: Session = Depends(get_db),current_user: User = Depends(require_role("directrice"))):
    event = db.query(Evenement).filter(Evenement.id == evenement_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Événement introuvable")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(event, field, value)

    db.commit()
    db.refresh(event)
    return event

@router.delete("/{evenement_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_evenement(evenement_id: int,db: Session = Depends(get_db),current_user: User = Depends(require_role("directrice"))):
    event = db.query(Evenement).filter(Evenement.id == evenement_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Événement introuvable")

    db.delete(event)
    db.commit()
