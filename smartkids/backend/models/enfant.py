from sqlalchemy import Column, Integer, String, Date, Enum, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Enfant(Base):
    __tablename__ = "enfants"

    id= Column(Integer, primary_key=True, index=True)
    nom= Column(String(100), nullable=False)
    date_naissance= Column(Date)
    age= Column(Integer)
    genre= Column(Enum("garcon", "fille"), nullable=False)
    notes_medicales= Column(Text)
    parent_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    classe_id= Column(Integer, ForeignKey("classes.id", ondelete="SET NULL"), nullable=True)


    parent  = relationship("User", back_populates="enfants", foreign_keys=[parent_id])
    classe  = relationship("Classe", back_populates="enfants")
    journal = relationship("Journal", back_populates="enfant")
