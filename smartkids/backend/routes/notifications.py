from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from dependencies import get_db, get_current_user, require_role
from models.notification import Notification
from models.user import User
from schemas.notification import NotificationCreate, NotificationOut

router = APIRouter()

@router.get("/", response_model=List[NotificationOut])
def get_my_notifications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return (
        db.query(Notification)
        .order_by(Notification.created_at.desc())
        .all()
    )
@router.get("/all", response_model=List[NotificationOut])
def get_all_notifications(db: Session = Depends(get_db),current_user: User = Depends(require_role("directrice"))):
    return db.query(Notification).order_by(Notification.created_at.desc()).all()


@router.post("/", response_model=NotificationOut, status_code=status.HTTP_201_CREATED)
def create_notification(data: NotificationCreate,db: Session = Depends(get_db),current_user: User = Depends(require_role("directrice", "animatrice"))):
    notif = Notification(**data.model_dump())
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif


@router.delete("/{notif_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notification(notif_id: int,db: Session = Depends(get_db),current_user: User = Depends(require_role("directrice"))):
    notif = db.query(Notification).filter(Notification.id == notif_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification introuvable")

    db.delete(notif)
    db.commit()
