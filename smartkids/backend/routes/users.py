from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from dependencies import get_db, get_current_user, require_role
from models.user import User
from schemas.user import UserCreate, UserUpdate, UserOut
from routes.auth import hash_password

router = APIRouter()

@router.get("/", response_model=List[UserOut])
def get_all_users(db: Session = Depends(get_db),current_user: User = Depends(require_role("directrice"))):
    return db.query(User).all()

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "nom": current_user.nom,
        "email": current_user.email,
        "role": current_user.role
    }

@router.get("/animatrices", response_model=List[UserOut])
def get_animatrices(db: Session = Depends(get_db), current_user: User = Depends(require_role("directrice"))):
    return db.query(User).filter(User.role == "animatrice").all()

@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: int,db: Session = Depends(get_db),current_user: User = Depends(require_role("directrice"))):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    return user




@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(data: UserCreate,db: Session = Depends(get_db),current_user: User = Depends(require_role("directrice"))):
    existing = db.query(User).filter(User.email == data.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")

    new_user = User(
        nom=data.nom,
        email=data.email,
        mot_de_passe=hash_password(data.mot_de_passe),
        role=data.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    if data.enfants_ids:
        from models.enfant import Enfant
        for enfant_id in data.enfants_ids:
            enfant = db.query(Enfant).filter(Enfant.id == enfant_id).first()
            if enfant:
                enfant.parent_id = new_user.id
        db.commit()

    return new_user
    return new_user

@router.put("/{user_id}", response_model=UserOut)
def update_user(user_id: int,data: UserUpdate,db: Session = Depends(get_db),current_user: User = Depends(require_role("directrice"))):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    if data.nom:   user.nom   = data.nom
    if data.email: user.email = data.email
    if data.role:  user.role  = data.role

    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int,db: Session = Depends(get_db),current_user: User = Depends(require_role("directrice"))):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    db.delete(user)
    db.commit()