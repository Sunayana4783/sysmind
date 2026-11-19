import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

_client: AsyncIOMotorClient = None

def get_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
    return _client

def get_db():
    return get_client()["authlogin"]

# Collection accessors
def col_users():           return get_db()["users"]
def col_topics():          return get_db()["topics"]
def col_modules():         return get_db()["modules"]
def col_completions():     return get_db()["progresses"]   # Mongoose Progress model → 'progresses'
def col_assessments():     return get_db()["weekly_assessments"]
def col_questions():       return get_db()["assessment_questions"]
def col_attempts():        return get_db()["assessment_attempts"]
def col_results():         return get_db()["assessment_results"]
