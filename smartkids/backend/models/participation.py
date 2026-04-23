from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

class StatusEnum(str, enum.Enum):
    participe = "participe"
    decline = "decline"
    en_attente = "en_attente"

class EventParticipation(Base):
    __tablename__ = "event_participations"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("evenements.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    status = Column(Enum(StatusEnum), default=StatusEnum.en_attente)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    user = relationship("User", backref="participations")
    evenement = relationship("Evenement", backref="participations")