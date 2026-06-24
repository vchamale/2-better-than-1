"""Shared SQLModel mixins: UUID primary keys and timezone-aware timestamps."""
import uuid
from datetime import datetime, timezone

from sqlalchemy import TIMESTAMP
from sqlmodel import Field, SQLModel


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class UUIDMixin(SQLModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)


class TimestampMixin(SQLModel):
    created_at: datetime = Field(
        default_factory=utcnow,
        sa_type=TIMESTAMP(timezone=True),
        nullable=False,
    )
    updated_at: datetime = Field(
        default_factory=utcnow,
        sa_type=TIMESTAMP(timezone=True),
        nullable=False,
        sa_column_kwargs={"onupdate": utcnow},
    )
