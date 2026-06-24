"""Users (Google-authenticated), their family memberships, and per-user preferences."""
import uuid
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import UniqueConstraint
from sqlmodel import Field, Relationship

from app.models.base import TimestampMixin, UUIDMixin
from app.models.enums import MemberRole

if TYPE_CHECKING:
    from app.models.family import Family


class AppUser(UUIDMixin, TimestampMixin, table=True):
    __tablename__ = "app_user"

    google_sub: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    display_name: str
    avatar_url: Optional[str] = None
    voice_id: Optional[str] = Field(
        default=None, description="This user's own ElevenLabs cloned voice ID"
    )

    memberships: List["FamilyMember"] = Relationship(back_populates="user")
    preferences: Optional["UserPreferences"] = Relationship(
        back_populates="user", sa_relationship_kwargs={"uselist": False}
    )


class FamilyMember(UUIDMixin, TimestampMixin, table=True):
    __tablename__ = "family_member"
    __table_args__ = (
        UniqueConstraint("family_id", "user_id", name="uq_family_member"),
    )

    family_id: uuid.UUID = Field(foreign_key="family.id", index=True)
    user_id: uuid.UUID = Field(foreign_key="app_user.id", index=True)
    role: MemberRole = Field(default=MemberRole.member)

    family: "Family" = Relationship(back_populates="members")
    user: "AppUser" = Relationship(back_populates="memberships")


class UserPreferences(TimestampMixin, table=True):
    __tablename__ = "user_prefs"

    user_id: uuid.UUID = Field(foreign_key="app_user.id", primary_key=True)
    assistant_voice_id: Optional[str] = Field(
        default=None,
        description="Voice the assistant replies in for this user (e.g. partner's voice_id)",
    )
    timezone: str = Field(default="America/Guatemala")
    locale: str = Field(default="es")

    user: "AppUser" = Relationship(back_populates="preferences")
