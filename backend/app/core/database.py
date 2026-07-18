"""
MongoDB connection manager using Motor (the async MongoDB driver).
"""
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings


class Database:
    client: AsyncIOMotorClient = None
    db = None


db_manager = Database()


async def connect_to_mongo():
    db_manager.client = AsyncIOMotorClient(settings.MONGO_URI)
    db_manager.db = db_manager.client[settings.DATABASE_NAME]

    # Indexes: enforce uniqueness and speed up common queries.
    await db_manager.db.users.create_index("email", unique=True)
    await db_manager.db.analyses.create_index("user_id")
    await db_manager.db.analyses.create_index("created_at")
    await db_manager.db.password_resets.create_index("token", unique=True)
    await db_manager.db.password_resets.create_index("expires_at", expireAfterSeconds=0)


async def close_mongo_connection():
    if db_manager.client:
        db_manager.client.close()


def get_database():
    return db_manager.db