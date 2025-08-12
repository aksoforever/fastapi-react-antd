# app/schemas/common.py
from sqlmodel import SQLModel


class Message(SQLModel):
    message: str


class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    # /api/v1/reset-password/ 使用到
    token: str
    new_password: str = ""
