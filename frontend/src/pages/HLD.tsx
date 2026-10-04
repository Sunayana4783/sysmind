import React from 'react';
import { useNavigate } from 'react-router-dom';
import LearningNav from '../components/LearningNav';
import '../styles/learning-theme.css';
import './HLD.css';

interface HLDTopic {
  id: string;
  title: string;
  locked: boolean;
  route?: string;
  icon: string;
  description: string;
}

const HLD_TOPICS: HLDTopic[] = [
  {
    id: 'system-architecture',
    title: 'System Architecture',
    locked: true,
    icon: '🏛️',
    description: 'Monolithic, SOA, microservices and serverless patterns.',
  },
  {
    id: 'scalability',
    title: 'Scalability',
    locked: true,
    icon: '📈',
    description: 'Horizontal vs vertical scaling, capacity planning.',
  },
  {
    id: 'load-balancing',
    title: 'Load Balancing',
    locked: true,
    icon: '⚖️',
    description: 'Round-robin, least connections, consistent hashing.',
  },
  {
    id: 'database-design',
    title: 'Database Design',
    locked: true,
    icon: '🗄️',
    description: 'SQL vs NoSQL, sharding, replication, CAP theorem.',
  },
  {
    id: 'microservices',
    title: 'Microservices',
    locked: true,
    icon: '🔲',
    description: 'Service decomposition, inter-service communication.',
  },
  {
    id: 'caching',
    title: 'Caching',
    locked: false,
    route: '/learning/hld/caching',
    icon: '⚡',
    description: 'Cache strategies, Redis, distributed caching, eviction policies.',
  },
  {
    id: 'api-gateway',
    title: 'API Gateway',
    locked: true,
    icon: '🔀',
    description: 'Rate limiting, auth, routing, and aggregation.',
  },
  {
    id: 'message-queues',
    title: 'Message Queues',
    locked: true,
    icon: '📨',
    description: 'Kafka, RabbitMQ, async processing, event-driven design.',
  },
  {
    id: 'cdn',
    title: 'CDN',
    locked: true,
    icon: '🌐',
    description: 'Content delivery networks, edge caching, geo-distribution.',
  },
  {
    id: 'distributed-systems',
    title: 'Distributed Systems',
    locked: true,
    icon: '🕸️',
    description: 'Consensus, fault tolerance, distributed transactions.',
  },
];

const HLD = () => {
  const navigate = useNavigate();

  const handleClick = (topic: HLDTopic) => {
    if (!topic.locked && topic.route) navigate(topic.route);
  };

  return (
    <div className="learn-root">
      <LearningNav />

      <main className="hld-page">
        {/* Breadcrumb */}
        <nav className="hld-breadcrumb" aria-label="breadcrumb">
          <button className="hld-breadcrumb__back" onClick={() => navigate('/learning')}>
            ← Learning Interface
          </button>
          <span className="hld-breadcrumb__sep">/</span>
          <span className="hld-breadcrumb__current">HLD</span>
        </nav>

        <header className="hld-page__header">
          <div className="hld-page__badge">High Level Design</div>
          <h1 className="hld-page__title">HLD Topics</h1>
          <p className="hld-page__subtitle">
            Start with <strong>Caching</strong> — the only unlocked topic. More topics unlock as you progress.
          </p>
        </header>

        <div className="hld-topics">
          {HLD_TOPICS.map((topic) => (
            <div
              key={topic.id}
              className={`hld-topic${topic.locked ? ' hld-topic--locked' : ' hld-topic--unlocked'}`}
              onClick={() => handleClick(topic)}
              role={topic.locked ? 'presentation' : 'button'}
              tabIndex={topic.locked ? -1 : 0}
              onKeyDown={(e) => e.key === 'Enter' && handleClick(topic)}
              aria-label={topic.locked ? `${topic.title} — locked` : `${topic.title} — start`}
            >
              <div className="hld-topic__left">
                <span className="hld-topic__icon">{topic.icon}</span>
                <div className="hld-topic__info">
                  <span className="hld-topic__title">{topic.title}</span>
                  <span className="hld-topic__desc">{topic.description}</span>
                </div>
              </div>

              <div className="hld-topic__right">
                {topic.locked ? (
                  <span className="hld-topic__badge hld-topic__badge--locked">🔒 Locked</span>
                ) : (
                  <span className="hld-topic__badge hld-topic__badge--unlocked">✅ Start</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HLD;
