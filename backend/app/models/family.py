"""Family: the shared environment every record belongs to (multi-tenancy root)."""
from typing import TYPE_CHECKING, List

from sqlmodel import Field, Relationship

from app.models.base import TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from app.models.agenda import AgendaEvent
    from app.models.ai_log import AILog
    from app.models.expense import Expense, ExpenseCategory
    from app.models.habit import Habit, HabitLog
    from app.models.todo import Todo
    from app.models.user import FamilyMember


class Family(UUIDMixin, TimestampMixin, table=True):
    __tablename__ = "family"

    name: str
    default_currency: str = Field(default="GTQ", max_length=3)

    members: List["FamilyMember"] = Relationship(back_populates="family")
    agenda_events: List["AgendaEvent"] = Relationship(back_populates="family")
    todos: List["Todo"] = Relationship(back_populates="family")
    habits: List["Habit"] = Relationship(back_populates="family")
    habit_logs: List["HabitLog"] = Relationship(back_populates="family")
    expenses: List["Expense"] = Relationship(back_populates="family")
    expense_categories: List["ExpenseCategory"] = Relationship(back_populates="family")
    ai_logs: List["AILog"] = Relationship(back_populates="family")
