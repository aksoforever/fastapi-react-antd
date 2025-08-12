# app/domains/items/models.py
import uuid
from typing import Optional, TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.domains.users.models import User

class Item(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=255)

    owner_id: uuid.UUID = Field(
        foreign_key="user.id",
        nullable=False,
    )

    owner: Optional["User"] = Relationship(
        back_populates="items",
        sa_relationship_kwargs={"lazy": "joined"},
    )
