# ============================================
# dependencies.py — Dépendances réutilisables
# ============================================

from database import SessionLocal
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from config import settings


def get_db():
    """Fournit une session DB à chaque requête, se ferme automatiquement."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", scheme_name="JWT")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    from models.user import User 

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token invalide ou expiré",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        user_id = int(user_id)  # ✅ CORRECTION : convertir string → int
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user


def require_role(*roles: str):
    """Vérifie que l'utilisateur connecté a l'un des rôles autorisés."""
    def checker(current_user=Depends(get_current_user)):
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Accès interdit. Rôle requis : {', '.join(roles)}"
            )
        return current_user
    return checker

# Raccourcis pratiques
def require_directrice(current_user=Depends(get_current_user)):
    return require_role("directrice")(current_user)

def require_animatrice_or_directrice(current_user=Depends(get_current_user)):
    return require_role("animatrice", "directrice")(current_user)