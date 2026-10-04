const express = require('express');
const Groq = require('groq-sdk');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Initialise the Groq client lazily — server still starts without a key,
// the endpoint just returns a 503 until the key is configured.
let groq = null;
const getGroq = () => {
  if (!groq) {
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.startsWith('gsk_your')) {
      return null;
    }
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
};

// ── Valid caching topics ──────────────────────────────────────────────────────
const VALID_TOPICS = [
  'cache-basics',
  'cache-architecture',
  'cache-aside',
  'read-write-strategies',
  'eviction',
  'invalidation',
  'consistency',
  'redis',
  'distributed-cache',
  'cache-stampede',
];

const TOPIC_LABELS = {
  'cache-basics':          'Cache Basics',
  'cache-architecture':    'Cache Architecture',
  'cache-aside':           'Cache-Aside Pattern',
  'read-write-strategies': 'Read/Write Strategies',
  'eviction':              'Eviction (LRU/LFU/TTL)',
  'invalidation':          'Cache Invalidation',
  'consistency':           'Cache Consistency',
  'redis':                 'Redis',
  'distributed-cache':     'Distributed Cache',
  'cache-stampede':        'Cache Stampede / Penetration / Avalanche',
};

// ── POST /api/rag/caching ─────────────────────────────────────────────────────
// Body:    { topic: "cache-basics" }
// Returns: { topic, title, description, example, keyPoints, animationData }
router.post('/caching', protect, async (req, res) => {
  const { topic } = req.body;

  if (!topic || !VALID_TOPICS.includes(topic)) {
    return res.status(400).json({
      message: `Invalid topic. Must be one of: ${VALID_TOPICS.join(', ')}`,
    });
  }

  const client = getGroq();
  if (!client) {
    return res.status(503).json({
      message:
        'Groq API key is not configured. Please add GROQ_API_KEY to backend/.env. Get a free key at console.groq.com',
    });
  }

  const topicLabel = TOPIC_LABELS[topic];

  const systemPrompt = `You are an expert system design educator specialising in distributed systems and caching.
Produce concise, accurate, beginner-friendly learning content for a software engineering student.
Always respond with valid JSON only — no markdown fences, no extra text outside the JSON object.`;

  const userPrompt = `Produce learning content for the caching topic: "${topicLabel}".

Return a JSON object with exactly these fields:
{
  "topic": "${topic}",
  "title": "display title for this topic",
  "description": "2-3 paragraph explanation suitable for a junior engineer. Use plain language. Separate paragraphs with a newline character.",
  "example": "A concrete real-world example (e.g. how Twitter/Instagram/Netflix uses this concept). 3-5 sentences.",
  "keyPoints": ["point 1", "point 2", "point 3", "point 4", "point 5"],
  "animationData": {
    "type": "flow",
    "steps": [
      { "label": "step label", "description": "what happens in this step (max 15 words)", "highlight": false }
    ]
  }
}

Rules:
- animationData.steps must have between 3 and 6 steps.
- Each step description must be under 15 words.
- keyPoints must have exactly 5 items.
- Do not include any text outside the JSON object.`;

  try {
    const completion = await client.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt },
      ],
      temperature: 0.4,
      max_tokens: 1200,
      // Note: do NOT pass response_format here — not supported on all Groq models
    });

    const raw = completion.choices[0].message.content;

    // Strip any accidental markdown fences the model may have added
    const cleaned = raw.trim().replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim();
    const data = JSON.parse(cleaned);

    res.status(200).json(data);
  } catch (error) {
    console.error('RAG/Groq error:', error?.message || error);

    if (error?.status === 429) {
      return res.status(429).json({ message: 'Groq rate limit reached. Please try again shortly.' });
    }
    if (error?.status === 401) {
      return res.status(401).json({ message: 'Groq API key is invalid. Check GROQ_API_KEY in .env' });
    }
    if (error instanceof SyntaxError) {
      return res.status(500).json({ message: 'Groq returned malformed JSON. Please retry.' });
    }

    res.status(500).json({ message: 'Failed to generate learning content. Please try again.' });
  }
});

module.exports = router;
