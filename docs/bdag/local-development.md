# Local Development Guide

*This document provides comprehensive setup and development guidance for local BlockDAG development.*

## Overview

Local development uses Hardhat's built-in network with automatic test token funding and comprehensive testing capabilities.

## Local Environment Benefits

- **Automatic Funding**: Testing accounts receive test ETH automatically
- **Fast Execution**: Instant blockchain interactions
- **Comprehensive Testing**: Full test suite runs locally
- **Debugging**: Easy debugging with Hardhat's built-in tools

## Development Workflow

### 1. Initial Setup

```bash
# Clone and install dependencies
git clone <repository-url>
cd comet
yarn install
yarn build

# Verify setup
yarn hardhat compile
```

### 2. Running Tests Locally

```bash
# Basic sanity test
yarn hardhat test test/sanity-test.ts --network hardhat

# Core functionality tests
yarn hardhat test test/supply-test.ts --network hardhat
yarn hardhat test test/withdraw-test.ts --network hardhat
yarn hardhat test test/balance-test.ts --network hardhat

# Advanced features
yarn hardhat test test/rewards-test.ts --network hardhat
yarn hardhat test test/absorb-test.ts --network hardhat
yarn hardhat test test/price-feed-test.ts --network hardhat

# Complete test suite
yarn hardhat test --network hardhat
```

### 3. Local Deployment

```bash
# Deploy DAI market
yarn hardhat deploy --network hardhat --deployment dai

# Simulate deployment (no actual deployment)
yarn hardhat deploy --network hardhat --deployment dai --simulate
```

### 4. Debugging and Development

```bash
# Run with debug logging
DEBUG=* yarn hardhat deploy --network hardhat --deployment dai

# Interactive Hardhat console
yarn hardhat console --network hardhat

# Gas reporting
REPORT_GAS=true yarn hardhat test --network hardhat
```

## Local Testing Advantages

- **Mock Price Feeds**: No external dependencies for price data
- **Controlled State**: Predictable blockchain state for testing
- **Integration Tests**: Full protocol integration testing
- **Scenario Testing**: High-level protocol scenario validation

## What You Need to Document Next

This local development guide should include:

- **Detailed setup instructions** for different development scenarios
- **Debugging techniques** and common debugging scenarios
- **Test writing guidelines** and best practices
- **Performance optimization** tips for local testing
- **Integration with external tools** (debuggers, analyzers)
- **Debugging common deployment issues** and solutions

## Related Documentation

- [Quick Start Guide](./quick-start.md) - Initial setup overview
- [Testing Guide](./testing-guide.md) - Comprehensive testing documentation
- [Deployment Process](./deployment-process.md) - Understanding deployment flow
