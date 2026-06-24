"""Pydantic schemas for the To-Dos API.

Tres formas distintas de los datos de un to-do según la operación:
  - TodoCreate -> entra en el POST    (lo que manda el cliente)
  - TodoRead   -> sale en la respuesta (la fila completa)
  - TodoUpdate -> entra en el PATCH   (edición parcial)
"""
import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.enums import Priority


class TodoCreate(BaseModel):
    """Cuerpo del POST /todos. Solo los campos que provee el cliente."""

    title: str                                   # obligatorio
    description: Optional[str] = None            # opcional (puede omitirse)
    priority: Priority = Priority.medium         # opcional, con default


class TodoRead(BaseModel):
    """Respuesta de la API: la fila completa (incluye lo que puso el servidor)."""

    # Permite construir el schema desde un objeto ORM (TodoRead.model_validate(todo)).
    # Sin esto, response_model=TodoRead no sabe leer atributos del modelo y falla.
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID                                # imprescindible: el front edita/borra por id
    family_id: uuid.UUID
    created_by: uuid.UUID
    completed_by: Optional[uuid.UUID] = None

    title: str
    description: Optional[str] = None
    priority: Priority
    is_done: bool
    completed_at: Optional[datetime] = None


class TodoUpdate(BaseModel):
    """Cuerpo del PATCH /todos/{id}. Edición parcial: TODO opcional.

    None = "no me lo mandaron" = "no tocar este campo".
    Por eso aquí ningún campo lleva un default distinto de None.
    """

    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[Priority] = None
    is_done: Optional[bool] = None
