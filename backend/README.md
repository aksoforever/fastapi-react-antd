# Backend

后端使用：

- FastAPI
- SQLModel
- PostgreSQL
- Alembic
- JWT 鉴权

## 环境准备

```bash
cd backend
uv sync
source .venv/bin/activate
```

确保项目根目录的 `.env` 已配置好 PostgreSQL 和管理员信息。

## 启动后端

```bash
cd backend
source .venv/bin/activate
fastapi dev app/main.py
```

默认地址：

- API: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

## 数据库迁移

执行迁移：

```bash
cd backend
source .venv/bin/activate
alembic upgrade head
```

生成新迁移：

```bash
cd backend
source .venv/bin/activate
alembic revision --autogenerate -m "your migration message"
```

## 初始化管理员

管理员通过 `.env` 中的以下变量创建：

```env
FIRST_SUPERUSER=admin@example.com
FIRST_SUPERUSER_PASSWORD=change-this
```

执行：

```bash
cd backend
source .venv/bin/activate
python -m app.initial_data
```

说明：

- 仅当该邮箱不存在时才会创建
- 不会覆盖已有用户的密码

## 测试和检查

运行测试：

```bash
cd backend
source .venv/bin/activate
bash scripts/test.sh
```

运行语法检查：

```bash
cd backend
source .venv/bin/activate
python -m compileall app
```

## 主要模块

- `app/main.py`：FastAPI 入口
- `app/api/`：路由与依赖
- `app/domains/users/`：用户域
- `app/domains/items/`：items 域
- `app/core/`：配置、数据库、鉴权
- `app/alembic/`：迁移文件
