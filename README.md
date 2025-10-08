# Authyntic Platform Demo

🎬 **[LIVE DEMO](https://authyntic-demo.netlify.app)**

Welcome to the Authyntic platform demo! This project provides an interactive,
browser‑based demonstration of the Authyntic media provenance and
authenticity platform. It showcases how trust is established on a
distributed network, how streaming media can be cryptographically
verified in real‑time and how users can explore Merkle proofs under the
hood.

## What is Authyntic?

Authyntic is a media provenance and authenticity platform designed to
authenticate streaming and uploaded media at the edge and in the cloud.
It combines cryptographic techniques like Merkle trees with
peer‑to‑peer coordination and dynamic trust scoring to provide a robust
chain of custody for audio, video and imagery. This demo uses
lightweight mock services and hard‑coded data to illustrate the core
concepts without requiring any back‑end infrastructure.

## Demo Features

- ✅ **Real‑time trust network visualization** – explore how edge devices
  and coordinators connect and exchange trust signals via an interactive
  force‑directed graph.
- ✅ **Interactive Merkle proof validation** – inspect Merkle tree
  structures, calculate custom trust scores and validate proofs step by
  step.
- ✅ **Streaming media authentication** – play audio and video while
  generating cryptographic proofs and simulating tamper detection.
- ✅ **Edge device network mapping** – click on nodes to reveal
  metadata, status and trust scores.
- ✅ **Tamper detection simulation** – toggle tampering on generated
  hashes to see how verification fails.

## Technology Stack

This project uses a modern front‑end stack to deliver smooth
visualizations and responsive interactions:

- **React + TypeScript** – component‑based UI development with strong
  typing.
- **D3.js** – dynamic data visualizations for the network map and Merkle
  tree displays.
- **Vite** – fast development server and optimized build pipeline.
- **Recharts** – (included for future use) charting library for data
  metrics.
- **Crypto‑JS** – hashing library used to simulate Merkle tree and
  cryptographic proofs.

## Installation & Development

To run the demo locally you will need [Node.js](https://nodejs.org/) installed.

```bash
git clone https://github.com/YOUR_USERNAME/AuthynticDemo.git
cd AuthynticDemo
npm install
npm run dev
```

This will start the Vite development server and open the demo in your
browser at `http://localhost:3000`. For a production build, run
`npm run build` which will output a `dist` directory containing static
assets.

## Deployment

The demo is configured for deployment to Netlify. The included
`deploy/netlify.toml` file defines the publish directory and catch‑all
redirect so that client‑side routing works correctly. To deploy you can
run:

```bash
npm run build
netlify deploy --prod
```

Alternatively you can connect the GitHub repository to Netlify and
enable continuous deployment.

## Demo Walkthrough

1. **Dashboard** – view real‑time metrics, including the number of
   active streams, trust scores and valid proofs. A table lists
   current media streams and their authenticity percentages. A small
   network preview offers a quick glance at device connectivity.
2. **Trust Visualization** – dive into the Merkle tree structures
   behind proofs. Adjust reliability and risk factors with sliders to
   observe how trust scores change. Validate sample proofs and see a
   consensus indicator based on network trust scores.
3. **Streaming Demo** – play sample audio and video. Generate a
   cryptographic proof for a selected stream and simulate tampering to
   witness how verification responds.
4. **Network Map** – explore a fully interactive force‑directed graph
   representing the trust network. Drag nodes around and click on them
   to view details such as status and trust score.
5. **Media Auth** – upload your own images, videos or audio files to
   simulate authenticity scoring. A random hash and confidence score
   based on the file contents are displayed along with a colored
   progress bar.
6. **Proof Generator** – experiment with arbitrary leaf values. Enter
   comma‑separated strings, generate the corresponding Merkle tree,
   compute a proof for a selected leaf and verify its correctness.

## Contributing

This repository is intended as a demonstration and educational tool.
Feel free to fork it or submit pull requests if you wish to extend the
functionality, refine the user interface or integrate with a real
back‑end. Contributions that improve accessibility, add tests or fix
bugs are especially welcome.

## License

This project is provided for demonstration purposes only and is not
licensed for production use. All sample media assets are generated
programmatically and do not contain real personal data.