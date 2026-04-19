# FastAPI React Antd

一个用于个人维护的后台系统：

- 后端：FastAPI + SQLModel + PostgreSQL + Alembic
- 前端：React + Vite + Ant Design
- 鉴权：JWT
- 功能：管理员管理用户，用户管理自己的 items

## 主要功能

- 管理员登录
- 用户管理
- Items CRUD
- 个人资料修改
- 密码修改
- OpenAPI 自动生成前端 client

## 目录

- `backend/`：FastAPI 后端
- `frontend/`：React 前端
- `.env`：本地环境变量

## 本地开发

### 1. 准备环境变量

复制一份示例配置：

```bash
cp .env.example .env
```

至少确认这些变量：

```env
SECRET_KEY=change-this
FIRST_SUPERUSER=admin@example.com
FIRST_SUPERUSER_PASSWORD=change-this
POSTGRES_SERVER=localhost
POSTGRES_PORT=5432
POSTGRES_DB=full_stack_fastapi
POSTGRES_USER=your_pg_user
POSTGRES_PASSWORD=your_pg_password
```

### 2. 启动后端

```bash
cd backend
uv sync
source .venv/bin/activate
alembic upgrade head
python -m app.initial_data
fastapi dev app/main.py
```

后端地址：

- API: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 3. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端地址：

- Web: [http://localhost:5173](http://localhost:5173)

默认情况下，前端会请求：

- `VITE_API_URL`
- 如果没有配置，则回退到 `http://127.0.0.1:8000`

## 初始化管理员

管理员账号由 `backend/app/initial_data.py` 初始化。

使用 `.env` 中的这两个变量：

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

- 如果该邮箱不存在，会创建一个管理员
- 如果该邮箱已经存在，不会重复创建，也不会重置密码

## 生成前端 API Client

当后端接口有变更时，重新生成前端 client：

```bash
cd backend
.venv/bin/python -c 'import app.main; import json; print(json.dumps(app.main.app.openapi()))' > ../frontend/openapi.json

cd ../frontend
npm run generate-client
npx biome format --write ./src/client
```

## 常用命令

后端：

```bash
cd backend
uv sync
source .venv/bin/activate
alembic upgrade head
python -m app.initial_data
fastapi dev app/main.py
```

前端：

```bash
cd frontend
npm install
npm run dev
npm run build
```

## 说明

- 项目不再使用 Docker 作为默认开发方式
- 不再提供注册、找回密码、邮件发送相关功能
- 当前用户体系为：管理员创建用户，用户自行登录使用
