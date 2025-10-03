# Network Configuration

*This document explains the network configuration system used for deployments.*

## Overview

The BlockDAG project supports multiple blockchain networks through a centralized configuration system in `hardhat.config.ts`.

## Network Configuration Structure

### Supported Networks

- **hardhat**: Local development network
- **local**: Local hardhat fork
- **bdag-primordial**: BlockDAG primordial network
- **mainnet**: Ethereum mainnet
- **polygon**: Polygon network
- **arbitrum**: Arbitrum network
- **optimism**: Optimism network
- **scroll**: Scroll network
- **linea**: Linea network
- **mantle**: Mantle network

### Deployment Manager Configuration

Each network has a unique configuration mapping deployments to their relation configs:

```typescript
deploymentManager: {
  networks: {
    'bdag-primordial': {
      dai: bdagPrimordialDaiRelationConfigMap,
      _infrastructure: bdagPrimordialInfrastructureRelationConfigMap
    },
    'local': {
      dai: localDaiRelationConfigMap,
      _infrastructure: localInfrastructureRelationConfigMap
    }
  }
}
```

### Relation Configuration Files

Each deployment requires specific relationship files:

- `deployments/{network}/{deployment}/relations.ts` - Network-specific relations
- `deployments/relations.ts` - Base relations shared across networks
- `deployments/relations.market.ts` - Market-specific relations
- `deployments/relations.infra.ts` - Infrastructure-specific relations

## Network Setup Requirements

### Adding New Networks

1. **Network Entry**: Add network to `networkConfigs` array
2. **Deployment Manager**: Add network to `deploymentManager.networks`
3. **Relation Configs**: Create network-specific relation configuration files
4. **Infrastructure**: Deploy governance contracts for new network

### Network Dependencies

- **Infrastructure**: Governance contracts must be deployed first
- **Market Configs**: Each market needs specific configuration
- **Price Feeds**: Network-specific price feed addresses required

## What You Need to Document Next

This network configuration guide should include:

- **Detailed network addition process** with step-by-step instructions
- **Network-specific requirements** and limitations
- **Configuration validation** procedures

## Related Documentation

- [Deployment Process](./deployment-process.md) - How networks affect deployment
- [Environment Configuration](./environment-configuration.md) - Network-specific API keys
- [Market Configuration](./market-configuration.md) - Market-specific network settings
