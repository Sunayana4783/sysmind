"""
Run this locally to see exactly what's in MongoDB.
python debug_check.py
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

async def main():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client["authlogin"]

    print("\n=== ALL COLLECTIONS ===")
    cols = await db.list_collection_names()
    for c in sorted(cols):
        count = await db[c].count_documents({})
        print(f"  {c}: {count} documents")

    print("\n=== SAMPLE FROM 'progresses' ===")
    docs = await db["progresses"].find().limit(3).to_list(3)
    for d in docs:
        print(d)

    print("\n=== SAMPLE FROM 'progress' ===")
    docs2 = await db["progress"].find().limit(3).to_list(3)
    for d in docs2:
        print(d)

    print("\n=== SAMPLE FROM 'topic_completions' ===")
    docs3 = await db["topic_completions"].find().limit(3).to_list(3)
    for d in docs3:
        print(d)

    print("\n=== SAMPLE FROM 'topics' (first 3) ===")
    topics = await db["topics"].find().limit(3).to_list(3)
    for t in topics:
        print({"_id": t["_id"], "title": t.get("title"), "slug": t.get("slug"), "topicSlug": t.get("topicSlug")})

asyncio.run(main())
