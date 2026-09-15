# Account Management MFE

Angular microfrontend responsible for authentication and account-holder views within the [Distributed Banking Platform](#related-repositories). Built as an independently deployable remote using **Native Federation**, and designed to be loaded dynamically into the [Shell](#related-repositories) host application.

## Overview

This app owns everything related to a customer's identity and account profile:

- Login (username/password)
- Dashboard — masked account number, current balance, quick actions (Transfer, Pay a Bill)
- Profile — full name, email, phone number, username

It intentionally has **no self-service registration flow**. Accounts are provisioned by bank staff through the Account Management Service's admin-facing API — mirroring how traditional financial institutions handle identity verification and onboarding, rather than allowing unauthenticated self-signup.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 22 (standalone components, esbuild Application Builder) |
| State Management | NgRx (Store, Effects, DevTools) |
| Microfrontend | Native Federation (`@angular-architects/native-federation`) |
| Styling | SCSS, mobile-first responsive design, CSS custom properties |
| HTTP | Angular `HttpClient` with a JWT-attaching interceptor |

## Architecture Notes

**Federation-aware state registration.** Since this app is loaded as a *remote* inside Shell rather than bootstrapped on its own, NgRx feature state (`provideState`, `provideEffects`) is registered at the **route level** (`app.routes.ts`), not the root `app.config.ts`. This ensures the `auth` state slice and its effects travel correctly with the lazy-loaded route tree, regardless of which host application loads them.

**Session persistence.** The JWT returned on login is currently stored in `localStorage`. This is a deliberate interim design — see [Roadmap](#roadmap) for the planned replacement.

**Route guarding.** `authGuard` reads the NgRx `isAuthenticated` selector before allowing access to `/dashboard` and `/profile`.

**Interceptor.** An HTTP interceptor automatically attaches the stored JWT as a `Bearer` token to outgoing requests to the Account Management Service.

## Project Structure

```
src/app/
├── core/
│   ├── guards/          # Route guards (authGuard)
│   ├── interceptors/    # JWT-attaching HTTP interceptor
│   ├── services/        # AuthService (API calls)
│   └── models/          # User, LoginRequest/Response, AuthState interfaces
├── shared/
│   ├── components/
│   ├── pipes/
│   └── directives/
├── features/
│   ├── login/
│   ├── dashboard/
│   └── profile/
├── store/
│   └── auth/            # NgRx actions, reducer, effects, selectors
├── app.config.ts
└── app.routes.ts         # Exposed via Native Federation as './routes'
```

## Getting Started

### Prerequisites

- Node.js 22.12+
- Angular CLI 22+
- [Account Management Service](#related-repositories) running locally on `localhost:8080`

### Install & Run (Standalone)

```bash
npm install
ng serve --port 4201
```

Visit `http://localhost:4201`.

> **Note:** This app is designed to run as a federated remote inside the Shell application. Standalone mode is useful for isolated UI development, but the full authenticated flow (shared root store, cross-app navigation) only works when run alongside Shell — see [Running the Full Platform](#related-repositories).

## Environment Configuration

`src/environments/environment.development.ts`:

```typescript
export const environment = {
  production: false,
  accountApiUrl: 'http://localhost:8080',
};
```

## Roadmap

- [ ] Replace `localStorage` JWT storage with a **BFF (Backend for Frontend) + Keycloak/OIDC** session-cookie pattern, so no token is ever exposed to browser JavaScript
- [ ] Extract shared SCSS design tokens (currently duplicated across all three frontend apps) into a shared, versioned package
- [ ] Add unit and integration test coverage for NgRx effects and guards

---

This is one component of a larger system. For the full architecture, repository links, and how to run everything together, see the [Distributed Banking Platform](#) overview repository.
