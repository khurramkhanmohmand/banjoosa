# apps/web — Architecture

The customer-facing ordering site: browse the menu, customize items, manage a
cart, check out, and track an order live. Next.js App Router + TypeScript,
talking to `apps/api` over REST and Socket.io — never touches Prisma/Postgres
directly.

## Folder structure

```
apps/web/
  src/
    app/                  # routes (App Router) — one folder per URL segment
      layout.tsx           # providers + Header/Footer/CartDrawer/ItemDetailModal (rendered once, app-wide)
      page.tsx              # Home
      menu/page.tsx
      deals/page.tsx
      locations/page.tsx
      about/page.tsx
      checkout/page.tsx
      order/[orderId]/page.tsx   # live order tracking
    components/            # app-specific composed components (not generic enough for packages/ui)
      home/ menu/ checkout/ locations/ about/   # grouped by the screen that owns them
      Header.tsx Footer.tsx CartDrawer.tsx ItemDetailModal.tsx   # app-wide, rendered from layout.tsx
    context/               # CatalogContext, CartContext, ItemModalContext — see State management below
    hooks/                 # useMenu, useDeals, useBranch, useOrder — all data-fetching lives here
    lib/                   # apiClient, socketClient, cartPricing, menuCardAdapter
```

**Shared vs. app-specific components:** anything generic enough to be reused
by `apps/admin` too (Button, Card, Modal, Badge, PriceTag, QtyStepper,
MenuItemCard, ...) lives in `packages/ui` and takes plain props with zero
fetching or business logic. Anything that composes those primitives into a
Banjoosa-specific screen (`HeroSection`, `CheckoutFormFields`,
`OrderSummaryPanel`, ...) lives in `apps/web/src/components` because it isn't
reusable outside this app.

## Data-fetching pattern

Every fetch lives in a hook (`useMenu`, `useDeals`, `useBranch`, `useOrder`),
never inline in a component and never directly in a presentational component
(`MenuItemCard` just renders props — it has no idea an API exists). Hooks
call `apiFetch` (`lib/apiClient.ts`), a thin wrapper that:

- always sends `credentials: "include"` (needed for the admin app's auth cookie; harmless here),
- throws a typed `ApiError` for any non-2xx response, parsed from the API's one consistent `{ error: { message, code } }` shape,

so a component never has to check `res.ok` itself — it just try/catches an `ApiError` and shows `err.message`.

`useMenu`/`useDeals`/`useBranch` are wrapped once in `CatalogContext`
(`context/CatalogContext.tsx`) and mounted at the root layout, so Home, Menu,
Deals and the checkout pricing logic all read the *same* fetched catalog
instead of each re-fetching it — the hooks still own the actual fetching,
the context just shares one result.

`useOrder` (the tracking page) fetches the order once via REST, then opens a
Socket.io room (`order:{orderId}`) for live status pushes — no polling.

## State management

React context + hooks only, per the project's "keep it simple" rule — no
Redux/Zustand/React Query:

- **CatalogContext** — the fetched menu/sections/deals/branch (read-only, shared).
- **CartContext** — cart lines (`{ lineKey, itemType, itemId, variantId, addOnIds, qty }`), persisted to `localStorage` so a refresh mid-order doesn't lose it, plus cart-drawer open/close. Line identity is `itemType + itemId + variantId + sorted addOnIds` (per the design handoff), computed in `buildLineKey`.
- **ItemModalContext** — the transient "item detail modal" selection (which item, which variant/add-ons/qty are currently picked) — reset every time a new item is opened.

Cart lines intentionally store *no price* — `lib/cartPricing.ts` re-derives
the displayed price by looking the line's `itemId`/`variantId`/`addOnIds` up
against the live `CatalogContext` data, the same way the design handoff's
prototype computed cart totals. This is a **display-only** preview; the
actual charge is always recomputed authoritatively by `apps/api` when the
order is placed (see `apps/api/ARCHITECTURE.md`), and the confirmation/
tracking page shows the server's numbers, not the client's estimate.

## Coding rules (apply to every file in this app)

- TypeScript strict mode is on; `any` is not allowed without a comment justifying why.
- Naming: PascalCase components/types, camelCase functions/variables/hooks, kebab-case-free file names matching the export (`MenuItemCard.tsx` exports `MenuItemCard`).
- One component per file, file name matches the component name.
- No business logic inside JSX — pricing, filtering and shaping logic lives in `lib/` or a hook, components just render what they're given.
- Every fetch is wrapped in try/catch (via `apiFetch`'s thrown `ApiError`) with a message the UI can show directly — nothing fails silently.
- Non-trivial hooks/components get a short comment on *why*, not what.
- No magic numbers/strings — pricing/ETA constants come from `@banjoosa/types` (`DELIVERY_FEE_RS`, `TAX_RATE`, ...), status/enum values from the `OrderStatus`/`DeliveryMode`/`PaymentMethod` constants, never raw strings.
- Commit small and often, one logical change per commit.

## apps/admin — the same rules, different screens

`apps/admin` is a separate Next.js app (not a role-gated route inside `web`)
so the public site's bundle stays small and the admin portal can grow
independently in Phase 2. It follows the identical structure and rules above
— `app/` routes, `components/` grouped by screen, `hooks/` for fetching,
`context/` for the (smaller) shared state — with two differences:

- **Auth**: the admin's session cookie is `httpOnly` and scoped to the API's origin, so `apps/admin`'s own Next.js server can't reliably read it in middleware once the two apps live on different domains in production — auth is checked client-side instead. `AuthContext` calls `GET /api/auth/me` (which does read the cookie, because that request's target *is* the API's origin) on mount; a `RequireAuth` wrapper redirects to `/login` if that comes back unauthenticated. This avoids ever shipping the API's `JWT_SECRET` into the frontend.
- **State**: no cart — the live order dashboard's state is "orders for the branch," kept fresh by subscribing to the `branch:{branchId}` Socket.io room (see `apps/api/ARCHITECTURE.md`) instead of a customer-side cart.

See `apps/admin/ARCHITECTURE.md` for its specific folder layout.
