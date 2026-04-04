from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum

class RoleEnum(str, Enum):
    parent      = "parent"
    animatrice  = "animatrice"
    directrice  = "directrice"

class UserCreate(BaseModel):
    nom: str
    email: EmailStr
    mot_de_passe: str
    role: RoleEnum

class UserUpdate(BaseModel):
    nom: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[RoleEnum] = None

class UserOut(BaseModel):
    id: int
    nom: str
    email: str
    role: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
