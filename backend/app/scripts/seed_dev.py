"""Siembra los datos de desarrollo que el stub get_current_context() asume.

Inserta (de forma idempotente) la `family` y el `app_user` con los IDs fijos
DEV_FAMILY_ID / DEV_USER_ID, más la fila `family_member` que los enlaza. Sin
estas filas, el primer POST /todos falla por las foreign keys.

Correr desde backend/ con el venv activado:
    python -m app.scripts.seed_dev
"""
import asyncio

from sqlalchemy import select

from app.core.database import async_session
from app.core.deps import DEV_FAMILY_ID, DEV_USER_ID
from app.models.enums import MemberRole
from app.models.family import Family
from app.models.user import AppUser, FamilyMember


async def seed() -> None:
    async with async_session() as session:
        # --- Family ---------------------------------------------------------
        family = await session.get(Family, DEV_FAMILY_ID)
        if family is None:
            family = Family(id=DEV_FAMILY_ID, name="Dev Family")
            session.add(family)
            print(f"+ family {DEV_FAMILY_ID} creada")
        else:
            print(f"= family {DEV_FAMILY_ID} ya existe")

        # --- AppUser --------------------------------------------------------
        user = await session.get(AppUser, DEV_USER_ID)
        if user is None:
            user = AppUser(
                id=DEV_USER_ID,
                google_sub="dev-google-sub",
                email="dev@example.com",
                display_name="Dev User",
            )
            session.add(user)
            print(f"+ app_user {DEV_USER_ID} creado")
        else:
            print(f"= app_user {DEV_USER_ID} ya existe")

        # --- FamilyMember (enlaza user <-> family) --------------------------
        existing_member = await session.scalar(
            select(FamilyMember).where(
                FamilyMember.family_id == DEV_FAMILY_ID,
                FamilyMember.user_id == DEV_USER_ID,
            )
        )
        if existing_member is None:
            session.add(
                FamilyMember(
                    family_id=DEV_FAMILY_ID,
                    user_id=DEV_USER_ID,
                    role=MemberRole.owner,
                )
            )
            print("+ family_member (owner) creado")
        else:
            print("= family_member ya existe")

        await session.commit()
        print("seed listo OK")


if __name__ == "__main__":
    asyncio.run(seed())
