"""SQLAlchemy database configuration and session dependency."""

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from config import settings


SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL
connect_args = (
    {"check_same_thread": False}
    if SQLALCHEMY_DATABASE_URL.startswith("sqlite")
    else {}
)
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Yield a request-scoped database session and always close it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
