from fastapi import APIRouter

from app.domains.users.router import router as users_router
from app.domains.items.router import router as items_router

from app.api.routes.login import router as login_router
from app.api.routes.utils import router as utils_router

api_router = APIRouter()
api_router.include_router(login_router)
api_router.include_router(users_router)
api_router.include_router(utils_router)
api_router.include_router(items_router)
