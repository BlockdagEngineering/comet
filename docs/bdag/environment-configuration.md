# Environment Configuration

*This document details the required environment variables and API keys for BlockDAG development.*

## Overview

The BlockDAG environment requires specific API keys for blockchain explorers and services. Most keys can use placeholder values except for ETHERSCAN_KEY.

## Required Environment Variables

### Core API Keys

- **ETHERSCAN_KEY**: Required for contract verification and mainnet contract cloning
- **INFURA_KEY**: Blockchain RPC endpoints
- **ANKR_KEY**: Alternative RPC endpoints

### Network-Specific Explorer Keys

- **SNOWTRACE_KEY**: Avalanche explorer
- **POLYGONSCAN_KEY**: Polygon explorer  
- **ARBISCAN_KEY**: Arbitrum explorer
- **LINEASCAN_KEY**: Linea explorer
- **OPTIMISMSCAN_KEY**: Optimism explorer
- **MANTLESCAN_KEY**: Mantle explorer
- **SCROLLSCAN_KEY**: Scroll explorer
- **UNICHAIN_QUICKNODE_KEY**: Unichain quicknode endpoint

### BDAG-Specific Variables

For BDAG governor deployment:

- **GOV_SIGNERS**: Comma-separated admin addresses for multisig governor
- **MULTISIG_THRESHOLD**: Required number of approvals for proposals
- **TIMELOCK_DELAY**: Delay before transaction execution (0 for development)
- **GRACE_PERIOD**: Grace period after delay expires
- **MINIMUM_DELAY** / **MAXIMUM_DELAY**: Timelock delay bounds

### Security Considerations

**Important Security Notes:**

- API keys should be kept secure and not committed to version control
- Use placeholder values for non-critical keys when setting up development environment
- Only ETHERSCAN_KEY requires a real value for mainnet contract operations

## What You Need to Document Next

This environment configuration guide should include:

- **Detailed setup instructions** for each API key
- **Security best practices** for managing secrets
- **Environment validation** scripts or commands
- **Template .env file** with all required variables
- **Platform-specific instructions** for obtaining API keys
- **Troubleshooting section** for common configuration issues

## Related Documentation

- [Quick Start Guide](./quick-start.md) - Initial setup overview
- [Deployment Process](./deployment-process.md) - How environment config affects deployment
- [Network Configuration](./network-configuration.md) - Network-specific settings
