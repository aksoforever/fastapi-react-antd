# backend/app/core/db.py
from sqlmodel import Session, create_engine, select

from app.core.config import settings
from app.domains.users.service import UserService
from app.models import User, UserCreate

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))

# make sure all SQLModel models are imported (app.models) before initializing DB
# otherwise, SQLModel might fail to initialize relationships properly
# for more details: https://github.com/fastapi/full-stack-fastapi-template/issues/28

def init_db(session: Session) -> None:
    # Tables should be created with Alembic migrations.
    # If you don't want to use migrations, uncomment the next lines:
    # from sqlmodel import SQLModel
    # SQLModel.metadata.create_all(engine)

    # idempotent: only create the first superuser if it doesn't exist
    user = session.exec(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    ).first()

    if not user:
        user_in = UserCreate(
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
        )
        UserService(session).create_user(user_create=user_in)
