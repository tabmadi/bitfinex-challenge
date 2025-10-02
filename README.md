# 🚀 Grenache Microservices Template

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Bun](https://img.shields.io/badge/Bun-1.2-orange.svg)](https://bun.sh/)
[![Biome](https://img.shields.io/badge/Biome-1.9-green.svg)](https://biomejs.dev/)
[![Grenache](https://img.shields.io/badge/Grenache-1.0-green.svg)](https://github.com/bitfinexcom/grenache)

A modern, production-ready template for Grenache microservices projects with all the essential tools and configurations
you need to get started with distributed microservices quickly! 🎯

Based on the [Bitfinex Grenache tutorial](https://blog.bitfinex.com/tutorial/bitfinex-loves-microservices-grenache/).

## ✨ Features

This template comes pre-configured with:

- 🔥 **Bun Runtime**: Ultra-fast JavaScript runtime and package manager
- 🌐 **Grenache Microservices**: Distributed microservice architecture with DHT-based service discovery
- 🧹 **Biome**: Fast linter and formatter (Prettier + ESLint replacement)
- 📦 **Monorepo Structure**: Bun workspace with Moonrepo for task management
- 🔗 **WebSocket Communication**: Server-client communication via Grenache WebSocket transport
- 🚨 **Git Integration**: Pre-configured with Biome VCS integration
- 🪝 **Git Hooks**: Lefthook for automated quality checks
- 📝 **GitHub Templates**: CODE_OF_CONDUCT.md, SECURITY.md, and LICENSE included
- ⚡ **Proto Tool Manager**: Automated tool management with [moonrepo proto](https://moonrepo.dev/proto)

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

## 📋 Customization

To customize this template for your project:

1. **Update package.json files** with your project details in root and each app
2. **Modify the microservices** in `apps/server/index.js` and `apps/client/index.js` to fit your needs
3. **Adjust Biome configs** in `libs/biome/` as needed
4. **Configure Grape DHT ports** in `apps/grape/package.json` for your network setup
5. **Update this README** with your project-specific information

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
