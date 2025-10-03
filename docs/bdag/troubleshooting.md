# Troubleshooting Guide

*This document provides solutions for common issues encountered during BlockDAG development and deployment.*

## Overview

This troubleshooting guide covers frequent problems and their solutions for BlockDAG Comet development, deployment, and testing.

## Common Issues and Solutions

### Deployment Issues

#### Contract Verification Failures
- **Problem**: Contracts fail verification on block explorers
- **Solution**: Ensure API keys are correctly configured and verification is enabled

#### Network Connection Errors
- **Problem**: Cannot connect to target network during deployment
- **Solution**: Verify RPC endpoints are accessible and properly configured

#### Deployment Cache Conflicts  
- **Problem**: Deployment fails due to cached contract conflicts
- **Solution**: Clear deployment cache: `rm -rf deployments/{network}/{market}/.contracts/`

### Testing Issues

#### Fork Tests Failing
- **Problem**: Tests that fork from mainnet fail with RPC errors
- **Solution**: Ensure ANKR_KEY environment variable is set with valid API key

#### Account Funding Issues
- **Problem**: Insufficient funds for testing on real networks
- **Solution**: Use local network for development or fund test accounts properly

#### Test Environment Isolation
- **Problem**: Tests interfere with each other due to state conflicts
- **Solution**: Implement proper test setup and teardown procedures

### Governance Issues

#### Spider Implementation Mismatch
- **Problem**: Spider reports implementation address mismatch after deployment
- **Expected Behavior**: This is normal and requires updating aliases.json
- **Solution**: Update `comet:implementation` address in aliases.json to match deployed implementation

#### Proposal Execution Failures
- **Problem**: Governance proposals fail to execute
- **Solution**: Verify sufficient threshold approvals and proper queue timing

### Configuration Issues

#### Price Feed Failures
- **Problem**: Market operations fail due to price feed errors
- **Solution**: Verify price feed addresses are correct and accessible

#### Asset Configuration Errors
- **Problem**: Invalid asset parameters causing deployment failures
- **Solution**: Validate configuration.json against supported parameters

## Debugging Techniques

### Enable Debug Logging
```bash
DEBUG=* yarn hardhat deploy --network local --deployment dai
```

### Use Hardhat Console
```bash
yarn hardhat console --network hardhat
```

### Check Deployment Status
```bash
# Verify deployment cache
ls deployments/local/dai/.contracts/

# Check spider status  
yarn hardhat spider --network local --deployment dai
```

### Network-Specific Debugging

#### Local Development
- Check Hardhat configuration
- Verify local network connectivity
- Review contract compilation

#### Testnet/Mainnet
- Validate RPC endpoint accessibility
- Confirm account funding
- Check gas price estimation

## Emergency Procedures

### Rollback Procedures
- Document how to rollback failed deployments
- Governance proposal for reverting market changes
- Emergency pause mechanisms

### Recovery Procedures
- Contract upgrade rollback
- Oracle failure handling
- Market parameter recovery

## What You Need to Document Next

This troubleshooting guide should include:

- **Diagnostic checklists** for common error patterns
- **Network-specific issues** and solutions
- **Performance debugging** procedures
- **Security incident response** procedures
- **Integration testing failures** and resolution
- **Community-reported issues** database

## Related Documentation

- [Environment Configuration](./environment-configuration.md) - Common environment issues
- [Deployment Process](./deployment-process.md) - Deployment-specific troubleshooting
- [Testing Guide](./testing-guide.md) - Testing issue resolution
- [Network Configuration](./network-configuration.md) - Network-specific problems
