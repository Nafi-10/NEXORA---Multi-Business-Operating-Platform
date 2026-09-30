# NEXORA - Multi-Business Operating Platform

NEXORA is a browser-based ERP prototype for exploring operations across multiple business entities. It brings finance, inventory, procurement, human resources, intercompany activity, approvals, and audit workflows into one interface.

## Features

- Group command center with entity-level navigation
- Finance, inventory, sales and procurement, HR, and intercompany workflows
- Role-based demo personas, access passports, and break-glass flows
- Approval queue and audit log with hash-chain verification
- Tenant-isolation scenarios and industry onboarding templates
- Light and dark themes, with demo state saved in browser storage

## Requirements

- Node.js 20.19 or newer (or 22.12 or newer)
- npm

## Getting Started

```sh
npm install
npm run dev
```

Vite prints the local development URL after startup. To verify or build the project:

```sh
npm run typecheck
npm run build
```

## Project Structure

```text
src/
  components/   Feature modules and shared UI
  context/      Application state and workflows
  data/         Seed data for the demo businesses
  lib/          Audit hashing and authorization helpers
  types/        Domain model types
```

## Prototype Scope

This project is a frontend prototype. It uses seeded sample data and browser `localStorage`; it does not include a backend, database, or server-enforced authentication and authorization. The security and audit workflows are demonstrations, not production security controls. Do not use real customer, employee, financial, or credential data.

## Available Scripts

- `npm run dev` starts the Vite development server.
- `npm run typecheck` checks TypeScript types.
- `npm run build` creates a production build in `dist/`.
- `npm run preview` serves the production build locally.
- `npm run clean` removes generated build directories.
