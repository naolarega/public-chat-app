from pydantic import BaseSettings
from bson.objectid import ObjectId
from asyncio import get_event_loop
from motor.motor_asyncio import AsyncIOMotorClient

class ChatSettings(BaseSettings):
    mongo_cs: str = "mongodb://localhost:27017"

    class Config:
        env_file = ".env"

motor_client = AsyncIOMotorClient(ChatSettings().mongo_cs)
motor_client.get_io_loop = get_event_loop
chat_service_db = motor_client.get_database("chat-service-db")
message_collection = chat_service_db.get_collection("messages")

async def add_message(message: dict):
    try:
        message["_id"] = str(ObjectId())
        result = await message_collection.insert_one(message)
        return result.insert_id
    except:
        return None

async def get_messages():
    try:
        messages = await message_collection.find(projection={ "_id": False }).to_list(None)
        return messages
    except:
        return None