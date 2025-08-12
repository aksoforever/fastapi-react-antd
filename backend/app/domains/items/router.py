from __future__ import annotations
import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.domains.items.service import ItemService
from app.models import Item, ItemCreate, ItemPublic, ItemsPublic, ItemUpdate, Message

router = APIRouter(prefix="/items", tags=["items"])


@router.get("/", response_model=ItemsPublic)
def read_items(session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100) -> Any:
    if current_user.is_superuser:
        count = session.exec(select(func.count()).select_from(Item)).one()
        items = session.exec(select(Item).offset(skip).limit(limit)).all()
    else:
        count = session.exec(
            select(func.count()).select_from(Item).where(Item.owner_id == current_user.id)
        ).one()
        items = session.exec(
            select(Item).where(Item.owner_id == current_user.id).offset(skip).limit(limit)
        ).all()
    return ItemsPublic(data=items, count=count)


@router.get("/{id}", response_model=ItemPublic)
def read_item(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    item = session.get(Item, id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if not current_user.is_superuser and (item.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return item


@router.post("/", response_model=ItemPublic)
def create_item(*, session: SessionDep, current_user: CurrentUser, item_in: ItemCreate) -> Any:
    return ItemService(session).create_item(item_in=item_in, owner_id=current_user.id)


@router.put("/{id}", response_model=ItemPublic)
def update_item(*, session: SessionDep, current_user: CurrentUser, id: uuid.UUID, item_in: ItemUpdate) -> Any:
    item = session.get(Item, id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if not current_user.is_superuser and (item.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    item.sqlmodel_update(item_in.model_dump(exclude_unset=True))
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


@router.delete("/{id}")
def delete_item(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Message:
    item = session.get(Item, id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if not current_user.is_superuser and (item.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    session.delete(item)
    session.commit()
    return Message(message="Item deleted successfully")
