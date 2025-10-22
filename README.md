# Authyntic Operator Experience

An immersive, single-page web application that demonstrates how an Authyntic platform operator observes, audits, and responds to the health of a decentralized media provenance network. The console highlights cryptographic verification, network consensus, media authenticity workflows, and operational readiness tooling in one cohesive experience.

## Feature Highlights

- **Professional operator dashboard** – consolidated consensus metrics, real-time alerting, incident response history, and system health at a glance.
- **Advanced media pipeline** – hash comparison across SHA-256, SHA-3, and BLAKE2b, Merkle batch verification, watermarking insights, blockchain anchoring simulation, and zero-knowledge proof summaries over the included image/audio/video assets.
- **Network simulation suite** – dynamic topology visualized on a canvas map, latency and partition drills, consensus algorithm rotation (PBFT → PoS → HotStuff), and reputation adjustments with slashing events.
- **Analytics & governance** – trust score projections, fraud pattern monitoring, performance benchmarking, webhook and integration management, disaster recovery posture, and upgrade scheduling.
- **Progressive operator guidance** – in-product tutorial overlay, accessibility conscious layout, dark/light theming, and offline support via a service worker.

## Getting Started

The project targets Node.js 18+. Install dependencies once (the repo ships with a populated `node_modules` folder for the challenge environment):

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build optimized assets and supporting ESM modules:

```bash
npm run build
```

Execute the unit tests (uses Node's built-in test runner with coverage reporting):

```bash
npm test
```

### Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite in development mode. |
| `npm run build:packages` | Compile the reusable workspaces under `packages/`. |
| `npm run build:lib` | Emit Node-consumable modules into `build/` for tests. |
| `npm run build` | Build workspaces and bundle production assets with Vite. |
| `npm run preview` | Preview the production build locally. |
| `npm test` | Build packages and execute Node tests with coverage. |
| `npm run lint` | Lint the app and workspace sources with ESLint. |

## Architecture Overview

```
src/
├── components/
│   ├── analytics/         // Trust projections, benchmarks, fraud patterns
│   ├── dashboard/         // Primary operator dashboard widgets
│   ├── media/             // Media authenticity pipeline visualizations
│   ├── network/           // Canvas topology, consensus telemetry
│   ├── settings/          // Operations, webhooks, recovery planning
│   └── shared/            // Layout, router, cards, error boundary, tutorial
├── constants/             // Palette, thresholds, enumerations
├── hooks/                 // Real-time simulation orchestration
├── services/
│   ├── api/               // Incident + reporting synthesizers
│   ├── crypto/            // Hashing, Merkle, ZKP, timestamp utilities
│   ├── network/           // Topology mutation, consensus and reputation
│   └── storage/           // Media asset processing & audit log builders
├── store/                 // Lightweight Zustand-style store built on useSyncExternalStore
├── styles/                // Global theming and responsive layout
├── types/                 // Shared domain models & ambient typings
├── utils/                 // Helpers (formatting, randomness, BLAKE2b)
└── tests/                 // Node tests (built outputs in `build/`)
packages/
├── demo-core/            // Scenario engine, metrics, and simulators
├── demo-ui/              // Defense-grade visualization components
└── demo-scenarios/       // Pre-configured mission scenarios
infrastructure/
├── docker/               // Container images for the expo platform
├── kubernetes/           // Deployment manifests matching production
└── terraform/            // Infrastructure-as-code environment scaffolding
```

### Monorepo Packages

- `@authyntic/demo-core` – Provides the scenario engine, metrics collector, and network simulator powering demonstrations.
- `@authyntic/demo-ui` – Defense-oriented visualization components built atop three.js and d3.
- `@authyntic/demo-scenarios` – Pre-configured operational scenarios aligned to expo narratives.


Key technical decisions:

- **Custom router & store** – lightweight abstractions provide deterministic navigation/state while operating offline without external dependencies.
- **Web Crypto + fallback algorithms** – signature verification uses ECDSA with browser/Node subtle crypto, hashing falls back to pure TypeScript implementations (including a hand-rolled BLAKE2b).
- **Service worker & manifest** – enables offline exploration of the console and caches bundled media assets for PWA behavior.
- **Canvas-driven network viz** – ensures performant animation without bringing in heavier WebGL frameworks while still exposing consensus/partition tooling.

## Included Media Assets

To keep the repository binary-free, sample media payloads are embedded as text constants inside `src/constants/mediaSamples.ts`:

- Synthetic gradient PNG stored as a base64 data URI.
- Half-second 440Hz WAV tone generated at build time and inlined as base64.
- Simulated "video" feed represented as ASCII-art frames rendered by the UI.

`MediaPipelineView` materializes these resources at runtime, computes multi-algorithm hashes, builds Merkle proofs, and simulates watermarking plus blockchain anchoring for each asset.

## Testing Strategy

Tests live under `tests/` and target the compiled ESM output in `build/`:

- **Hash service** – ensures SHA-256, SHA-3, and BLAKE2b hashing agree with verification routines.
- **Merkle service** – validates inclusion proofs and batch verification.
- **Network simulation** – asserts latency simulations mutate topology metrics.

Code coverage is reported via Node's experimental coverage tooling (`node --test --experimental-test-coverage`).

## Deployment & PWA Notes

- The build output (`dist/`) is suitable for static hosting (Netlify, Vercel, S3+CloudFront, etc.).
- A service worker (`public/service-worker.js`) caches critical assets; update `CACHE_NAME` when deploying breaking changes.
- `public/manifest.json` advertises installable metadata. Include a `192x192` icon (`public/icon-192.png`).

## License

The application is provided for demonstration purposes. Generated media assets are synthetic and free for reuse.
