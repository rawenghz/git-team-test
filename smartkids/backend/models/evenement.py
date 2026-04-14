from sqlalchemy import Column, Integer, String, Date, Time, Text, Enum, TIMESTAMP
from sqlalchemy.sql import func
from database import Base

class Evenement(Base):
    __tablename__ = "evenements"

    id = Column(Integer, primary_key=True, index=True)
    titre= Column(String(200), nullable=False)
    description= Column(Text)
    date= Column(Date, nullable=False)
    heure_debut= Column(Time)
    heure_fin= Column(Time)
    lieu= Column(String(200))
    statut= Column(Enum("a_venir", "en_cours", "termine"), default="a_venir")
    created_at = Column(TIMESTAMP, server_default=func.now())
