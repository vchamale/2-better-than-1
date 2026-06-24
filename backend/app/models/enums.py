"""Enumerations shared across the domain models."""
from enum import Enum


class MemberRole(str, Enum):
    owner = "owner"
    member = "member"


class EventType(str, Enum):
    task = "task"
    note = "note"
    reminder = "reminder"


class Priority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class HabitFrequency(str, Enum):
    daily = "daily"
    weekly = "weekly"


class AILogStatus(str, Enum):
    success = "success"
    error = "error"


class PaymentSource(str, Enum):
    """Where an expense was paid from. UI labels: crédito / efectivo / ahorro."""

    credit = "credit"
    cash = "cash"
    savings = "savings"
