from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session

from app import models
from app.database import Base
from app.seed import seed


def test_seed_is_idempotent():
    engine = create_engine("sqlite://")
    Base.metadata.create_all(engine)
    with Session(engine) as db:
        assert seed(db) is True
        count = len(db.scalars(select(models.Product)).all())
        assert count > 10
        assert seed(db) is False
        assert len(db.scalars(select(models.Product)).all()) == count
