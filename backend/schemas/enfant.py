from pydantic import BaseModel
from typing import Optional
from datetime import date
from enum import Enum

class GenreEnum(str, Enum):
    garcon = "garcon"
    fille  = "fille"

class EnfantCreate(BaseModel):
    nom: str
    date_naissance: Optional[date] = None
    age: Optional[int] = None
    genre: GenreEnum
    notes_medicales: Optional[str] = None
    parent_id: int
    classe_id: Optional[int] = None

class EnfantUpdate(BaseModel):
    nom: Optional[str] = None
    date_naissance: Optional[date] = None
    age: Optional[int] = None
    genre: Optional[GenreEnum] = None
    notes_medicales: Optional[str] = None
    classe_id: Optional[int] = None

class EnfantOut(BaseModel):
    id: int
    nom: str
    date_naissance: Optional[date] = None
    age: Optional[int] = None
    genre: str
    notes_medicales: Optional[str] = None
    parent_id: int
    classe_id: Optional[int] = None

    class Config:
        from_attributes = True
