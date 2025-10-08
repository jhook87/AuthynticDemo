# Architecture Decision Record

## 1. Custom Router & State Store
- **Context**: Network access is constrained, preventing installation of third-party routing/state libraries.
- **Decision**: Implemented a minimal history-aware router (`components/shared/Router.tsx`) and a Zustand-inspired store using `useSyncExternalStore` (`store/createStore.ts`).
- **Consequences**: Tight control over bundle size and zero external dependencies, at the cost of reimplementing a subset of React Router functionality.

## 2. Cryptographic Implementations
- **Context**: Demonstration required multi-algorithm hashing and signature verification without server support.
- **Decision**: Leveraged Web Crypto where available with Node fallbacks; added a TypeScript BLAKE2b implementation (`utils/blake2b.ts`) and zero-knowledge proof simulation service.
- **Consequences**: Deterministic hashing and signature workflows available both in browser and during Node tests.

## 3. Content-Addressable Media Simulation
- **Context**: Need to demonstrate fingerprinting, watermarking, and authenticity scoring on sample media assets without committing binaries to the repository.
- **Decision**: Embedded PNG/WAV payloads as base64 constants plus an ASCII-frame "video" inside `src/constants/mediaSamples.ts`, allowing runtime materialization for hashing, similarity scoring, moderation, and watermark records.
- **Consequences**: Fully offline-capable demo with repeatable content hashes and Merkle proofs while keeping version control history text-only.

## 4. Real-time Simulation Engine
- **Context**: Operators require dynamic feedback on network health.
- **Decision**: Created `useRealtimeSimulation` hook that orchestrates latency shifts, consensus rotation, incident injection, and alert publication via the central store.
- **Consequences**: Deterministic, interval-based state transitions; easy to extend with additional scenarios (attack drills, recovery exercises).

## 5. Testing via Node Test Runner
- **Context**: External testing frameworks unavailable.
- **Decision**: Emitted TypeScript to ESM (`npm run build:lib`) and executed assertions with `node --test` + coverage.
- **Consequences**: Fast feedback loop using standard library tooling; tests validate cryptographic and network logic directly against compiled modules.
