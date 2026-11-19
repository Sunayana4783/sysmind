import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from bson import ObjectId
from datetime import datetime, timedelta

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

async def main():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client["authlogin"]
    uid = ObjectId("6abe5bbe034a0374db76629e")

    # Show sample completions
    samples = await db["progresses"].find({"userId": uid}).limit(5).to_list(5)
    print("=== SAMPLE COMPLETIONS ===")
    for s in samples:
        print(f"  topicSlug={s.get('topicSlug')}  completedAt={s.get('completedAt')}")

    # Check 90-day range
    cutoff = datetime.utcnow() - timedelta(days=90)
    count_90 = await db["progresses"].count_documents({
        "userId": uid,
        "completedAt": {"$gte": cutoff}
    })
    print(f"\nCompletions in last 90 days: {count_90}")
    print(f"UTC now: {datetime.utcnow()}")
    print(f"90-day cutoff: {cutoff}")

asyncio.run(main())
