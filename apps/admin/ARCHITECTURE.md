# apps/admin — Architecture

The Super Admin portal: a live order dashboard, order status management,
menu/deals CRUD, and basic sales reports. Phase 1 has exactly one role
(Super Admin, full access) — see `AdminRole` in `packages/types` for how that
stays additive in Phase 2 instead of requiring a rewrite.

This app follows the same conventions as `apps/web` (see
`apps/web/ARCHITECTURE.md` for the full rationale); this file covers what's
different.

## Folder structure

```
apps/admin/
  src/
    app/
      layout.tsx            # html/body + ToastProvider + AuthProvider (wraps every route, incl. /login)
      login/page.tsx          # public — the only route outside the (dashboard) group
      (dashboard)/             # route group: no URL prefix, but shares one layout
        layout.tsx              # RequireAuth + AdminShell (sidebar/topbar chrome)
        page.tsx                 # live order dashboard
        orders/page.tsx           # all orders, filterable by status
        orders/[id]/page.tsx       # order detail + status actions
        menu/page.tsx              # menu item table
        menu/new/page.tsx           # create
        menu/[id]/page.tsx           # edit
        deals/...                    # same pattern as menu/
        reports/page.tsx              # today/week/month summary + top items
    components/
      AdminShell.tsx, RequireAuth.tsx     # app-wide chrome/guard
      orders/ menu/ deals/                # grouped by the screen that owns them
    context/AuthContext.tsx
    hooks/                                  # useAdminOrders, useAdminMenuItems, useAdminDeals, useSections, useAddOns, useReports
    lib/apiClient.ts, socketClient.ts, orderStatusActions.ts
```

## Auth

The admin session is an `httpOnly` cookie set by `apps/api` on `POST
/api/auth/login` — deliberately not readable by this app's own JavaScript
(or its Next.js middleware, which would face the same cross-origin
limitation once `apps/admin` and `apps/api` live on different domains in
production). Instead:

1. `AuthContext` calls `GET /api/auth/me` once on mount. That request's
   target *is* the API's origin, so the browser attaches the cookie there
   without issue, regardless of what origin `apps/admin` itself is served
   from.
2. `RequireAuth` (wrapping every route under the `(dashboard)` group)
   redirects to `/login` if that check comes back unauthenticated.
3. The one place raw JS needs a token — the Socket.io `branch:subscribe`
   handshake — gets a fresh short-lived one from `GET
   /api/auth/socket-token` (also cookie-gated) rather than ever exposing the
   session cookie itself.

## Data-fetching & real-time

Same hook-per-resource pattern as `apps/web`. `useAdminOrders` is the one
hook with a real-time half: it fetches `/api/admin/orders` once, then joins
the `branch:{branchId}` Socket.io room and merges `order:created` /
`order:status_changed` events into local state — so a second admin's status
change (or a customer's new order) appears without a refresh.

## State management

React context + hooks only — `AuthContext` is the only long-lived context;
everything else (order lists, form state, filters) is local `useState` per
page/hook, since there's no cross-page state to share (unlike `apps/web`'s
cart, an admin action always targets one order/item/deal in view).

## Coding rules

Identical to `apps/web` (TypeScript strict, no unexplained `any`, one
component per file, no business logic in JSX, no magic strings/numbers,
comments explain *why*, small commits). See `apps/web/ARCHITECTURE.md` for
the full list.
