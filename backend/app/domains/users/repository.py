# app/domains/users/repository.py
from typing import Any

from sqlmodel import Session, select

from .models import User


class UserRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(
        self,
        *,
        email: str,
        hashed_password: str,
        full_name: str | None = None,
        is_active: bool = True,
        is_superuser: bool = False,
    ) -> User:
        obj = User(
            email=email,
            hashed_password=hashed_password,
            full_name=full_name,
            is_active=is_active,
            is_superuser=is_superuser,
        )
        self.session.add(obj)
        self.session.commit()
        self.session.refresh(obj)
        return obj

    def update(self, *, db_user: User, data: dict[str, Any], extra: dict[str, Any] | None = None) -> User:
        db_user.sqlmodel_update(data, update=extra or {})
        self.session.add(db_user)
        self.session.commit()
        self.session.refresh(db_user)
        return db_user

    def get_by_email(self, *, email: str) -> User | None:
        stmt = select(User).where(User.email == email)
        return self.session.exec(stmt).first()
