from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/cart", tags=["cart"])


def _cart(db: Session) -> schemas.CartOut:
    items = db.scalars(select(models.CartItem).order_by(models.CartItem.id)).all()
    total = sum(float(i.product.price) * i.quantity for i in items)
    return schemas.CartOut(
        items=[schemas.CartItemOut.model_validate(i) for i in items], total=round(total, 2)
    )


@router.get("", response_model=schemas.CartOut)
def get_cart(db: Session = Depends(get_db)):
    return _cart(db)


@router.post("/items", response_model=schemas.CartOut, status_code=201)
def add_item(body: schemas.CartItemIn, db: Session = Depends(get_db)):
    if not db.get(models.Product, body.product_id):
        raise HTTPException(404, "Product not found")
    item = db.scalar(select(models.CartItem).where(models.CartItem.product_id == body.product_id))
    if item:
        item.quantity += body.quantity
    else:
        db.add(models.CartItem(product_id=body.product_id, quantity=body.quantity))
    db.commit()
    return _cart(db)


@router.put("/items/{item_id}", response_model=schemas.CartOut)
def update_item(item_id: int, body: schemas.CartItemUpdate, db: Session = Depends(get_db)):
    item = db.get(models.CartItem, item_id)
    if not item:
        raise HTTPException(404, "Cart item not found")
    item.quantity = body.quantity
    db.commit()
    return _cart(db)


@router.delete("/items/{item_id}", response_model=schemas.CartOut)
def remove_item(item_id: int, db: Session = Depends(get_db)):
    item = db.get(models.CartItem, item_id)
    if not item:
        raise HTTPException(404, "Cart item not found")
    db.delete(item)
    db.commit()
    return _cart(db)


@router.delete("", status_code=204)
def clear_cart(db: Session = Depends(get_db)):
    db.query(models.CartItem).delete()
    db.commit()
    return Response(status_code=204)
