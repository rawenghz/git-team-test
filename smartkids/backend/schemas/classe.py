from pydantic import BaseModel
from typing import Optional
from enum import Enum

class SectionEnum(str, Enum):
    petite  = "petite"
    moyenne = "moyenne"
    grande  = "grande"

class ClasseCreate(BaseModel):
    nom: str
    section: Optional[SectionEnum] = None
    animatrice_id: Optional[int] = None

class ClasseUpdate(BaseModel):
    nom: Optional[str] = None
    section: Optional[SectionEnum] = None
    animatrice_id: Optional[int] = None

class ClasseOut(BaseModel):
    id: int
    nom: str
    section: Optional[str] = None
    animatrice_id: Optional[int] = None

    class Config:
        from_attributes = True
