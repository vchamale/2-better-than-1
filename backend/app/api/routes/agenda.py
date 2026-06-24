"""CRUD de Agenda (eventos con fecha: tareas, notas, recordatorios).

Mismo patrón que To-Dos: cada evento cuelga de `ctx.family_id` (multi-tenancy) y
toda query filtra por la familia del contexto. El `id` viaja en la URL; el cuerpo
nunca trae `id`.

Extra de Agenda: el endpoint de listado acepta un filtro opcional por rango de
fechas (`start`/`end`), que es justo lo que la pantalla Home usará para pedir solo
los eventos de HOY.
"""
import uuid
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.deps import CurrentContext, get_current_context
from app.models.agenda import AgendaEvent
from app.schemas.agenda import AgendaEventCreate, AgendaEventRead, AgendaEventUpdate

router = APIRouter(prefix="/agenda", tags=["agenda"])


async def _get_owned_event(
    event_id: uuid.UUID, ctx: CurrentContext, session: AsyncSession
) -> AgendaEvent:
    """Carga un evento asegurando que pertenece a la familia del contexto.

    404 tanto si no existe como si es de otra familia (no revelamos su existencia).
    """
    event = await session.scalar(
        select(AgendaEvent).where(
            AgendaEvent.id == event_id, AgendaEvent.family_id == ctx.family_id
        )
    )
    if event is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Agenda event not found")
    return event


@router.post("", response_model=AgendaEventRead, status_code=status.HTTP_201_CREATED)
async def create_event(
    body: AgendaEventCreate,
    ctx: CurrentContext = Depends(get_current_context),
    session: AsyncSession = Depends(get_session),
) -> AgendaEvent:
    event = AgendaEvent(
        **body.model_dump(),
        family_id=ctx.family_id,
        created_by=ctx.user_id,
    )
    session.add(event)
    await session.commit()
    await session.refresh(event)
    return event


@router.get("", response_model=list[AgendaEventRead])
async def list_events(
    start: Optional[datetime] = Query(
        default=None, description="Solo eventos con start_at >= este instante (tz-aware)."
    ),
    end: Optional[datetime] = Query(
        default=None, description="Solo eventos con start_at < este instante (tz-aware)."
    ),
    ctx: CurrentContext = Depends(get_current_context),
    session: AsyncSession = Depends(get_session),
) -> list[AgendaEvent]:
    query = select(AgendaEvent).where(AgendaEvent.family_id == ctx.family_id)
    if start is not None:
        query = query.where(AgendaEvent.start_at >= start)
    if end is not None:
        query = query.where(AgendaEvent.start_at < end)
    query = query.order_by(AgendaEvent.start_at.asc())

    result = await session.scalars(query)
    return list(result)


@router.get("/{event_id}", response_model=AgendaEventRead)
async def get_event(
    event_id: uuid.UUID,
    ctx: CurrentContext = Depends(get_current_context),
    session: AsyncSession = Depends(get_session),
) -> AgendaEvent:
    return await _get_owned_event(event_id, ctx, session)


@router.patch("/{event_id}", response_model=AgendaEventRead)
async def update_event(
    event_id: uuid.UUID,
    body: AgendaEventUpdate,
    ctx: CurrentContext = Depends(get_current_context),
    session: AsyncSession = Depends(get_session),
) -> AgendaEvent:
    event = await _get_owned_event(event_id, ctx, session)

    data = body.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(event, field, value)

    await session.commit()
    await session.refresh(event)
    return event


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(
    event_id: uuid.UUID,
    ctx: CurrentContext = Depends(get_current_context),
    session: AsyncSession = Depends(get_session),
) -> None:
    event = await _get_owned_event(event_id, ctx, session)
    await session.delete(event)
    await session.commit()
