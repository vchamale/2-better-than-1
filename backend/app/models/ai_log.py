"""Audit log of AI voice-agent actions performed via function calling."""
import uuid
from typing import TYPE_CHECKING, Optional

from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, Relationship

from app.models.base import TimestampMixin, UUIDMixin
from app.models.enums import AILogStatus

if TYPE_CHECKING:
    from app.models.family import Family


class AILog(UUIDMixin, TimestampMixin, table=True):
    __tablename__ = "ai_log"

    family_id: uuid.UUID = Field(foreign_key="family.id", index=True)
    user_id: uuid.UUID = Field(foreign_key="app_user.id")

    transcript: Optional[str] = None
    tool_called: Optional[str] = None
    tool_args: dict = Field(default_factory=dict, sa_type=JSONB)
    status: AILogStatus = Field(default=AILogStatus.success)

    family: "Family" = Relationship(back_populates="ai_logs")
