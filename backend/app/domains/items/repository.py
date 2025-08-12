# app/domains/items/repository.py
import uuid
from typing import Optional

from sqlmodel import Session

from .models import Item


class ItemRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, *, owner_id: uuid.UUID, title: str, description: Optional[str] = None) -> Item:
        obj = Item(owner_id=owner_id, title=title, description=description)
        self.session.add(obj)
        self.session.commit()
        self.session.refresh(obj)
        return obj
