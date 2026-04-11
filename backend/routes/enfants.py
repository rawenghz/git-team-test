from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from dependencies import get_db, get_current_user, require_role
from models.enfant import Enfant
from models.classe import Classe
from models.user import User
from schemas.enfant import EnfantCreate, EnfantUpdate, EnfantOut

router = APIRouter()


@router.get("/", response_model=List[EnfantOut])
def get_enfants(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    if current_user.role == "directrice":
        return db.query(Enfant).all()

    elif current_user.role == "animatrice":
        classe = db.query(Classe).filter(Classe.animatrice_id == current_user.id).first()
        if not classe:
            return []
        return db.query(Enfant).filter(Enfant.classe_id == classe.id).all()

    else:  # parent
        return db.query(Enfant).filter(Enfant.parent_id == current_user.id).all()


@router.get("/{enfant_id}", response_model=EnfantOut)
def get_enfant(enfant_id: int,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    enfant = db.query(Enfant).filter(Enfant.id == enfant_id).first()
    if not enfant:
        raise HTTPException(status_code=404, detail="Enfant introuvable")

    if current_user.role == "parent" and enfant.parent_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès interdit")

    if current_user.role == "animatrice":
        classe = db.query(Classe).filter(Classe.animatrice_id == current_user.id).first()
        if not classe or enfant.classe_id != classe.id:
            raise HTTPException(status_code=403, detail="Accès interdit")

    return enfant


@router.post("/", response_model=EnfantOut, status_code=status.HTTP_201_CREATED)
def create_enfant(data: EnfantCreate,db: Session = Depends(get_db),current_user: User = Depends(require_role("directrice"))):
    new_enfant = Enfant(**data.model_dump())
    db.add(new_enfant)
    db.commit()
    db.refresh(new_enfant)
    return new_enfant


@router.put("/{enfant_id}", response_model=EnfantOut)
def update_enfant(
    enfant_id: int,
    data: EnfantUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("directrice", "animatrice", "parent"))
):
    enfant = db.query(Enfant).filter(Enfant.id == enfant_id).first()
    if not enfant:
        raise HTTPException(status_code=404, detail="Enfant introuvable")

    # check animatrice
    if current_user.role == "animatrice":
        classe = db.query(Classe).filter(Classe.animatrice_id == current_user.id).first()
        if not classe or enfant.classe_id != classe.id:
            raise HTTPException(status_code=403, detail="Accès interdit")

    # check parent (باش يكون logical)
    if current_user.role == "parent" and enfant.parent_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès interdit")

    # 🔥 extract data مرة وحدة
    update_data = data.model_dump(exclude_unset=True)
    print("UPDATE DATA:", update_data)

    # ❗ إذا فارغة → ما فما حتى update
    if not update_data:
        raise HTTPException(status_code=400, detail="Aucune donnée à mettre à jour")

    # apply update
    for field, value in update_data.items():
        setattr(enfant, field, value)

    db.commit()
    db.refresh(enfant)

    return enfant

@router.delete("/{enfant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_enfant(enfant_id: int,db: Session = Depends(get_db),current_user: User = Depends(require_role("directrice"))):
    enfant = db.query(Enfant).filter(Enfant.id == enfant_id).first()
    if not enfant:
        raise HTTPException(status_code=404, detail="Enfant introuvable")

    db.delete(enfant)
    db.commit()
