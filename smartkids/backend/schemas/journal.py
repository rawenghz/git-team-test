from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from enum import Enum

class EvaluationEnum(str, Enum):
    tres_bien = "tres_bien"
    bien      = "bien"
    moyen     = "moyen"

class HumeurEnum(str, Enum):
    heureux = "heureux"
    neutre  = "neutre"
    triste  = "triste"
    malade  = "malade"

class JournalCreate(BaseModel):
    classe_id: int
    enfant_id: int
    date: date
    cours: Optional[str] = None
    activite: Optional[str] = None
    evaluation: Optional[EvaluationEnum] = None
    humeur: Optional[HumeurEnum] = None
    note: Optional[str] = None
    absent: Optional[bool] = False

class JournalUpdate(BaseModel):
    cours: Optional[str] = None
    activite: Optional[str] = None
    evaluation: Optional[EvaluationEnum] = None
    humeur: Optional[HumeurEnum] = None
    note: Optional[str] = None
    absent: Optional[bool] = None

class JournalOut(BaseModel):
    id: int
    classe_id: int
    enfant_id: int
    date: date
    cours: Optional[str] = None
    activite: Optional[str] = None
    evaluation: Optional[str] = None
    humeur: Optional[str] = None
    note: Optional[str] = None
    absent: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Ajoute juste ça à la fin de ton fichier schemas/journal.py

class JournalByDateOut(BaseModel):
    date: date
    cours: Optional[str] = None
    activite: Optional[str] = None
    entrees: list[JournalOut] = []  # liste de tous les enfants ce jour-là

    class Config:
        from_attributes = True
