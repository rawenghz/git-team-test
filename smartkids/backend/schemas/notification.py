from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class TypeNotifEnum(str, Enum):
    info    = "info"
    alerte  = "alerte"
    nouveau = "nouveau"

class NotificationCreate(BaseModel):
    message: str
    type:    Optional[TypeNotifEnum] = TypeNotifEnum.info
    user_id: Optional[int] = None

class NotificationUpdate(BaseModel):         # ← doit être présent
    message: Optional[str]          = None
    type:    Optional[TypeNotifEnum] = None

class NotificationOut(BaseModel):
    id:         int
    message:    str
    type:       str
    user_id:    Optional[int]      = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True