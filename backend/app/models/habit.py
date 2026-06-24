"""Habit Tracker module: habits and their daily/weekly check-ins."""
import uuid
from datetime import date
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import UniqueConstraint
from sqlmodel import Field, Relationship

from app.models.base import TimestampMixin, UUIDMixin
from app.models.enums import HabitFrequency

if TYPE_CHECKING:
    from app.models.family import Family


class Habit(UUIDMixin, TimestampMixin, table=True):
    __tablename__ = "habit"

    family_id: uuid.UUID = Field(foreign_key="family.id", index=True)
    created_by: uuid.UUID = Field(foreign_key="app_user.id")

    name: str
    description: Optional[str] = None
    frequency: HabitFrequency = Field(default=HabitFrequency.daily)
    target_per_period: int = Field(default=1)
    is_archived: bool = Field(default=False)

    family: "Family" = Relationship(back_populates="habits")
    logs: List["HabitLog"] = Relationship(back_populates="habit")


class HabitLog(UUIDMixin, TimestampMixin, table=True):
    __tablename__ = "habit_log"
    __table_args__ = (
        UniqueConstraint("habit_id", "logged_by", "log_date", name="uq_habit_log_day"),
    )

    habit_id: uuid.UUID = Field(foreign_key="habit.id", index=True)
    family_id: uuid.UUID = Field(foreign_key="family.id", index=True)
    logged_by: uuid.UUID = Field(foreign_key="app_user.id")
    log_date: date

    habit: "Habit" = Relationship(back_populates="logs")
    family: "Family" = Relationship(back_populates="habit_logs")
