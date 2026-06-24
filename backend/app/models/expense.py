"""Finances module: expense categories and the monthly expense log."""
import uuid
from datetime import date
from decimal import Decimal
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import UniqueConstraint
from sqlmodel import Field, Relationship

from app.models.base import TimestampMixin, UUIDMixin
from app.models.enums import PaymentSource

if TYPE_CHECKING:
    from app.models.family import Family


class ExpenseCategory(UUIDMixin, TimestampMixin, table=True):
    __tablename__ = "expense_category"
    __table_args__ = (
        UniqueConstraint("family_id", "name", name="uq_category_name"),
    )

    family_id: uuid.UUID = Field(foreign_key="family.id", index=True)
    name: str
    icon: Optional[str] = None

    family: "Family" = Relationship(back_populates="expense_categories")
    expenses: List["Expense"] = Relationship(back_populates="category")


class Expense(UUIDMixin, TimestampMixin, table=True):
    __tablename__ = "expense"

    family_id: uuid.UUID = Field(foreign_key="family.id", index=True)
    created_by: uuid.UUID = Field(foreign_key="app_user.id")
    category_id: Optional[uuid.UUID] = Field(
        default=None, foreign_key="expense_category.id", index=True
    )

    amount: Decimal = Field(max_digits=12, decimal_places=2)
    currency: str = Field(default="GTQ", max_length=3)
    payment_source: PaymentSource = Field(default=PaymentSource.cash)
    description: Optional[str] = None
    expense_date: date

    family: "Family" = Relationship(back_populates="expenses")
    category: Optional["ExpenseCategory"] = Relationship(back_populates="expenses")
