# Deployment Caching

*This document explains how the deployment caching system works and its implications for BlockDAG development.*

## Overview

The BlockDAG deployment system uses caching to avoid re-deploying existing contracts, improving development efficiency and ensuring consistency across team members.

## Cache Structure

### Cache Location
```
deployments/{network}/{deployment}/.contracts/
├── cache.json          # Contract addresses and metadata
├── governor.json       # Governor contract details
├── comet.json         # Comet contract details
└── ...                # Other deployed contracts
```

### Cache Behavior
1. **First Deployment**: Contracts are deployed and cached
2. **Subsequent Runs**: Contracts are loaded from cache
3. **Tests**: Use cached contract addresses automatically

## BlockDAG-Specific Considerations

### No Explorer APIs
Unlike standard networks, BlockDAG networks don't have block explorer APIs yet, which means:

- **Manual Cache Management**: Contract addresses must be committed to repository
- **Team Consistency**: All team members need access to same contract instances
- **Deployment Preservation**: Cache files preserve contract state across repository clones

### Cache Management
```bash
# Check if contracts are cached
ls deployments/local/dai/.contracts/

# Clear cache to force re-deployment
rm -rf deployments/local/dai/.contracts/
yarn hardhat deploy --bdag --network local --deployment dai
```

## Benefits

- **Faster Development**: No need to re-deploy for each test
- **Consistent State**: Tests use same contract instances
- **Cost Savings**: Avoid unnecessary gas costs on real networks

## What You Need to Document Next

This deployment caching guide should include:

- **Cache management best practices** and workflows
- **Synchronization procedures** for team development
- **Cache troubleshooting** and recovery procedures
- **Integration with CI/CD** pipelines for automated deployments
- **Version control considerations** for cache files

## Related Documentation

- [Deployment Process](./deployment-process.md) - How caching affects deployment
- [Local Development](./local-development.md) - Local cache usage
- [Troubleshooting](./troubleshooting.md) - Common caching issues
