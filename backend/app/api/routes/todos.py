"""CRUD de To-Dos.

Todo cuelga de `ctx.family_id` (multi-tenancy): cada query filtra por la familia
del contexto, así una familia nunca ve ni toca los to-dos de otra. El `id` de un
to-do viaja en la URL; el cuerpo nunca trae `id`.
"""
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.deps import CurrentContext, get_current_context
from app.models.todo import Todo
from app.schemas.todo import TodoCreate, TodoRead, TodoUpdate

router = APIRouter(prefix="/todos", tags=["todos"])


async def _get_owned_todo(
    todo_id: uuid.UUID, ctx: CurrentContext, session: AsyncSession
) -> Todo:
    """Carga un to-do asegurando que pertenece a la familia del contexto.

    404 tanto si no existe como si es de otra familia (no revelamos su existencia).
    """
    todo = await session.scalar(
        select(Todo).where(Todo.id == todo_id, Todo.family_id == ctx.family_id)
    )
    if todo is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="To-do not found")
    return todo


@router.post("", response_model=TodoRead, status_code=status.HTTP_201_CREATED)
async def create_todo(
    body: TodoCreate,
    ctx: CurrentContext = Depends(get_current_context),
    session: AsyncSession = Depends(get_session),
) -> Todo:
    todo = Todo(
        **body.model_dump(),
        family_id=ctx.family_id,
        created_by=ctx.user_id,
    )
    session.add(todo)
    await session.commit()
    await session.refresh(todo)
    return todo


@router.get("", response_model=list[TodoRead])
async def list_todos(
    ctx: CurrentContext = Depends(get_current_context),
    session: AsyncSession = Depends(get_session),
) -> list[Todo]:
    result = await session.scalars(
        select(Todo)
        .where(Todo.family_id == ctx.family_id)
        .order_by(Todo.created_at.desc())
    )
    return list(result)


@router.get("/{todo_id}", response_model=TodoRead)
async def get_todo(
    todo_id: uuid.UUID,
    ctx: CurrentContext = Depends(get_current_context),
    session: AsyncSession = Depends(get_session),
) -> Todo:
    return await _get_owned_todo(todo_id, ctx, session)


@router.patch("/{todo_id}", response_model=TodoRead)
async def update_todo(
    todo_id: uuid.UUID,
    body: TodoUpdate,
    ctx: CurrentContext = Depends(get_current_context),
    session: AsyncSession = Depends(get_session),
) -> Todo:
    todo = await _get_owned_todo(todo_id, ctx, session)

    data = body.model_dump(exclude_unset=True)

    # Mantener coherentes is_done <-> completed_at / completed_by.
    if "is_done" in data:
        if data["is_done"]:
            todo.completed_at = datetime.now(timezone.utc)
            todo.completed_by = ctx.user_id
        else:
            todo.completed_at = None
            todo.completed_by = None

    for field, value in data.items():
        setattr(todo, field, value)

    await session.commit()
    await session.refresh(todo)
    return todo


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(
    todo_id: uuid.UUID,
    ctx: CurrentContext = Depends(get_current_context),
    session: AsyncSession = Depends(get_session),
) -> None:
    todo = await _get_owned_todo(todo_id, ctx, session)
    await session.delete(todo)
    await session.commit()
