"""
Run: python cleanup_quiz.py
Deletes ALL existing weekly_assessments and assessment_questions for all users.
Forces a fresh generation next time.
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

async def main():
    client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
    db = client["authlogin"]

    a = await db["weekly_assessments"].delete_many({})
    q = await db["assessment_questions"].delete_many({})
    t = await db["assessment_attempts"].delete_many({})
    r = await db["assessment_results"].delete_many({})

    print(f"Deleted: {a.deleted_count} assessments, {q.deleted_count} questions, "
          f"{t.deleted_count} attempts, {r.deleted_count} results")
    print("All users will get a fresh quiz on next generation.")

asyncio.run(main())
