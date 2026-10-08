import random

from faker import Faker
from sqlalchemy import select

from . import models

CATALOG = {
    "Fruits & Vegetables": [("Banana", "🍌"), ("Apple", "🍎"), ("Tomato", "🍅"), ("Onion", "🧅"), ("Potato", "🥔")],
    "Dairy & Eggs": [("Milk 1L", "🥛"), ("Eggs (12)", "🥚"), ("Butter", "🧈"), ("Cheese Slices", "🧀")],
    "Snacks": [("Potato Chips", "🍟"), ("Chocolate Bar", "🍫"), ("Popcorn", "🍿"), ("Cookies", "🍪")],
    "Beverages": [("Orange Juice", "🧃"), ("Cola", "🥤"), ("Green Tea", "🍵"), ("Coffee Beans", "☕")],
    "Bakery": [("Bread Loaf", "🍞"), ("Croissant", "🥐"), ("Bagel", "🥯")],
}


def seed(db) -> bool:
    """Fill an empty database with fake data. Returns True if anything was added."""
    if db.scalar(select(models.Category.id).limit(1)):
        return False
    fake = Faker()
    Faker.seed(42)
    random.seed(42)
    for cat_name, items in CATALOG.items():
        cat = models.Category(name=cat_name)
        db.add(cat)
        db.flush()
        for name, emoji in items:
            db.add(
                models.Product(
                    name=name,
                    emoji=emoji,
                    description=fake.sentence(nb_words=8),
                    price=round(random.uniform(0.5, 12), 2),
                    stock=random.randint(10, 100),
                    category_id=cat.id,
                )
            )
    db.commit()
    return True
