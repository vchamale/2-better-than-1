"""Pydantic schemas for the Agenda API.

Mismo patrón que To-Dos (app/schemas/todo.py): tres formas según la operación.
  - AgendaEventCreate -> entra en el POST    (lo que manda el cliente)
  - AgendaEventRead   -> sale en la respuesta (la fila completa)
  - AgendaEventUpdate -> entra en el PATCH   (edición parcial)

La diferencia con To-Dos es que aquí mandan fechas (`start_at`, etc.): el modelo ya
es timezone-aware, así que el cliente debe enviar datetimes con offset (ISO-8601,
p. ej. "2026-06-24T15:00:00-06:00").
"""
import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.enums import EventType


class AgendaEventCreate(BaseModel):
    """Cuerpo del POST /agenda. Solo los campos que provee el cliente."""

    title: str                                   # obligatorio
    description: Optional[str] = None            # opcional
    event_type: EventType = EventType.task       # opcional, con default
    start_at: datetime                           # obligatorio (tz-aware)
    end_at: Optional[datetime] = None            # opcional
    remind_at: Optional[datetime] = None         # opcional


class AgendaEventRead(BaseModel):
    """Respuesta de la API: la fila completa (incluye lo que puso el servidor)."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID                                # el front edita/borra por id
    family_id: uuid.UUID
    created_by: uuid.UUID

    title: str
    description: Optional[str] = None
    event_type: EventType
    start_at: datetime
    end_at: Optional[datetime] = None
    remind_at: Optional[datetime] = None
    is_completed: bool


class AgendaEventUpdate(BaseModel):
    """Cuerpo del PATCH /agenda/{id}. Edición parcial: TODO opcional.

    None = "no me lo mandaron" = "no tocar este campo".
    """

    title: Optional[str] = None
    description: Optional[str] = None
    event_type: Optional[EventType] = None
    start_at: Optional[datetime] = None
    end_at: Optional[datetime] = None
    remind_at: Optional[datetime] = None
    is_completed: Optional[bool] = None
