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

    # ── Get unique completed moduleIds ──────────────────────────────────────
    module_ids_raw = list({str(c.get("moduleId", "")) for c in completions if c.get("moduleId")})
    module_oids = []
    for mid in module_ids_raw:
        try:
            module_oids.append(ObjectId(mid))
        except Exception:
            module_oids.append(mid)

    # ── Fetch only the completed modules ────────────────────────────────────
    modules_col = db["modules"]
    completed_modules = await modules_col.find(
        {"_id": {"$in": module_oids}, "type": "content"}
    ).to_list(length=200)

    if not completed_modules:
        return {
            "week_start": week_start_ist,
            "week_end": week_end_ist,
            "topics": [],
            "error": "No content modules found for your completions.",
        }

    # ── Group completed modules by topicSlug ────────────────────────────────
    from collections import defaultdict
    by_slug: dict = defaultdict(list)
    for mod in completed_modules:
        slug = mod.get("topicSlug", "")
        if slug:
            by_slug[slug].append(mod)

    # ── Fetch topic docs for display names ──────────────────────────────────
    topics_col = db["topics"]
    topics_docs = await topics_col.find(
        {"slug": {"$in": list(by_slug.keys())}}
    ).to_list(length=100)
    slug_to_title = {t.get("slug", ""): t.get("title", "") for t in topics_docs}

    # ── Build result — only content from completed modules ───────────────────
    result_topics = []
    for slug, mods in by_slug.items():
        topic_title = slug_to_title.get(slug, slug.replace("-", " ").title())
        module_titles = []
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
                for kp in content.get("keyPoints", [])[:5]:
                    if kp:
                        parts.append(str(kp)[:200])

            if parts:
                content_snippets.append({
                    "module_title": title,
                    "content": " ".join(parts)[:800],
                })

        # Find topic_id
        topic_doc = next((t for t in topics_docs if t.get("slug") == slug), None)
        topic_id = str(topic_doc["_id"]) if topic_doc else slug

        result_topics.append({
            "topic_id":         topic_id,
            "topic_title":      topic_title,
            "topic_slug":       slug,
            "module_titles":    module_titles,
            "content_snippets": content_snippets,
        })

    return {
        "week_start": week_start_ist,
        "week_end":   week_end_ist,
        "topics":     result_topics,
        "error":      None,
    }
