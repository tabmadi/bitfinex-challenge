# 🚀 BFX Challenge - P2P Distributed Exchange

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Bun](https://img.shields.io/badge/Bun-1.2-orange.svg)](https://bun.sh/)
[![Biome](https://img.shields.io/badge/Biome-1.9-green.svg)](https://biomejs.dev/)
[![Grenache](https://img.shields.io/badge/Grenache-1.0-green.svg)](https://github.com/bitfinexcom/grenache)

Implementation of the Bitfinex challenge to create a simplified P2P distributed exchange using Grenache microservices.
Each exchange node maintains its own order book instance and communicates with other nodes for order distribution and
matching.

**Challenge Details**: See [CHALLENGE.md](CHALLENGE.md) for the complete challenge description and requirements.

## ✨ Architecture

This P2P distributed exchange implementation includes:

- 🔥 **Exchange Engine** (`apps/exchange-engine`): Our main P2P exchange node with a simple order book implementation
- 🔗 **Trading Client** (`apps/trading-client`): Testing client for submitting orders and interacting with exchange nodes
- 🍇 **Grape Cluster** (`apps/grape`): Helps run the Grenache DHT cluster for service discovery
- 🌐 **Service Discovery**: Uses Grenache's DHT-based service discovery to find other exchange nodes
- 📊 **Order Book Synchronization**: Exchange nodes share order book updates across the network
- ⚡ **Real-time Matching**: Simple order matching engine with price-time priority
- 🧹 **Code Quality**: Biome for linting and formatting, Lefthook for Git hooks
- 📦 **Development Tools**: Bun runtime, Moonrepo workspace management, Proto tool manager

## ⚠️ Known Issues & Limitations

As this is a time-constrained challenge implementation, there are several known issues that require more development
time:

### 1. Duplicate Data Exchange Issue

**Problem**: It's possible that we send the same data twice to the same exchange node.

**Proposed Solutions**:

- **Option A**: Find a way to get the full list of nodes from the Grenache cluster (uncertain if possible due to
  Kademlia protocol limitations)
- **Option B**: Add a unique identifier to each message to prevent duplicate storage

### 2. Race Condition in Order Matching

**Problem**: If two nodes simultaneously try to fill a buy order for the same sell order, the order gets matched twice.

**Proposed Solutions**:

- **Option A**: Designate only one node as the matcher (less P2P, more centralized)
- **Option B**: Implement a simple consensus protocol where nodes broadcast match intentions, wait for approval from all
  nodes, then execute the match

## 🚀 Quick Start

### Prerequisites

- [proto](https://moonrepo.dev/proto) - A multi-language version manager that will manage all required tools
- Alternatively, you can install tools separately:
    - [Bun](https://bun.sh/) (latest version)
    - [Biome](https://biomejs.dev/) (latest version)
    - [Moon](https://moonrepo.dev/) (latest version)

### Installation

1. **Use this template** by clicking the "Use this template" button on GitHub
2. **Clone your new repository**:
   ```bash
   git clone https://github.com/yourusername/your-project-name.git
   cd your-project-name
   ```
3. **Install tools and dependencies**:
   ```bash
   # Install all required tools (bun, biome, moon) using proto
   proto install
   
   # Install project dependencies
   bun install
   ```

### 🏃‍♂️ Running the Project

**Important**: You must start the components in this specific order:

1. **Start Grape DHT nodes** (required for service discovery):
   ```bash
   # Terminal 1: Start first grape node
   cd apps/grape
   bun run dev:grape1
   
   # Terminal 2: Start second grape node
   cd apps/grape  
   bun run dev:grape2
   ```

2. **Start the server** (after grape nodes are running):
   ```bash
   # Terminal 3: Start the microservice exchange-engine
   cd apps/exchange-engine
   bun run dev
   ```

3. **Start the client** (after server is running):
   ```bash
   # Terminal 4: Start the trading-client
   cd apps/trading-client
   bun run dev
   ```

## 🛠️ Development

### Available Scripts

#### Root Level Scripts

| Script            | Description                |
|-------------------|----------------------------|
| `bun run prepare` | Install Lefthook Git hooks |

#### Grape DHT Scripts (apps/grape)

| Script               | Description                              |
|----------------------|------------------------------------------|
| `bun run dev:grape1` | Start first grape DHT node (port 20001)  |
| `bun run dev:grape2` | Start second grape DHT node (port 20002) |

#### Server Scripts (apps/exchange-engine)

| Script           | Description                                 |
|------------------|---------------------------------------------|
| `bun run dev`    | Start development server with file watching |
| `bun run lint`   | Run Biome linter for server                 |
| `bun run format` | Format server code with Biome               |
| `bun run test`   | Run server tests                            |

#### Client Scripts (apps/trading-client)

| Script           | Description                   |
|------------------|-------------------------------|
| `bun run dev`    | Start development client      |
| `bun run lint`   | Run Biome linter for client   |
| `bun run format` | Format client code with Biome |
| `bun run test`   | Run client tests              |

### 🧹 Code Quality

This template uses **Biome** for both linting and formatting:

```bash
# Check for linting issues
bun run lint

# Auto-fix linting issues and format code
bun run format
```

### 🪝 Git Hooks & Conventional Commits

This template includes **Lefthook** for automated Git hooks and **Commitlint** for enforcing Conventional Commits:

#### Automatic Quality Checks

Git hooks will automatically run on:

- **Pre-commit**: Format code, run linter, and type-check
- **Commit-msg**: Validate commit message format
- **Pre-push**: Final lint and type checks

#### Conventional Commits

All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
# ✅ Valid commit messages
git commit -m "feat: add user authentication"
git commit -m "fix: resolve memory leak in data processing"
git commit -m "docs: update API documentation"
git commit -m "refactor: simplify error handling logic"

# ❌ Invalid commit messages
git commit -m "add feature"            # Missing type
git commit -m "Fix bug"                # Wrong case
git commit -m "feat!: breaking change" # Use BREAKING CHANGE footer instead
```

**Available commit types:**

- `feat` - New features
- `fix` - Bug fixes
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `build` - Build system changes
- `ci` - CI configuration changes
- `chore` - Other changes (maintenance, etc.)
- `revert` - Reverting previous commits

#### Managing Git Hooks

```bash
# Install hooks (automatically runs after `bun install`)
bun run prepare

# Skip hooks for a single commit (use sparingly)
git commit -m "feat: add feature" --no-verify

# Temporarily disable hooks
lefthook uninstall

# Re-enable hooks
lefthook install
```

### 📁 Project Structure

```
├── apps/                   # Monorepo applications
│   ├── grape/              # Grape DHT nodes for service discovery
│   │   ├── package.json    # Grape app dependencies and scripts
│   │   └── index.js        # Grape DHT node implementation
│   ├── exchange-engine     # Grenache microservice server
│   │   ├── package.json    # Server dependencies and scripts
│   │   └── index.js        # Server implementation
│   └── trading-client      # Grenache microservice client
│       ├── package.json    # Client dependencies and scripts
│       └── index.js        # Client implementation
├── libs/                   # Shared libraries
│   └── biome/              # Shared Biome configuration
├── .moon/                  # Moonrepo configuration
├── package.json            # Root workspace configuration
├── lefthook.yml            # Git hooks configuration
└── README.md               # You are here! 📍
```

## 🔧 Configuration

### Biome Configuration

The `biome.json` includes:

- All recommended rules enabled
- Tab indentation (configurable)
- Git integration
- Import organization

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run the linter and formatter: `bun run format`
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 🔧 Further Development

To extend this P2P exchange implementation:

1. **Fix Known Issues**: Implement solutions for duplicate data exchange and race condition problems
2. **Enhanced Order Book**: Add more sophisticated matching algorithms and order types
3. **Persistence**: Add database or file-based persistence for order history and state recovery
4. **Security**: Implement authentication, authorization, and message signing
5. **Monitoring**: Add logging, metrics, and health checks for production deployment
6. **UI Interface**: Create a web-based trading interface for easier interaction

## 🔒 Security

Please see [SECURITY.md](SECURITY.md) for our security policy and how to report security vulnerabilities.

## 📄 License

This project is licensed under the Apache License—see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Bun](https://bun.sh/) for the amazing runtime
- [Biome](https://biomejs.dev/) for fast linting and formatting
- [Grenache](https://github.com/bitfinexcom/grenache) for the microservices framework
- [Bitfinex](https://www.bitfinex.com/) for creating and maintaining Grenache
- [Moonrepo](https://moonrepo.dev/) for excellent monorepo tooling

---

**Happy coding! 🎉** If you find this template useful, please give it a ⭐️
