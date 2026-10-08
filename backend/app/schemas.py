from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ORM(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class CategoryIn(BaseModel):
    name: str = Field(min_length=1, max_length=80)


class CategoryOut(ORM, CategoryIn):
    id: int


class ProductIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: str = ""
    emoji: str = "🛒"
    price: float = Field(gt=0)
    stock: int = Field(ge=0, default=0)
    category_id: int | None = None


class ProductOut(ORM, ProductIn):
    id: int
    category: CategoryOut | None = None


class CartItemIn(BaseModel):
    product_id: int
    quantity: int = Field(ge=1, default=1)


class CartItemUpdate(BaseModel):
    quantity: int = Field(ge=1)


class CartItemOut(ORM):
    id: int
    quantity: int
    product: ProductOut


class CartOut(BaseModel):
    items: list[CartItemOut]
    total: float


class CheckoutIn(BaseModel):
    customer_name: str = Field(min_length=1, max_length=120)
    address: str = Field(min_length=1, max_length=255)
    fake_card: str = "4242 4242 4242 4242"


class OrderItemOut(ORM):
    id: int
    product_id: int | None
    name: str
    price: float
    quantity: int


class OrderOut(ORM):
    id: int
    customer_name: str
    address: str
    status: str
    total: float
    eta_minutes: int
    created_at: datetime
    items: list[OrderItemOut]


class OrderStatusUpdate(BaseModel):
    status: str
