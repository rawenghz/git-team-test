from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Classe(Base):
    __tablename__ = "classes"

    id= Column(Integer, primary_key=True, index=True)
    nom= Column(String(100), nullable=False)
    section= Column(Enum("petite", "moyenne", "grande"))
    animatrice_id= Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    animatrice= relationship("User", back_populates="classe_animee", foreign_keys=[animatrice_id])
    enfants= relationship("Enfant", back_populates="classe")
    journal= relationship("Journal", back_populates="classe")
