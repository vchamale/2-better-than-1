"""Shared FastAPI dependencies.

get_current_context() es un STUB temporal del "usuario autenticado".
En la Fase 3 (Google Auth) se reemplaza su cuerpo por la validación real del
token; la firma y el tipo de retorno se mantienen, así los endpoints no cambian.
"""
import uuid
from dataclasses import dataclass

# IDs de desarrollo, hardcodeados. OJO: para que un POST /todos funcione, estas
# filas DEBEN existir en las tablas `family` y `app_user` (por las FKs).
# Las sembraremos en la base antes de probar el primer POST.
DEV_FAMILY_ID = uuid.UUID("11111111-1111-1111-1111-111111111111")
DEV_USER_ID = uuid.UUID("22222222-2222-2222-2222-222222222222")


# TODO 1: define un contenedor simple para el contexto.
#   Usa un @dataclass llamado CurrentContext con dos campos:
#     family_id: uuid.UUID
#     user_id: uuid.UUID
#   (un dataclass basta; no necesita ser Pydantic porque no entra/sale por la API)
@dataclass
class CurrentContext:
    family_id: uuid.UUID
    user_id: uuid.UUID


# TODO 2: escribe la dependencia.
#   def get_current_context() -> CurrentContext:
#       devuelve un CurrentContext con DEV_FAMILY_ID y DEV_USER_ID.
#   Eso es todo: una función normal que retorna el contexto.
def get_current_context() -> CurrentContext:
    return CurrentContext(family_id=DEV_FAMILY_ID, user_id=DEV_USER_ID)
