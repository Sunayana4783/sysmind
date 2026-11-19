"""
SysMind AI Backend — FastAPI entry point
Run locally:  uvicorn main:app --reload --port 8000
"""
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from dotenv import load_dotenv

load_dotenv()

from app.routes.assessment import router as assessment_router
from app.database import get_client

scheduler = AsyncIOScheduler(timezone="Asia/Kolkata")


async def scheduled_weekly_generation():
    from app.supervisor import run_assessment
    from app.database import col_completions
    from datetime import datetime, timedelta
    from zoneinfo import ZoneInfo

    IST = ZoneInfo("Asia/Kolkata")
    now = datetime.now(IST)
    monday = now - timedelta(days=now.weekday())
    monday_start = monday.replace(hour=0, minute=0, second=0, microsecond=0)
    friday_end = monday_start + timedelta(days=4, hours=23, minutes=59, seconds=59)
    monday_utc = monday_start.astimezone(ZoneInfo("UTC")).replace(tzinfo=None)
    friday_utc = friday_end.astimezone(ZoneInfo("UTC")).replace(tzinfo=None)

    pipeline = [
        {"$match": {"completedAt": {"$gte": monday_utc, "$lte": friday_utc}}},
        {"$group": {"_id": "$userId"}},
    ]
    cursor = col_completions().aggregate(pipeline)
    user_docs = await cursor.to_list(length=1000)
    user_ids = [str(d["_id"]) for d in user_docs]

    for uid in user_ids:
        try:
            await run_assessment(uid)
        except Exception as e:
            print(f"[Scheduler] Failed for user {uid}: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler.add_job(
        scheduled_weekly_generation,
        CronTrigger(day_of_week="sat", hour=0, minute=5, timezone="Asia/Kolkata"),
        id="weekly_quiz",
        replace_existing=True,
    )
    scheduler.start()
    print("[Scheduler] Weekly quiz job scheduled: Saturday 12:05 AM IST")
    yield
    scheduler.shutdown()


app = FastAPI(title="SysMind AI Assessment API", version="1.0.0", lifespan=lifespan)

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    os.getenv("FRONTEND_URL", "https://sysmind.vercel.app"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(assessment_router)


@app.get("/")
async def root():
    return {"status": "ok", "service": "SysMind AI Assessment API"}


@app.get("/health")
async def health_check():
    try:
        client = get_client()
        await client.admin.command("ping")
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {e}"
    return {"status": "ok", "database": db_status}


@app.get("/debug/topics/{user_id_param}")
async def debug_topics(user_id_param: str):
    from app.agents import agent1_history
    result = await agent1_history.run(user_id_param)
    return {
        "user_id": user_id_param,
        "topics_found": len(result["topics"]),
        "topics": [t["topic_title"] for t in result["topics"]],
        "error": result["error"],
    }
