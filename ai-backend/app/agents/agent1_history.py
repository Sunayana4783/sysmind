"""
Agent 1 — Learning History Agent
Reads from the 'progresses' collection (Mongoose Progress model).
Fields: userId (ObjectId), topicSlug (str), moduleId (ObjectId), completedAt (Date)
No LLM used — pure MongoDB queries.
"""
from __future__ import annotations
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from bson import ObjectId

from app.database import get_db

IST = ZoneInfo("Asia/Kolkata")


def _get_week_range():
    """Return (monday_utc, friday_utc, monday_ist, friday_ist) for the current week."""
    now = datetime.now(IST)
    monday = now - timedelta(days=now.weekday())
    monday_start = monday.replace(hour=0, minute=0, second=0, microsecond=0)
    friday_end = monday_start + timedelta(days=4, hours=23, minutes=59, seconds=59)
    monday_utc = monday_start.astimezone(ZoneInfo("UTC")).replace(tzinfo=None)
    friday_utc = friday_end.astimezone(ZoneInfo("UTC")).replace(tzinfo=None)
    return monday_utc, friday_utc, monday_start, friday_end


async def run(user_id: str) -> dict:
    db = get_db()
    week_start_utc, week_end_utc, week_start_ist, week_end_ist = _get_week_range()

    # Try both ObjectId and string for userId
    try:
        uid = ObjectId(user_id)
    except Exception:
        uid = user_id

    # ── Query 'progresses' collection (Mongoose pluralises 'Progress') ──────
    # Use a wide date range fallback if no results (handles timezone edge cases)
    # First try current week, then fall back to last 30 days for testing
    progresses_col = db["progresses"]

    completions = await progresses_col.find({
        "userId": uid,
        "completedAt": {"$gte": week_start_utc, "$lte": week_end_utc},
    }).to_list(length=500)

    # ── Fallback: use last 90 days for testing ───────────────────────────────
    if not completions:
        fallback_start = datetime.utcnow() - timedelta(days=90)
        completions = await progresses_col.find({
            "userId": uid,
            "completedAt": {"$gte": fallback_start},
        }).to_list(length=500)

    # ── Fallback 2: try string version of user_id ─────────────────────────────
    if not completions:
        completions = await progresses_col.find({
            "userId": str(user_id),
        }).to_list(length=500)

    if not completions:
        return {
            "week_start": week_start_ist,
            "week_end": week_end_ist,
            "topics": [],
            "error": "No topics completed this week (Mon-Fri).",
        }

    # ── Get unique topic slugs from completions ──────────────────────────────
    topic_slugs = list({c.get("topicSlug", "") for c in completions if c.get("topicSlug")})

    if not topic_slugs:
        return {
            "week_start": week_start_ist,
            "week_end": week_end_ist,
            "topics": [],
            "error": "Completions found but no topicSlug field.",
        }

    # ── Fetch topic documents by slug ────────────────────────────────────────
    topics_col = db["topics"]
    topics_docs = await topics_col.find(
        {"slug": {"$in": topic_slugs}}
    ).to_list(length=100)

    # If no topics found by slug, try 'topicSlug' field on topic doc itself
    if not topics_docs:
        topics_docs = await topics_col.find(
            {"topicSlug": {"$in": topic_slugs}}
        ).to_list(length=100)

    # ── For each topic, fetch its modules ────────────────────────────────────
    modules_col = db["modules"]
    result_topics = []

    for topic_doc in topics_docs:
        topic_id  = str(topic_doc["_id"])
        topic_title = topic_doc.get("title", "Unknown Topic")
        slug = topic_doc.get("slug") or topic_doc.get("topicSlug", "")

        # Modules can be linked by topicSlug or topicId
        mods = await modules_col.find(
            {"topicSlug": slug, "type": "content"}
        ).to_list(length=50)

        module_titles   = []
        content_snippets = []

        for mod in mods:
            title = mod.get("title", "")
            module_titles.append(title)

            parts = []
            content = mod.get("content") or {}
            if isinstance(content, dict):
                overview = content.get("overview", "")
                if overview:
                    parts.append(str(overview)[:400])
                for sec in content.get("sections", [])[:3]:
                    if isinstance(sec, dict):
                        body = sec.get("body") or sec.get("text") or ""
                        if body:
                            parts.append(str(body)[:300])

            if parts:
                content_snippets.append({
                    "module_title": title,
                    "content": " ".join(parts)[:800],
                })

        result_topics.append({
            "topic_id":        topic_id,
            "topic_title":     topic_title,
            "topic_slug":      slug,
            "module_titles":   module_titles,
            "content_snippets": content_snippets,
        })

    # If no topics matched by slug, create minimal entries from slug names
    if not result_topics:
        for slug in topic_slugs[:5]:
            result_topics.append({
                "topic_id":        slug,
                "topic_title":     slug.replace("-", " ").title(),
                "topic_slug":      slug,
                "module_titles":   [],
                "content_snippets": [],
            })

    return {
        "week_start": week_start_ist,
        "week_end":   week_end_ist,
        "topics":     result_topics,
        "error":      None,
    }
