from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id= Column(Integer, primary_key=True, index=True)
    nom= Column(String(100), nullable=False)
    email= Column(String(150), unique=True, nullable=False, index=True)
    mot_de_passe = Column(String(255), nullable=False)
    role= Column(Enum("parent", "animatrice", "directrice"), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    enfants= relationship("Enfant", back_populates="parent", foreign_keys="Enfant.parent_id")
    classe_animee= relationship("Classe", back_populates="animatrice", foreign_keys="Classe.animatrice_id")
    
    notifications      = relationship("Notification", foreign_keys="Notification.user_id",   back_populates="user")

