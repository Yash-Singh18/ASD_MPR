from sqlalchemy import select

from . import models

# category -> [(name, emoji, description, price per day, units available)]
CATALOG = {
    "Cars": [
        ("Toyota Corolla Sedan", "🚗", "Smooth hybrid sedan with great mileage.", 55, 6),
        ("Maruti Suzuki Swift", "🚗", "Easy-to-park hatchback for city trips.", 35, 8),
        ("Honda City", "🚗", "Comfortable sedan for business and long drives.", 50, 5),
        ("Hyundai Verna", "🚗", "Stylish sedan with a punchy turbo engine.", 52, 4),
        ("Porsche 911 Carrera", "🏎️", "Weekend sports car for a special occasion.", 300, 1),
    ],
    "SUVs & MPVs": [
        ("Hyundai Creta", "🚙", "Comfortable family SUV with a big boot.", 75, 5),
        ("Mahindra Thar", "🚙", "Go-anywhere 4x4 for hills and trails.", 95, 3),
        ("Tata Nexon", "🚙", "Compact SUV with a 5-star safety rating.", 65, 6),
        ("Toyota Innova", "🚐", "7-seater MPV, ideal for family trips.", 80, 4),
    ],
    "Bikes": [
        ("Royal Enfield Bullet 350", "🏍️", "Classic cruiser for relaxed highway rides.", 30, 7),
        ("KTM Duke 200", "🏍️", "Lightweight and fast naked street bike.", 28, 5),
        ("Bajaj Pulsar 150", "🏍️", "Reliable everyday commuter bike.", 18, 9),
        ("Hero Splendor", "🏍️", "Fuel-efficient and easy to ride.", 12, 12),
    ],
    "Scooters": [
        ("Honda Activa", "🛵", "Easy automatic scooter for city rides.", 12, 12),
        ("TVS Jupiter", "🛵", "Smooth, comfortable scooter with storage.", 12, 10),
        ("Vespa Classic", "🛵", "Retro-style scooter that turns heads.", 20, 4),
    ],
    "Bicycles": [
        ("Giant Hybrid Bicycle", "🚲", "Commuter bicycle with a rear pannier.", 6, 15),
        ("Hero Sprint Mountain Bike", "🚲", "Geared mountain bike for rough paths.", 8, 10),
    ],
    "Vans": [
        ("Mercedes Sprinter Van", "🚐", "12-seat van for group travel.", 140, 2),
        ("Force Traveller", "🚐", "Spacious traveller for tours and events.", 110, 3),
    ],
}


def seed(db) -> bool:
    """Fill an empty database with fake vehicles. Returns True if anything was added."""
    if db.scalar(select(models.Category.id).limit(1)):
        return False
    for cat_name, vehicles in CATALOG.items():
        cat = models.Category(name=cat_name)
        db.add(cat)
        db.flush()
        for name, emoji, description, price, stock in vehicles:
            db.add(
                models.Product(
                    name=name,
                    emoji=emoji,
                    description=description,
                    price=price,
                    stock=stock,
                    category_id=cat.id,
                )
            )
    db.commit()
    return True
