# Orbit

A sophisticated circular Tic-Tac-Toe variant built with React, TypeScript, and Vite. Orbit redefines the classic game by placing it on a 4-ring orbital grid where winning requires aligning four markers across unconventional trajectories.

**[🚀 Live Demo](https://orbit-circle-tic-tac-toe.vercel.app/)**

## 🚀 Features

- **Unique Circular Gameplay**: Play on a 4-ring board with 32 possible locations. Win by aligning 4 markers radially, circularly, or along complex spiral paths.
- **Flight Manual**: An interactive, in-game rules guide illustrating all win conditions with a focused, enlarged board view.
- **Multiplayer Modes**:
  - **SOLO**: Challenge a sophisticated AI with three difficulty levels: Beginner, Pro, and Impossible.
  - **DUO**: Local couch co-op play.
  - **ONLINE**: Real-time peer-to-peer multiplayer powered by PeerJS. "Mission Control" lobby system for hosting and joining via frequency codes.
- **Modern UI/UX**:
  - Immersive "Mission Control" interface with fluid, physics-aware transitions.
  - Seamless Dark and Light theme support with system persistence.
  - High-precision SVG-based game board with interactive animations and dashed win-path trajectories.
  - Zero layout shift architecture.

## 🛠️ Technical Stack

- **React 19** & **TypeScript**: For robust state management and type-safe game logic.
- **Tailwind CSS**: Precision styling using the OKLCH color system for better perceptual uniformity.
- **PeerJS**: For decentralized, real-time WebRTC connectivity.
- **Vite**: Ultra-fast development environment and optimized production builds.
- **Vercel**: Automated CI/CD and global edge hosting.

## 🛠️ Installation

```powershell
# Install dependencies
npm install

# Start development server
npm run dev
```

## 🎮 How to Play

1. **Select Mode**: Choose between SOLO, DUO, or ONLINE in the top navigation.
2. **Consult the Manual**: Click the **?** icon in the header to view the **Flight Manual**, which visualizes all winning alignments.
3. **Win Conditions**:
   - **Radial**: 4 markers aligned from the center to the edge.
   - **Circular**: 4 markers along the same concentric ring.
   - **Spiral**: 4 markers moving across rings and slices in a clockwise or counter-clockwise curve.
4. **Victory**: The system automatically detects and highlights the winning trajectory with an animated orbital path.

---
*Built with precision for the next generation of strategy.*
