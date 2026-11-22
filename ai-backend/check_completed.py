import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from bson import ObjectId
from datetime import datetime, timedelta

load_dotenv()

async def main():
    db = AsyncIOMotorClient(os.getenv('MONGO_URI'))['authlogin']
    uid = ObjectId('6abe5bbe034a0374db76629e')

    cutoff = datetime.utcnow() - timedelta(days=90)
    completions = await db['progresses'].find({
        'userId': uid,
        'completedAt': {'$gte': cutoff}
    }).to_list(500)

    print(f'Total completions in last 90 days: {len(completions)}')

    module_ids = [c['moduleId'] for c in completions if c.get('moduleId')]
    modules = await db['modules'].find({
        '_id': {'$in': module_ids},
        'type': 'content'
    }).to_list(200)

    print(f'Content modules found: {len(modules)}')
    print()
    print('=== COMPLETED CONTENT MODULES ===')
    by_topic = {}
    for m in modules:
        slug = m.get('topicSlug', 'unknown')
        if slug not in by_topic:
            by_topic[slug] = []
        by_topic[slug].append(m.get('title', ''))

    for slug, titles in sorted(by_topic.items()):
        print(f'\n  Topic: {slug} ({len(titles)} modules)')
        for t in titles:
            print(f'    - {t}')

asyncio.run(main())
