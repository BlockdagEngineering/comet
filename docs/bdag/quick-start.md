# Quick Start Guide

*This document provides a quick overview of getting started with BlockDAG development.*

## Prerequisites

- Node.js and Yarn installed
- Git access to the repository
- Basic understanding of Ethereum/blockchain development

## Overview of Process

1. **Environment Setup** - Configure API keys and environment variables
2. **Local Testing** - Deploy and test on local network
3. **Network Deployment** - Deploy to target blockchain networks

## Quick Commands

### Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Install dependencies
yarn install
yarn build
```

### Local Development
```bash
# Deploy DAI market locally
yarn hardhat deploy --network hardhat --deployment dai

# Run basic tests
yarn hardhat test test/sanity-test.ts --network hardhat
```

### Network Deployment
```bash
# Deploy with BDAG governor
yarn hardhat deploy --bdag --network local --deployment dai

# Run verification tests
export MARKET=dai && yarn hardhat test test/deployment-verification-test.ts --network local
```

## What You Need to Document Next

This quick start guide should include:

- **Detailed environment setup** with all required API keys
- **Step-by-step walkthrough** for first-time users
- **Examples for different markets** (DAI, USDC, WETH)
- **Connections to deployment guides** for detailed procedures
- **Troubleshooting section** for common setup issues
- **Screen recordings or screenshots** of the deployment process

## Related Documentation

- [Environment Configuration](./environment-configuration.md) - Detailed API key setup
- [Local Development](./local-development.md) - Complete local setup guide
- [Deployment Process](./deployment-process.md) - Detailed deployment walkthrough
