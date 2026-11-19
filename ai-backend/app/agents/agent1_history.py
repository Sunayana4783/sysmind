"""
Agent 1 — Learning History Agent
Retrieves topics completed Mon-Fri for the given user.
No LLM used — pure MongoDB queries.
"""
from __future__ import annotations
import asyncio
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from bson import ObjectId

from app.database import col_completions, col_topics, col_modules

IST = ZoneInfo("Asia/Kolkata")


def _get_week_range(reference: datetime | None = None):
    """Return (monday_00:00_UTC, friday_23:59_UTC) for the current/given week."""
    now = reference or datetime.now(IST)
    # Monday of this week
    monday = now - timedelta(days=now.weekday())
    monday_start = monday.replace(hour=0, minute=0, second=0, microsecond=0)
    friday_end = monday_start + timedelta(days=4, hours=23, minutes=59, seconds=59)
    # Convert to UTC for MongoDB queries
    monday_utc = monday_start.astimezone(ZoneInfo("UTC")).replace(tzinfo=None)
    friday_utc = friday_end.astimezone(ZoneInfo("UTC")).replace(tzinfo=None)
    return monday_utc, friday_utc, monday_start, friday_end


async def run(user_id: str) -> dict:
    """
    Returns:
      {
        "week_start": datetime,
        "week_end": datetime,
        "topics": [ { topic_id, topic_title, modules: [...], content_snippets: [...] } ],
        "error": str | None
      }
    """
    week_start_utc, week_end_utc, week_start_ist, week_end_ist = _get_week_range()

    # 1. Find completions for this user in Mon-Fri window
    try:
        uid = ObjectId(user_id)
    except Exception:
        uid = user_id  # fallback if stored as string

    completions_cursor = col_completions().find({
        "userId": uid,
        "completedAt": {"$gte": week_start_utc, "$lte": week_end_utc},
    })
    completions = await completions_cursor.to_list(length=200)

    if not completions:
        return {
            "week_start": week_start_ist,
            "week_end": week_end_ist,
            "topics": [],
            "error": "No topics completed this week (Mon-Fri).",
        }

    # 2. Collect unique topic IDs from completions
    topic_ids_raw = list({str(c.get("topicId", "")) for c in completions if c.get("topicId")})
    if not topic_ids_raw:
        return {
            "week_start": week_start_ist,
            "week_end": week_end_ist,
            "topics": [],
            "error": "Completions found but no topicId fields.",
        }

    # Try ObjectId conversion
    topic_oids = []
    for tid in topic_ids_raw:
        try:
            topic_oids.append(ObjectId(tid))
        except Exception:
            topic_oids.append(tid)

    # 3. Fetch topic documents
    topics_cursor = col_topics().find({"_id": {"$in": topic_oids}})
    topics_docs = await topics_cursor.to_list(length=100)

    # 4. For each topic, fetch its modules and extract content
    result_topics = []
    for topic_doc in topics_docs:
        topic_id = str(topic_doc["_id"])
        topic_title = topic_doc.get("title", "Unknown Topic")
        topic_slug = topic_doc.get("slug", "")

        # Fetch modules for this topic
        modules_cursor = col_modules().find({"topicId": topic_doc["_id"]})
        modules_docs = await modules_cursor.to_list(length=50)

        content_snippets = []
        module_titles = []
        for mod in modules_docs:
            title = mod.get("title", "")
            module_titles.append(title)
            # Collect text content for LLM context
            content_parts = []
            for section in mod.get("content", []):
                if isinstance(section, dict):
                    text = section.get("text") or section.get("content") or ""
                    if text:
                        content_parts.append(str(text)[:500])
            if content_parts:
                content_snippets.append({
                    "module_title": title,
                    "content": " ".join(content_parts)[:800],
                })

        result_topics.append({
            "topic_id": topic_id,
            "topic_title": topic_title,
            "topic_slug": topic_slug,
            "module_titles": module_titles,
            "content_snippets": content_snippets,
        })

    return {
        "week_start": week_start_ist,
        "week_end": week_end_ist,
        "topics": result_topics,
        "error": None,
    }
