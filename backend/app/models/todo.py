"""To-Dos module: general checklist items with no fixed date."""
import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import TIMESTAMP
from sqlmodel import Field, Relationship

from app.models.base import TimestampMixin, UUIDMixin
from app.models.enums import Priority

if TYPE_CHECKING:
    from app.models.family import Family


class Todo(UUIDMixin, TimestampMixin, table=True):
    __tablename__ = "todo"

    family_id: uuid.UUID = Field(foreign_key="family.id", index=True)
    created_by: uuid.UUID = Field(foreign_key="app_user.id")
    completed_by: Optional[uuid.UUID] = Field(default=None, foreign_key="app_user.id")

    title: str
    description: Optional[str] = None
    priority: Priority = Field(default=Priority.medium)
    is_done: bool = Field(default=False)
    completed_at: Optional[datetime] = Field(
        default=None, sa_type=TIMESTAMP(timezone=True)
    )

    family: "Family" = Relationship(back_populates="todos")
