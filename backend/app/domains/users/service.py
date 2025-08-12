# app/domains/users/service.py
from typing import Any
from sqlmodel import Session

from app.core.security import get_password_hash, verify_password
from app.domains.users.repository import UserRepository
from app.domains.users.schemas import UserCreate, UserUpdate
from app.domains.users.models import User


class UserService:
    """业务逻辑：注册、更新、认证"""
    def __init__(self, session: Session):
        self.repo = UserRepository(session)

    def create_user(self, *, user_create: UserCreate) -> User:
        hashed = get_password_hash(user_create.password)
        return self.repo.create(
            email=user_create.email,
            hashed_password=hashed,
            full_name=user_create.full_name,
            is_active=user_create.is_active,
            is_superuser=user_create.is_superuser,
        )

    def update_user(self, *, db_user: User, user_in: UserUpdate) -> User:
        data = user_in.model_dump(exclude_unset=True)
        extra: dict[str, Any] = {}
        if "password" in data and data["password"] is not None:
            extra["hashed_password"] = get_password_hash(data.pop("password"))
        return self.repo.update(db_user=db_user, data=data, extra=extra)

    def get_by_email(self, *, email: str) -> User | None:
        return self.repo.get_by_email(email=email)

    def authenticate(self, *, email: str, password: str) -> User | None:
        user = self.repo.get_by_email(email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user
