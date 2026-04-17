from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List

from dependencies import get_db, get_current_user, require_role
from models.classe import Classe
from models.user import User
from schemas.classe import ClasseCreate, ClasseUpdate, ClasseOut
from models.enfant import Enfant

router = APIRouter()

@router.get("/", response_model=List[ClasseOut])
def get_classes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role == "animatrice":
        classes = db.query(Classe).options(joinedload(Classe.animatrice)).filter(Classe.animatrice_id == current_user.id).all()
    else:
        classes = db.query(Classe).options(joinedload(Classe.animatrice)).all()

    for c in classes:
        c.animatrice_nom = c.animatrice.nom if c.animatrice else None
    return classes

@router.get("/non-assignes")
def get_classes_non_assignes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Classe).filter(Classe.animatrice_id == None).all()
@router.get("/{classe_id}", response_model=ClasseOut)
def get_classe(classe_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    classe = db.query(Classe).options(joinedload(Classe.animatrice)).filter(Classe.id == classe_id).first()
    if not classe:
        raise HTTPException(status_code=404, detail="Classe introuvable")

    if current_user.role == "animatrice" and classe.animatrice_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès interdit à cette classe")

    classe.animatrice_nom = classe.animatrice.nom if classe.animatrice else None
    return classe


@router.post("/", response_model=ClasseOut, status_code=status.HTTP_201_CREATED)
def create_classe(data: ClasseCreate, db: Session = Depends(get_db), current_user: User = Depends(require_role("directrice"))):
    new_classe = Classe(**data.model_dump())
    db.add(new_classe)
    db.commit()
    db.refresh(new_classe)
    return new_classe


@router.put("/{classe_id}", response_model=ClasseOut)
def update_classe(classe_id: int, data: ClasseUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_role("directrice"))):
    classe = db.query(Classe).filter(Classe.id == classe_id).first()
    if not classe:
        raise HTTPException(status_code=404, detail="Classe introuvable")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(classe, field, value)

    db.commit()
    db.refresh(classe)
    return classe


# routes/classes.py
@router.delete("/{classe_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_classe(classe_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_role("directrice"))):
    classe = db.query(Classe).filter(Classe.id == classe_id).first()
    if not classe:
        raise HTTPException(status_code=404, detail="Classe introuvable")

    from models.journal import Journal
    from models.enfant import Enfant

    # 1. Delete journal entries first (they reference classe AND enfant)
    db.query(Journal).filter(Journal.classe_id == classe_id).delete(synchronize_session=False)

    # 2. Delete enfants of this classe
    db.query(Enfant).filter(Enfant.classe_id == classe_id).delete(synchronize_session=False)

    # 3. Now safe to delete the classe
    db.delete(classe)
    db.commit()