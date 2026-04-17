from pydantic import BaseModel
from typing import Optional
from datetime import date as date_type, time, datetime
from enum import Enum

class StatutEnum(str, Enum):
    a_venir  = "a_venir"
    en_cours = "en_cours"
    termine  = "termine"

class EvenementCreate(BaseModel):
    titre: str
    description: Optional[str] = None
    date: date_type
    heure_debut: Optional[time] = None
    heure_fin:   Optional[time] = None
    lieu:        Optional[str]  = None
    statut:      Optional[StatutEnum] = StatutEnum.a_venir

class EvenementUpdate(BaseModel):
    titre:       Optional[str]       = None
    description: Optional[str]       = None
    date:        Optional[date_type] = None  # ← fix : date_type au lieu de date
    heure_debut: Optional[time]      = None
    heure_fin:   Optional[time]      = None
    lieu:        Optional[str]       = None
    statut:      Optional[StatutEnum] = None

class EvenementOut(BaseModel):
    id:          int
    titre:       str
    description: Optional[str]       = None
    date:        date_type
    heure_debut: Optional[time]      = None
    heure_fin:   Optional[time]      = None
    lieu:        Optional[str]       = None
    statut:      str
    created_at:  Optional[datetime]  = None

    class Config:
        from_attributes = True