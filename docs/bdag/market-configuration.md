# Market Configuration Guide

*This document explains how to configure lending markets, asset parameters, and market-specific settings.*

## Overview

Market configuration defines the lending market parameters including supported assets, collateralization factors, supply caps, and price feeds.

## Configuration Structure

### Base Market Configuration

Each market deployment requires a `configuration.json` file in `deployments/{network}/{market}/configuration.json`:

**Required Fields:**
- `baseToken`: Primary asset for borrowing (e.g., USDC, DAI)
- `baseTokenPriceFeed`: Price feed address for base token
- `trackingIndexScale`: Precision multiplier for calculations
- `assets`: Array of supported collateral assets

### Asset Configuration Parameters

For each supported asset:

```json
{
  "asset": "asset_address",
  "priceFeed": "price_feed_address",
  "decimals": 18,
  "borrowCollateralFactor": "800000000000000000",
  "liquidateCollateralFactor": "900000000000000000", 
  "liquidationFactor": "1040000000000000000",
  "supplyCap": "100000000000000000000000"
}
```

### Key Configuration Parameters

**Collateral Factors:**
- `borrowCollateralFactor`: Maximum ratio for borrowing against collateral
- `liquidateCollateralFactor`: Threshold for liquidation eligibility
- `liquidationFactor`: Bonus incentive for liquidators

**Supply Management:**
- `supplyCap`: Maximum total supply for each asset
- `reserveFee`: Fee percentage for protocol reserves

**Price Feed Integration:**
- `priceFeed`: Contract address for asset price data
- `maxOracleStaleness`: Maximum acceptable age of price data

## Network-Specific Considerations

### Price Feed Requirements

Different networks require different price feed configurations:

- **Mock Feeds**: Local development networks use mock price feeds
- **Chainlink**: Production networks typically use Chainlink price feeds
- **Bridge Feeds**: Cross-chain deployments may require bridge price feeds

### Asset Limitations

Some assets have network-specific limitations:

- **Native Tokens**: Each network has its native token (ETH, MATIC, etc.)
- **Staking Tokens**: Special considerations for staked derivatives (stETH, etc.)
- **Bridge Tokens**: Tokens bridged between networks may have different properties

## Configuration Best Practices

### Security Considerations

- **Conservative Factors**: Start with conservative collateral factors for new assets
- **Gradual Adjustments**: Change market parameters through governance proposals
- **Oracle Validation**: Ensure price feed reliability and accuracy

### Performance Optimization

- **Supply Caps**: Set appropriate caps based on network capacity
- **Liquidation Incentives**: Balance liquidation factor for liquidator participation
- **Fee Structure**: Optimize fees for protocol sustainability

## What You Need to Document Next

This market configuration guide should include:

- **Configuration validation procedures** and sanity checks
- **Risk management strategies** for parameter adjustments
- **Asset adding workflow** and requirements
- **Emergency configuration changes** and procedures
- **Market parameter optimization** techniques
- **Cross-network compatibility** considerations

## Related Documentation

- [Network Configuration](./network-configuration.md) - Understanding network-specific requirements
- [Governance System](./governance-system.md) - Making configuration changes through governance
- [Environment Configuration](./environment-configuration.md) - Required setup for configuration
- [Deployment Process](./deployment-process.md) - How configuration affects deployment
