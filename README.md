# DHL Mock API Server

Welcome to the DHL Mock API Server repository – built by **@bkita**.

This project provides a fully customizable mock REST API for shipment management using **json-server** with custom middleware via `server.js`. It is ideal for API testing, UI automation, prototyping, backend simulation, and test data setup.

The repo demonstrates real-world API behaviors with extended DELETE logic (204 / 404), routing overrides, middleware features, and consistent response formats.

---

## What This Project Covers

This mock API simulates real backend operations, focusing on realistic testing scenarios:

- Shipment CRUD operations
- Custom DELETE response behavior (204 or 404)
- Test data setup for automated test suites
- Route aliasing via `routes.json`
- Middleware-level request/response manipulation
- Hot reload for database JSON state without server restart

By exploring this project, you’ll understand how to create maintainable mock backends for:

- UI automation
- API testing
- Integration testing
- Prototyping real applications without backend availability

---

## Prerequisites

To get started, you’ll need:

- **Node.js (v18 or higher recommended)**
- npm

No external credentials or cloud accounts required.

---

## Setup

Clone the repo:

```bash
git clone https://github.com/akademiaqa/dhl-api.git
cd dhl-api
```

Install dependencies:

```bash
npm install
```

Start the API:

```bash
node server.js
```

The server starts at:

```
http://localhost:3000
```

---

## Running the API

### Default execution

```bash
node server.js
```

### Hot reload

All changes inside:

- `db.json`
- `routes.json`

…will be reflected immediately without restarting.

---

## Project Stack

This mock API is configured with:

- **json-server** (mock REST engine)
- **custom middleware (server.js)** for:
  - DELETE rules
  - validation
  - custom responses
- **routes.json** for route aliasing
- **db.json** as real-time test storage

Additional advantages:

- Lightweight
- Zero dependencies beyond Node.js
- Perfect for UI or API automation tools
- Works seamlessly with:
  - Playwright
  - Postman
  - Cypress
  - Newman
  - REST Assured
  - Supertest

---

## Project Structure

```
DHL-API/
  db.json             # mock shipment database
  routes.json         # endpoint remapping and aliases
  server.js           # middleware + extended request handling
  package.json
  node_modules/
```

---

## Key Features

### ⚙️ Custom DELETE Behavior

Automatic API accuracy for test automation:

- **204 No Content** when record exists and is deleted
- **404 Not Found** when trying to delete a missing record

Ideal for automated testing frameworks, ensuring consistent API behavior.

---

### 🌱 Hot Reload Test Data

All write operations update `db.json` on disk –
monitorable in real time and restorable at any moment.

---

### 🎯 Route Aliasing

Define API surface without changing storage:

Example:

```json
{
  "/shipments": "/orders"
}
```

---

### 🔐 Middleware Logic

`server.js` allows:

- request validation
- conditional responses
- logging & instrumentation
- creation of additional endpoints

---

## API Scenarios

Shipment management:

- Create shipment records
- Query shipments
- Delete shipments
- Detect missing IDs
- Validate API consistency under test load

---

## Why Use a Mock API?

Modern testing approaches often require:

- Test data setup independent from UI
- Backend simulation for automation
- CI-ready deterministic API
- Offline development capability
- Repeatable state between test runs

This project allows you to:

- Build stable UI automation suites
- Generate backend test data programmatically
- Eliminate backend dependencies
- Speed up CI pipelines with deterministic execution
- Reproduce verified defects without production access

---

## License

ISC License.

---

## Automation Ready ⚡

This API is a perfect match for:

- Playwright API testing
- Playwright UI → API hybrid patterns
- REST Assured for backend automation
- Postman + Newman test suites
- Test data fixtures for CI pipelines
- Dockerized testing environments

---

Created with 🧉 by **@bkita**
