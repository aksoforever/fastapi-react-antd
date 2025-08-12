from fastapi import APIRouter
from app.core.config import settings

# 改成引用新域的路由
from app.domains.users.router import router as users_router
from app.domains.items.router import router as items_router

# 其他横切功能的路由（login、utils、private）
from app.api.routes.login import router as login_router
from app.api.routes.utils import router as utils_router
from app.api.routes.private import router as private_router

api_router = APIRouter()
api_router.include_router(login_router)
api_router.include_router(users_router)
api_router.include_router(utils_router)
api_router.include_router(items_router)

if settings.ENVIRONMENT == "local":
    api_router.include_router(private_router)
