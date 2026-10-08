from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/products", tags=["products"])


def _check_category(db: Session, category_id: int | None):
    if category_id is not None and not db.get(models.Category, category_id):
        raise HTTPException(422, "Unknown category_id")


@router.get("", response_model=list[schemas.ProductOut])
def list_products(
    q: str | None = Query(None, description="Search in name"),
    category_id: int | None = None,
    db: Session = Depends(get_db),
):
    stmt = select(models.Product).order_by(models.Product.id)
    if q:
        stmt = stmt.where(models.Product.name.ilike(f"%{q}%"))
    if category_id is not None:
        stmt = stmt.where(models.Product.category_id == category_id)
    return db.scalars(stmt).all()


@router.post("", response_model=schemas.ProductOut, status_code=201)
def create_product(body: schemas.ProductIn, db: Session = Depends(get_db)):
    _check_category(db, body.category_id)
    product = models.Product(**body.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.get("/{product_id}", response_model=schemas.ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.get(models.Product, product_id)
    if not product:
        raise HTTPException(404, "Product not found")
    return product


@router.put("/{product_id}", response_model=schemas.ProductOut)
def update_product(product_id: int, body: schemas.ProductIn, db: Session = Depends(get_db)):
    product = db.get(models.Product, product_id)
    if not product:
        raise HTTPException(404, "Product not found")
    _check_category(db, body.category_id)
    for key, value in body.model_dump().items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=204)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.get(models.Product, product_id)
    if not product:
        raise HTTPException(404, "Product not found")
    db.query(models.CartItem).filter_by(product_id=product_id).delete()
    db.delete(product)
    db.commit()
    return Response(status_code=204)
