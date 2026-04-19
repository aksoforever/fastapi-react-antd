# Frontend

前端使用：

- React
- Vite
- TypeScript
- Ant Design
- TanStack Router
- TanStack Query

## 安装与启动

```bash
cd frontend
npm install
npm run dev
```

默认地址：

- Web: [http://localhost:5173](http://localhost:5173)

## API 地址

前端读取 `VITE_API_URL` 作为后端地址。

如果没有配置，会默认请求：

```env
http://127.0.0.1:8000
```

如果你想显式配置，可以在 `frontend/.env` 中写：

```env
VITE_API_URL=http://127.0.0.1:8000
```

## 构建

```bash
cd frontend
npm run build
```

## 生成 API Client

当前前端 client 由后端 OpenAPI 生成。

在项目根目录执行：

```bash
cd backend
.venv/bin/python -c 'import app.main; import json; print(json.dumps(app.main.app.openapi()))' > ../frontend/openapi.json

cd ../frontend
npm run generate-client
npx biome format --write ./src/client
```

## 主要目录

- `src/routes/`：路由
- `src/features/`：页面级功能模块
- `src/layout/`：导航和布局
- `src/client/`：OpenAPI 生成代码
- `src/hooks/`：通用 hooks
