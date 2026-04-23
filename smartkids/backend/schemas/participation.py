from pydantic import BaseModel
from enum import Enum
from typing import Optional, List
from datetime import datetime

class StatusEnum(str, Enum):
    participe = "participe"
    decline = "decline"
    en_attente = "en_attente"

class ParticipationUpdate(BaseModel):
    status: StatusEnum

class ParticipantOut(BaseModel):
    id: int
    nom: Optional[str] = None
    prenom: Optional[str] = None
    role: Optional[str] = None

    class Config:
        from_attributes = True

class ParticipationOut(BaseModel):
    id: int
    event_id: int
    user_id: int
    status: StatusEnum
    updated_at: datetime
    user: Optional[ParticipantOut]

    class Config:
        from_attributes = True

class EventStatsOut(BaseModel):
    total_invites: int
    nb_participe: int
    nb_decline: int
    nb_en_attente: int
    taux_participation: float
    taux_reponse: float          # ← ajouter cette ligne
    participants: List[ParticipantOut]
    declines: List[ParticipantOut]
    en_attente: List[ParticipantOut]
    mon_status: Optional[StatusEnum]