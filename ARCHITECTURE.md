# Muntajar — System Architecture

Production-grade AI-powered Global Mobility Platform.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 App Router, TypeScript |
| Styling | TailwindCSS, Shadcn UI (UI layer — not yet implemented) |
| ORM | Prisma |
| Database | PostgreSQL (Neon) |
| Auth | Clerk |
| Cache / Queue | Upstash Redis |
| File Storage | AWS S3 |
| AI | OpenAI GPT-4.1 / GPT-5 |
| Deployment | Vercel |

## Layered Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  app/          Route handlers, layouts (future UI pages)    │
│  components/   Shared UI primitives (Shadcn — existing)   │
│  features/     Domain modules (schemas, keys, webhooks)   │
│  hooks/        Client-side React hooks (future)             │
├─────────────────────────────────────────────────────────────┤
│  server/       Auth guards, API helpers, validation         │
├─────────────────────────────────────────────────────────────┤
│  services/     Business logic orchestration                 │
│    ├─ recommendation/  Matching + scoring + orchestration   │
│    ├─ ai/              LLM justification generation         │
│    ├─ storage/         S3 document management               │
│    ├─ cache/           Redis caching                        │
│    ├─ auth/            Clerk session resolution             │
│    ├─ profile/         User profile logic                   │
│    ├─ university/      University catalog logic             │
│    └─ application/     Application workflow                 │
├─────────────────────────────────────────────────────────────┤
│  repositories/ Data access (Prisma queries only)            │
├─────────────────────────────────────────────────────────────┤
│  lib/          Prisma client, Redis, logger, errors          │
│  config/       Environment, constants, service config       │
│  types/        Shared TypeScript contracts                  │
├─────────────────────────────────────────────────────────────┤
│  workers/      Background job processors (Redis queue)    │
│  emails/       Transactional email templates + service      │
│  prisma/       Database schema                            │
└─────────────────────────────────────────────────────────────┘
```

## Separation of Concerns

| Concern | Location | Rule |
|---------|----------|------|
| **UI** | `app/`, `components/`, `features/*/components/` | No business logic. Calls server actions or API. |
| **Business Logic** | `services/`, `features/` | No direct DB or HTTP calls. Uses repositories. |
| **Database** | `repositories/`, `prisma/` | Prisma queries only. No business rules. |
| **AI Services** | `services/ai/` | Prompt templates + OpenAI client. Stateless. |
| **Authentication** | `services/auth/`, `server/auth/`, `middleware.ts` | Clerk integration + user sync. |
| **File Storage** | `services/storage/` | S3 presigned URLs + document metadata in DB. |

## Data Flow — Recommendation Engine

```
User Profile
    │
    ▼
matchingService.buildCriteria()
    │
    ▼
universityRepository.findCandidatesForMatching()
    │
    ▼
scoringService.scoreUniversity()  ── weights from config/constants.ts
    │
    ▼
scoringService.rankUniversities(topN)
    │
    ▼
justificationService.generate()   ── OpenAI GPT-4.1
    │
    ▼
recommendationRepository.createMany()
    │
    ▼
cacheService.set()                ── Upstash Redis
    │
    ▼
RecommendationResponse
```

### Scoring Weights

| Factor | Weight |
|--------|--------|
| Academics (GPA, board, course match) | 30% |
| Financial fit (tuition + living vs budget) | 20% |
| University ranking | 15% |
| Admission chance | 15% |
| Scholarship opportunity | 10% |
| Other (location, post-study work, safety) | 10% |

## Database Schema

See `prisma/schema.prisma` for the full model:

- **User** — synced from Clerk via webhook
- **UserProfile** — academic, financial, preference data
- **University** / **UniversityProgram** — catalog
- **Scholarship** / **CountryInfo** / **Ranking** — reference data
- **Recommendation** — scored matches + AI justification
- **Application** — application workflow
- **Document** — S3-backed file metadata

## Scalability (100k+ users)

1. **Indexed queries** — composite indexes on high-traffic lookups
2. **Redis caching** — recommendations, profiles, university catalog
3. **Background workers** — async recommendation generation via Redis queue
4. **Repository pattern** — swap data layer without touching business logic
5. **Pagination** — all list endpoints capped at 100 items
6. **Connection pooling** — Neon serverless driver + Prisma singleton
7. **Stateless API** — horizontal scaling on Vercel

## Folder Reference

```
src/
├── app/                 # Next.js routes (existing marketing pages)
├── components/          # Shared UI (existing — do not mix with services)
├── config/              # Environment + service configuration
├── emails/              # Email templates + send service
├── features/            # Domain modules (schemas, query keys, webhooks)
│   ├── auth/
│   ├── recommendations/
│   ├── profiles/
│   ├── universities/
│   ├── applications/
│   └── documents/
├── hooks/               # Client hooks (reserved)
├── lib/                 # Infrastructure utilities
├── middleware.ts        # Clerk route protection
├── repositories/        # Data access layer
├── server/              # Server-side helpers
│   ├── auth/
│   └── api/
├── services/            # Business logic
│   ├── ai/
│   ├── auth/
│   ├── cache/
│   ├── profile/
│   ├── recommendation/
│   ├── storage/
│   ├── university/
│   └── application/
├── types/               # Shared TypeScript types
└── workers/             # Background job processors

prisma/
└── schema.prisma        # PostgreSQL schema
```

## Environment Setup

Copy `.env.example` to `.env.local` and fill in credentials.

```bash
npm install
npx prisma generate
npx prisma db push   # or prisma migrate dev
```

## Deployment Notes

> **Important:** The current `next.config.ts` uses `output: "export"` (static site).
> For API routes, middleware, Clerk, and Prisma to work in production, remove
> `output: "export"` and deploy to Vercel as a standard Next.js server app.

## Next Steps (not in scope)

1. API route handlers under `app/api/`
2. Dashboard UI under `app/(dashboard)/`
3. Admin panel under `app/(admin)/`
4. React Query hooks in `hooks/`
5. E2E data sync workers for university catalog
6. Email provider integration (Resend / SES)
