# app/domains/items/service.py
import uuid
from sqlmodel import Session

from app.domains.items.repository import ItemRepository
from app.domains.items.schemas import ItemCreate
from app.domains.items.models import Item


class ItemService:
    """业务逻辑：创建 Item 等"""
    def __init__(self, session: Session):
        self.repo = ItemRepository(session)

    def create_item(self, *, item_in: ItemCreate, owner_id: uuid.UUID) -> Item:
        return self.repo.create(
            owner_id=owner_id,
            title=item_in.title,
            description=item_in.description,
        )
