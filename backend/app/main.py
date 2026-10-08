import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator

from . import models  # noqa: F401  (register tables)
from .database import Base, SessionLocal, engine
from .routers import cart, categories, orders, products
from .seed import seed


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(engine)
    if os.getenv("SEED_DATA", "true").lower() == "true":
        with SessionLocal() as db:
            seed(db)
    yield


app = FastAPI(title="QuickDrop API", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)

Instrumentator().instrument(app).expose(app, include_in_schema=False)

app.include_router(categories.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(orders.router)


@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok"}
