# Deployment Process Guide

*This document provides detailed step-by-step instructions for deploying and managing Comet markets.*

## Overview

The BlockDAG deployment process uses automated scripts and manual procedures to deploy governance infrastructure and lending markets.

## Deployment Execution Flow

### 1. Task Registration & Loading
- Hardhat loads task definitions from `tasks/deployment_manager/task.ts`
- Command line arguments are parsed: `network`, `deployment`, `bdag` flag
- Environment and network configuration is established

### 2. DeploymentManager Initialization
- Creates DeploymentManager instance with network and deployment parameters
- Establishes deployment cache for contract reuse
- Sets up contract discovery and relationship mapping

### 3. Deployment Script Execution
- Loads appropriate `deployments/{network}/{deployment}/deploy.ts` script
- Imports and executes the deployment function
- Handles governance contract cloning (COMP token, Governor implementation)

### 4. Contract Deployment Sequence
1. **Governance Infrastructure**: Deploy timelock, governor, COMP token
2. **Token Deployment**: Deploy market tokens (DAI, USDC, etc.)
3. **Price Feed Setup**: Configure asset price feeds
4. **Comet Deployment**: Deploy main Comet market contract
5. **Configuration**: Apply initial market parameters

### 5. Verification & Caching
- Contract verification (when applicable)
- Cache storage for future deployments
- Logging of deployment statistics and gas usage

## Automated vs Manual Deployment

### Automated Scripts (Recommended)

**Market Deployment Script:**
```bash
./scripts/deploy-market/index.sh -n local -d dai
```

**Reward Funding Script:**
```bash
./scripts/comet-reward-funding/index.sh -n local
```

### Manual Deployment Process

1. **Infrastructure Deployment:**
```bash
DEBUG=* yarn hardhat deploy_infrastructure --network local --bdag
```

2. **Market Deployment:**
```bash
DEBUG=* yarn hardhat deploy --network local --deployment dai --bdag
```

3. **Governance Flow:**
```bash
# Check proposal status
yarn hardhat governor:status --network local --proposal-id 1

# Approve proposal (repeat until threshold reached)
yarn hardhat governor:approve --network local --proposal-id 1

# Queue and execute
yarn hardhat governor:queue --network local --proposal-id 1
yarn hardhat governor:execute --network local --proposal-id 1 --execution-type comet-impl-in-configuration
```

## Contract Cloning Mechanism

### Mainnet Contract Cloning

```typescript
const clone = {
  comp: '0xc00e94cb662c3520282e6f5717214004a7f26888',
  governorBravoImpl: '0xef3b6e9e13706a8f01fe98fdcf66335dc5cfdeed',
  governorBravo: '0xc0da02939e1441f497fd74f78ce7decb17b66529',
};
```

**What Gets Cloned:**
- Contract bytecode and storage layout
- Constructor arguments and initial state
- Verification data for compatibility

## What You Need to Document Next

This deployment process guide should include:

- **Troubleshooting section** for common deployment failures
- **Network-specific considerations** and limitations
- **Performance optimization** tips for deployment efficiency
- **Security considerations** during deployment process
- **Integration testing** procedures post-deployment
- **Rollback procedures** and disaster recovery

## Related Documentation

- [Environment Configuration](./environment-configuration.md) - Required setup before deployment
- [Network Configuration](./network-configuration.md) - Understanding target networks
- [Testing Guide](./testing-guide.md) - Validating deployments
- [Governance System](./governance-system.md) - Managing deployed markets
