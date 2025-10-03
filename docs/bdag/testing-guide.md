# Testing Guide

*This document provides comprehensive testing procedures and validation workflows for BlockDAG development.*

## Overview

The BlockDAG project includes extensive testing capabilities covering basic functionality, advanced features, and deployment verification.

## Test Categories

### 1. Basic Tests
```bash
# Sanity check for basic functionality
yarn hardhat test test/sanity-test.ts --network hardhat
```

### 2. Core Functionality Tests
```bash
# Supply operations
yarn hardhat test test/supply-test.ts --network hardhat

# Withdraw operations  
yarn hardhat test test/withdraw-test.ts --network hardhat

# Balance operations
yarn hardhat test test/balance-test.ts --network hardhat
```

### 3. Advanced Feature Tests
```bash
# Rewards system
yarn hardhat test test/rewards-test.ts --network hardhat

# Liquidation mechanics
yarn hardhat test test/absorb-test.ts --network hardhat

# Price feed integration
yarn hardhat test test/price-feed-test.ts --network hardhat
```

### 4. Complete Test Suite
```bash
yarn hardhat test --network hardhat
```

## Deployment Verification Testing

### Custom Verification Test

The `deployment-verification-test.ts` provides comprehensive deployment validation:

**What it Verifies:**
- ✅ Ownership relationships (timelock admin, comet governor, proxy admin)
- ✅ Base token configuration (token address, price feed)
- ✅ Asset configurations (supply caps, collateral factors, price feeds)
- ✅ Custom governor setup (BDAG multisig vs standard Governor Bravo)
- ✅ Proxy implementation (upgradeable contract linkage)

**Usage:**
```bash
# Test local DAI deployment
export MARKET=dai && yarn hardhat test test/deployment-verification-test.ts --network local

# Test Polygon USDC deployment
export MARKET=usdc && yarn hardhat test test/deployment-verification-test.ts --network polygon

# Test Base WETH deployment
export MARKET=weth && yarn hardhat test test/deployment-verification-test.ts --network base
```

**Expected Output:**
```
🔍 Testing deployment on network: local, market: dai
✅ Custom BDAG governor detected and verified
```

## Testing on Different Networks

### Local Network Testing
- **Advantage**: No funding required, tests run instantly
- **Limitation**: May not catch network-specific issues

### Testnet/Mainnet Testing
- **Consideration**: Requires funded accounts for gas and token interactions
- **Security**: Never test with large token amounts on mainnet

### Custom Test Scenarios
- **Integration**: Combine multiple market operations
- **Edge Cases**: Test boundary conditions and error states
- **Performance**: Measure gas usage and execution efficiency

## Testing Setup Requirements

### Environment Requirements
- **ANKR_KEY**: Required for tests that fork from mainnet
- **Network Access**: Ensure RPC endpoints are accessible
- **Account Funding**: Fund test accounts if testing on real networks

### Test Data Management
- **Isolation**: Tests should not interfere with each other
- **Cleanup**: Proper state cleanup between tests
- **Consistency**: Maintained test data across different runs

## What You Need to Document Next

This testing guide should include:

- **Test-driven development practices** and methodology
- **Performance benchmarking** and optimization guidelines
- **Security testing procedures** and best practices
- **Integration testing strategies** for complex deployments
- **Automated testing workflows** and CI/CD integration
- **Debugging failed tests** procedures and common solutions

## Related Documentation

- [Local Development](./local-development.md) - Setting up local testing environment
- [Deployment Process](./deployment-process.md) - Testing after deployment
- [Network Configuration](./network-configuration.md) - Testing across different networks
