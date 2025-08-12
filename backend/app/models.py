# app/models.py
# 统一“兼容导出”入口：别再直接在这里定义 ORM 或 Schemas

# ORM 模型
from app.domains.users.models import User  # noqa: F401
from app.domains.items.models import Item  # noqa: F401

# 用户相关 Schemas
from app.domains.users.schemas import (  # noqa: F401
    UserBase,
    UserCreate,
    UserRegister,
    UserUpdate,
    UserUpdateMe,
    UpdatePassword,
    UserPublic,
    UsersPublic,
)

# Item 相关 Schemas
from app.domains.items.schemas import (  # noqa: F401
    ItemBase,
    ItemCreate,
    ItemUpdate,
    ItemPublic,
    ItemsPublic,
)

# 通用/登录相关 Schemas
from app.schemas.common import (  # noqa: F401
    Message,
    Token,
    TokenPayload,
    NewPassword,
)

__all__ = [
    # ORM
    "User",
    "Item",
    # Users
    "UserBase",
    "UserCreate",
    "UserRegister",
    "UserUpdate",
    "UserUpdateMe",
    "UpdatePassword",
    "UserPublic",
    "UsersPublic",
    # Items
    "ItemBase",
    "ItemCreate",
    "ItemUpdate",
    "ItemPublic",
    "ItemsPublic",
    # Common
    "Message",
    "Token",
    "TokenPayload",
    "NewPassword",
]
