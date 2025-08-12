from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel

from app.api.deps import SessionDep
from app.domains.users.service import UserService
from app.models import (
    UserCreate,
    UserPublic,
)

router = APIRouter(tags=["private"], prefix="/private")


class PrivateUserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    is_verified: bool = False  # 若模型无此字段，保持兼容但不入库


@router.post("/users/", response_model=UserPublic)
def create_user(user_in: PrivateUserCreate, session: SessionDep) -> Any:
    """
    Create a new user (internal).
    """
    # 将私有入参映射到正式的 UserCreate
    payload = UserCreate(
        email=user_in.email,
        password=user_in.password,
        full_name=user_in.full_name,
        # 其他可选字段由 Pydantic 默认值或你的业务默认值决定
    )
    return UserService(session).create_user(user_create=payload)
