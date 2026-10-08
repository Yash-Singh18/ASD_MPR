from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=list[schemas.CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return db.scalars(select(models.Category).order_by(models.Category.name)).all()


@router.post("", response_model=schemas.CategoryOut, status_code=201)
def create_category(body: schemas.CategoryIn, db: Session = Depends(get_db)):
    if db.scalar(select(models.Category).where(models.Category.name == body.name)):
        raise HTTPException(409, "Category already exists")
    cat = models.Category(name=body.name)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@router.get("/{category_id}", response_model=schemas.CategoryOut)
def get_category(category_id: int, db: Session = Depends(get_db)):
    cat = db.get(models.Category, category_id)
    if not cat:
        raise HTTPException(404, "Category not found")
    return cat


@router.put("/{category_id}", response_model=schemas.CategoryOut)
def update_category(category_id: int, body: schemas.CategoryIn, db: Session = Depends(get_db)):
    cat = db.get(models.Category, category_id)
    if not cat:
        raise HTTPException(404, "Category not found")
    cat.name = body.name
    db.commit()
    db.refresh(cat)
    return cat


@router.delete("/{category_id}", status_code=204)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    cat = db.get(models.Category, category_id)
    if not cat:
        raise HTTPException(404, "Category not found")
    for p in cat.products:
        p.category_id = None
    db.delete(cat)
    db.commit()
    return Response(status_code=204)
