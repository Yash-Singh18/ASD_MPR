from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/orders", tags=["orders"])

STATUSES = ["placed", "packed", "out_for_delivery", "delivered", "cancelled"]


@router.post("/checkout", response_model=schemas.OrderOut, status_code=201)
def checkout(body: schemas.CheckoutIn, db: Session = Depends(get_db)):
    cart = db.scalars(select(models.CartItem)).all()
    if not cart:
        raise HTTPException(400, "Cart is empty")
    order = models.Order(customer_name=body.customer_name, address=body.address)
    total = 0.0
    for ci in cart:
        p = ci.product
        if p.stock < ci.quantity:
            raise HTTPException(409, f"Not enough stock for {p.name}")
        p.stock -= ci.quantity
        total += float(p.price) * ci.quantity
        order.items.append(
            models.OrderItem(
                product_id=p.id, name=p.name, price=p.price, quantity=ci.quantity
            )
        )
        db.delete(ci)
    order.total = round(total, 2)
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@router.get("", response_model=list[schemas.OrderOut])
def list_orders(db: Session = Depends(get_db)):
    return db.scalars(select(models.Order).order_by(models.Order.id.desc())).all()


@router.get("/{order_id}", response_model=schemas.OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.get(models.Order, order_id)
    if not order:
        raise HTTPException(404, "Order not found")
    return order


@router.put("/{order_id}/status", response_model=schemas.OrderOut)
def update_status(order_id: int, body: schemas.OrderStatusUpdate, db: Session = Depends(get_db)):
    order = db.get(models.Order, order_id)
    if not order:
        raise HTTPException(404, "Order not found")
    if body.status not in STATUSES:
        raise HTTPException(422, f"status must be one of {STATUSES}")
    order.status = body.status
    if body.status == "delivered":
        order.eta_minutes = 0
    db.commit()
    db.refresh(order)
    return order


@router.delete("/{order_id}", status_code=204)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.get(models.Order, order_id)
    if not order:
        raise HTTPException(404, "Order not found")
    db.delete(order)
    db.commit()
    return Response(status_code=204)
