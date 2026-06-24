"""Agenda module: calendar-bound tasks, notes and reminders."""
import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import TIMESTAMP
from sqlmodel import Field, Relationship

from app.models.base import TimestampMixin, UUIDMixin
from app.models.enums import EventType

if TYPE_CHECKING:
    from app.models.family import Family


class AgendaEvent(UUIDMixin, TimestampMixin, table=True):
    __tablename__ = "agenda_event"

    family_id: uuid.UUID = Field(foreign_key="family.id", index=True)
    created_by: uuid.UUID = Field(foreign_key="app_user.id")

    title: str
    description: Optional[str] = None
    event_type: EventType = Field(default=EventType.task)
    start_at: datetime = Field(sa_type=TIMESTAMP(timezone=True))
    end_at: Optional[datetime] = Field(
        default=None, sa_type=TIMESTAMP(timezone=True)
    )
    remind_at: Optional[datetime] = Field(
        default=None, sa_type=TIMESTAMP(timezone=True)
    )
    is_completed: bool = Field(default=False)

    family: "Family" = Relationship(back_populates="agenda_events")
