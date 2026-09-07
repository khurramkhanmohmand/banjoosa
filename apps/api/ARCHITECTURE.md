# apps/api — Architecture

Express + TypeScript backend for Banjoosa Phase 1: menu/deals, order placement,
admin auth, admin order/menu/deal management, reports, and a Socket.io server
for live order updates.

## Folder structure

```
apps/api/
  prisma/
    schema.prisma       # single source of truth for the data model
    seed.ts              # transcribes the design handoff's menu/deals into the DB
  src/
    config/
      env.ts             # reads + validates process.env once, at boot
      constants.ts        # named constants (fees, tax rate, ETAs, cookie name...)
    lib/
      prisma.ts           # the one shared PrismaClient instance
      socket.ts           # Socket.io server setup, room helpers, emit helpers
      jwt.ts               # sign/verify admin JWTs
      errors.ts            # AppError + subclasses (NotFoundError, ValidationError, UnauthorizedError)
      asyncHandler.ts      # wraps async controllers so rejections reach errorHandler
    middleware/
      requireAdmin.ts      # verifies the admin cookie, attaches req.admin
      errorHandler.ts      # turns any thrown error into the one ApiErrorResponse shape
    validation/            # zod schemas — one per request-body shape
    services/              # all Prisma calls + business logic live here
    controllers/            # thin: parse request -> call a service -> shape response
      admin/                # controllers behind requireAdmin
    routes/                 # Router wiring only, no logic
    types/express.d.ts      # augments Express.Request with `admin`
    app.ts                  # express app: middleware + route mounting
    server.ts                # boots the HTTP server + Socket.io
```

**Why this split:** routes only wire paths to controllers, controllers only
translate HTTP <-> service calls (parsing/validating input, shaping the
response, emitting socket events), and services own every Prisma query and
pricing/business rule. This keeps any one file small and means the same
service function (e.g. `createOrder`) is trivially reusable if a second entry
point (a future admin "phone order" endpoint, say) needs it.

## Request lifecycle

```
HTTP request
  -> routes/*.routes.ts        (matches path + method, applies requireAdmin if needed)
  -> controllers/*.controller.ts (zod-parses the body, calls a service, sends the response)
  -> services/*.service.ts      (Prisma queries, pricing, mapping DB rows -> packages/types DTOs)
  -> Prisma -> Postgres
```

Controllers never call `prisma` directly — that's the boundary that keeps
business logic (like server-side order pricing) in one place instead of
scattered across route handlers.

## Error-handling convention

Every controller is wrapped in `asyncHandler`, so a thrown error (or a
rejected promise) always reaches the single `errorHandler` middleware in
`app.ts`. That middleware guarantees **one response shape** for every failure:

```json
{ "error": { "message": "human-readable message", "code": "MACHINE_CODE", "details": {} } }
```

- Expected failures throw `NotFoundError` / `ValidationError` / `UnauthorizedError` (all extend `AppError`) with the right HTTP status baked in.
- A zod parse failure is caught and reported as `VALIDATION_ERROR` with `.flatten()` details.
- Anything else is logged server-side and reported as a generic `500 INTERNAL_ERROR` — never leaking internals to the client.

Both `apps/web` and `apps/admin` can therefore handle every API error with one
code path (`response.error.message` / `.code`) instead of guessing per endpoint.

## Environment variables

See `.env.example`. Required: `DATABASE_URL`, `JWT_SECRET`. Optional (defaulted):
`PORT` (4000), `JWT_EXPIRES_IN` (7d), `CORS_ORIGINS` (comma-separated), `ADMIN_SEED_EMAIL`,
`ADMIN_SEED_PASSWORD`, `NODE_ENV`. `env.ts` throws at boot if a required variable
is missing, rather than failing confusingly on the first request that needs it.

## Socket.io events

Defined once in `packages/types/src/socket.ts` as `SocketEvent` constants (never
raw strings) so a typo can't silently desync a channel:

| Event | Direction | Room | Payload |
|---|---|---|---|
| `order:subscribe` | client -> server | joins `order:{orderId}` | `{ orderId }` |
| `branch:subscribe` | client -> server | joins `branch:{branchId}` (JWT-verified) | `{ branchId, token }` |
| `order:created` | server -> branch room | — | full `Order` |
| `order:status_changed` | server -> order room + branch room | — | `{ orderId, status, updatedAt }` |

`apps/web`'s order-tracking page subscribes to its own `order:{id}` room.
`apps/admin`'s dashboard subscribes to `branch:{id}` (proving admin identity via
its JWT in the subscribe payload) and receives every new order and status
change for that branch. `lib/socket.ts` exposes `emitOrderCreated` /
`emitOrderStatusChanged` so controllers never touch the raw `io` instance.

The admin's session token is an `httpOnly` cookie, so browser JS can't read it
to put in the socket handshake payload. `GET /api/auth/socket-token` (behind
`requireAdmin`, so it still needs the cookie) mints a fresh short-lived JWT
for that one purpose instead of weakening the cookie.

## Data model notes

`Branch` is a first-class table from day one — `MenuItem`, `Deal` and `Order`
all carry a `branchId` — even though Phase 1 seeds exactly one branch row and
every query resolves it via `getActiveBranch()`. Phase 2 (multiple branches,
additional roles) can extend this without touching the schema. `AdminUser.role`
is an enum with a single `SUPER_ADMIN` value today for the same reason — no
permission-check logic exists yet, just a field that won't need a migration
to grow.

Order line items (`OrderLineItem`) snapshot `name` / `variantLabel` /
`addOnLabels` / `unitPrice` at order time rather than joining live to
`MenuItem`, so editing or deleting a menu item later never changes historical
orders. Every price sent by a client is re-derived server-side in
`order.service.ts#priceOrderItems` — the client only ever sends ids and
quantities.

## Coding rules (apply to every file in this app)

- TypeScript strict mode is on (`packages/config/tsconfig.base.json`); `any` is not allowed without a comment justifying why.
- Naming: PascalCase for types, camelCase for functions/variables, kebab-case would apply to filenames but this app follows one-export-per-file with the file named after that export in camelCase/PascalCase to match the existing Node/Express convention in this codebase.
- One export per file where practical; a file's default responsibility should be guessable from its name.
- No business logic inside route handlers — routes wire paths, controllers translate HTTP, services hold the logic.
- Every async operation that can fail is either awaited inside a service (letting `AppError` subclasses propagate) or explicitly caught with a meaningful message — nothing is silently swallowed.
- Exported functions and non-trivial logic get a short comment explaining *why*, not what.
- No magic numbers/strings — see `config/constants.ts` and the enums in `packages/types`.
- Commit small and often, one logical change per commit.
