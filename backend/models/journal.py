from sqlalchemy import Column, Integer, String, Date, Enum, Text, Boolean, ForeignKey, TIMESTAMP, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Journal(Base):
    __tablename__ = "journal"

    id = Column(Integer, primary_key=True, index=True)
    classe_id = Column(Integer, ForeignKey("classes.id", ondelete="CASCADE"), nullable=False)
    enfant_id= Column(Integer, ForeignKey("enfants.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False)
    cours= Column(String(200))
    activite= Column(String(200))
    evaluation = Column(Enum("tres_bien", "bien", "moyen"), nullable=True)
    humeur= Column(Enum("heureux", "neutre", "triste", "malade"), nullable=True)
    note= Column(Text)
    absent= Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    __table_args__ = (
        UniqueConstraint("classe_id", "enfant_id", "date", name="uq_journal_classe_enfant_date"),
    )

    classe = relationship("Classe", back_populates="journal")
    enfant = relationship("Enfant", back_populates="journal")
