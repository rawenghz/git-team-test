from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from dependencies import get_db, get_current_user, require_role
from models.journal import Journal
from models.enfant import Enfant
from models.classe import Classe
from models.user import User
from schemas.journal import JournalCreate, JournalUpdate, JournalOut

router = APIRouter()

@router.post("/", response_model=JournalOut, status_code=status.HTTP_201_CREATED)
def create_journal(data: JournalCreate,db: Session = Depends(get_db),current_user: User = Depends(require_role("animatrice", "directrice"))):
    # Vérifier qu'une entrée n'existe pas déjà pour ce triplet
    existing = db.query(Journal).filter(
        Journal.classe_id == data.classe_id,
        Journal.enfant_id == data.enfant_id,
        Journal.date == data.date
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Une entrée journal existe déjà pour cet enfant à cette date dans cette classe"
        )

    if current_user.role == "animatrice":
        classe = db.query(Classe).filter(Classe.animatrice_id == current_user.id).first()
        if not classe or classe.id != data.classe_id:
            raise HTTPException(status_code=403, detail="Vous ne pouvez remplir que le journal de votre classe")

    entry = Journal(**data.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

@router.put("/{journal_id}", response_model=JournalOut)
def update_journal(journal_id: int,data: JournalUpdate,db: Session = Depends(get_db),current_user: User = Depends(require_role("animatrice", "directrice"))):
    entry = db.query(Journal).filter(Journal.id == journal_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entrée journal introuvable")

    if current_user.role == "animatrice":
        classe = db.query(Classe).filter(Classe.animatrice_id == current_user.id).first()
        if not classe or entry.classe_id != classe.id:
            raise HTTPException(status_code=403, detail="Accès interdit")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(entry, field, value)

    db.commit()
    db.refresh(entry)
    return entry

@router.get("/enfant/{enfant_id}", response_model=List[JournalOut])
def get_journal_enfant(enfant_id: int,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    enfant = db.query(Enfant).filter(Enfant.id == enfant_id).first()
    if not enfant:
        raise HTTPException(status_code=404, detail="Enfant introuvable")


    if current_user.role == "parent" and enfant.parent_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès interdit")

    if current_user.role == "animatrice":
        classe = db.query(Classe).filter(Classe.animatrice_id == current_user.id).first()
        if not classe or enfant.classe_id != classe.id:
            raise HTTPException(status_code=403, detail="Accès interdit")

    return db.query(Journal).filter(Journal.enfant_id == enfant_id).order_by(Journal.date.desc()).all()


@router.get("/classe/{classe_id}", response_model=List[JournalOut])
def get_journal_classe(classe_id: int,date_filtre: Optional[date] = None,db: Session = Depends(get_db),current_user: User = Depends(require_role("animatrice", "directrice"))):
    if current_user.role == "animatrice":
        classe = db.query(Classe).filter(Classe.animatrice_id == current_user.id).first()
        if not classe or classe.id != classe_id:
            raise HTTPException(status_code=403, detail="Accès interdit")

    query = db.query(Journal).filter(Journal.classe_id == classe_id)

    if date_filtre:
        query = query.filter(Journal.date == date_filtre)

    return query.order_by(Journal.date.desc()).all()

@router.delete("/{journal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_journal(journal_id: int,db: Session = Depends(get_db),current_user: User = Depends(require_role("directrice"))):
    entry = db.query(Journal).filter(Journal.id == journal_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entrée journal introuvable")

    db.delete(entry)
    db.commit()
