"""Import every model so that importing `app.models` populates SQLModel.metadata.

Alembic's env.py does `import app.models` to discover every table for
autogenerate. If a model isn't imported here, Alembic won't see it and will
think the table should be dropped. Add new models to this list.
"""
from app.models.base import TimestampMixin, UUIDMixin
from app.models.family import Family
from app.models.user import AppUser, FamilyMember, UserPreferences
from app.models.agenda import AgendaEvent
from app.models.todo import Todo
from app.models.habit import Habit, HabitLog
from app.models.expense import Expense, ExpenseCategory
from app.models.ai_log import AILog

__all__ = [
    "TimestampMixin",
    "UUIDMixin",
    "Family",
    "AppUser",
    "FamilyMember",
    "UserPreferences",
    "AgendaEvent",
    "Todo",
    "Habit",
    "HabitLog",
    "Expense",
    "ExpenseCategory",
    "AILog",
]
