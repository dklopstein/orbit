# Orbit

A sophisticated circular Tic-Tac-Toe variant built with React, TypeScript, and Vite. Orbit redefines the classic game by placing it on a 3-ring relationship graph where connections represent orbital paths and radial segments.

## 🚀 Features

- **Unique Circular Gameplay**: Play on a 4-ring board with 32 possible locations. Win by aligning 4 markers radially, circularly, or along diagonal orbital paths.
- **Multiplayer Modes**:
  - **SOLO**: Challenge an AI with three difficulty levels: Beginner, Pro, and Impossible.
  - **DUO**: Local couch co-op play.
  - **ONLINE**: Real-time peer-to-peer multiplayer powered by PeerJS. "Mission Control" lobby system for hosting and joining via frequency codes.
- **Modern UI/UX**:
  - Immersive "Mission Control" interface with fluid transitions.
  - Graceful Dark and Light theme support.
  - Responsive SVG-based game board with interactive animations.
  - Zero layout shift during state transitions.
- **Technical Stack**:
  - **React 19** with TypeScript for robust state management.
  - **Tailwind CSS** for precision styling and OKLCH color system.
  - **PeerJS** for decentralized online connectivity.
  - **Vite** for ultra-fast development and building.

## 🛠️ Installation

```powershell
# Install dependencies
npm install

# Start development server
npm run dev
```

## 🎮 How to Play

1. **Select Mode**: Choose between SOLO, DUO, or ONLINE in the top navigation.
2. **Radial Alignment**: Align 4 of your markers along one of the 8 radial lines.
3. **Circular Alignment**: Align 4 markers within one of the 4 concentric rings.
4. **Orbital Alignment**: Align markers across rings and segments to form a winning path.
5. **Win**: The system will automatically detect and highlight the winning orbit with a dashed trajectory.

---
*Built with precision for the next generation of strategy.*
