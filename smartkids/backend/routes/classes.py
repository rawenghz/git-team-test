from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from dependencies import get_db, get_current_user, require_role
from models.classe import Classe
from models.user import User
from schemas.classe import ClasseCreate, ClasseUpdate, ClasseOut

router = APIRouter()

@router.get("/", response_model=List[ClasseOut])
def get_classes(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    """
    - Directrice : voit toutes les classes
    - Animatrice : voit seulement sa classe
    - Parent : voit toutes les classes (pour info)
    """
    if current_user.role == "animatrice":
        return db.query(Classe).filter(Classe.animatrice_id == current_user.id).all()
    return db.query(Classe).all()

@router.get("/my-classe", response_model=ClasseOut)
def get_my_classe(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    classe = db.query(Classe).filter(Classe.animatrice_id == current_user.id).first()
    if not classe:
        raise HTTPException(status_code=404, detail="Aucune classe affectée à cette animatrice")
    return classe
@router.get("/{classe_id}", response_model=ClasseOut)
def get_classe(classe_id: int,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    classe = db.query(Classe).filter(Classe.id == classe_id).first()
    if not classe:
        raise HTTPException(status_code=404, detail="Classe introuvable")

    if current_user.role == "animatrice" and classe.animatrice_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès interdit à cette classe")

    return classe


@router.post("/", response_model=ClasseOut, status_code=status.HTTP_201_CREATED)
def create_classe(data: ClasseCreate,db: Session = Depends(get_db),current_user: User = Depends(require_role("directrice"))):
    new_classe = Classe(**data.model_dump())
    db.add(new_classe)
    db.commit()
    db.refresh(new_classe)
    return new_classe


@router.put("/{classe_id}", response_model=ClasseOut)
def update_classe(classe_id: int,data: ClasseUpdate,db: Session = Depends(get_db),current_user: User = Depends(require_role("directrice"))):
    classe = db.query(Classe).filter(Classe.id == classe_id).first()
    if not classe:
        raise HTTPException(status_code=404, detail="Classe introuvable")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(classe, field, value)

    db.commit()
    db.refresh(classe)
    return classe


@router.delete("/{classe_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_classe(classe_id: int,db: Session = Depends(get_db),current_user: User = Depends(require_role("directrice"))):
    classe = db.query(Classe).filter(Classe.id == classe_id).first()
    if not classe:
        raise HTTPException(status_code=404, detail="Classe introuvable")

    db.delete(classe)
    db.commit()
