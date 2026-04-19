# Development

## Local URLs

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

## Recommended workflow

### Backend

```bash
cd backend
uv sync
source .venv/bin/activate
alembic upgrade head
python -m app.initial_data
fastapi dev app/main.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Notes

- 本项目默认使用本地直接运行，不使用 Docker
- 前端默认请求 `http://127.0.0.1:8000`
- 如需修改后端地址，可设置 `VITE_API_URL`
