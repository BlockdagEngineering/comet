# Comet Reconfiguration Limitations

*This document details critical restrictions when reconfiguring Comet markets and their implications.*

## Overview

**Critical Restriction**: Comet has strict limitations on market reconfiguration to prevent breaking user balances and accounting errors.

## Core Restriction

The Comet contract enforces this validation:

```solidity
if (oldConfiguration.baseToken != address(0) &&
    (oldConfiguration.baseToken != newConfiguration.baseToken ||
     oldConfiguration.trackingIndexScale != newConfiguration.trackingIndexScale))
    revert ConfigurationAlreadyExists();
```

## What Cannot Be Changed

### ❌ Forbidden Changes
- **Base Token Changes**: USDC → DAI, USDC → WETH, etc.
- **Tracking Index Scale Changes**: 1e18 → 1e6, etc.

### ✅ Allowed Changes  
- Asset configurations (add/remove supported assets)
- Collateral factors adjustments
- Supply cap modifications
- Price feed updates
- Reserve fee changes

## Tracking Index Scale Values

Standard tracking index scales by asset type:

```solidity
1e18  // 18 decimals (WETH, most ERC20 tokens)
1e6   // 6 decimals (USDC, USDT)
1e8   // 8 decimals (WBTC)
```

## Implications for BDAG Development

### Initial Configuration Is Critical

- **Market Design**: Choose base token carefully as it cannot be changed
- **Scale Selection**: Tracking index scale must match base token decimals
- **Future Flexibility**: Only secondary parameters can be modified in the future

### Examples

**✅ Valid Reconfiguration:**
- Change USDC market: Add new collateral assets, adjust collateral factors
- Existing base token: `0xUSDC`, existing scale: `1e6`
- Proposal still uses: `0xUSDC` as base token, `1e6` as tracking scale

**❌ Invalid Reconfiguration:**
- Try to change USDC market to DAI market (different base token)
- Try to change 1e6 scale to 1e18 scale (different tracking precision)

## Why This Restriction Exists

### Technical Reasons
- **User Balances**: Base token changes would break existing user account balances
- **Accounting Precision**: Scale changes affect all financial calculations
- **Storage Layout**: Core parameters are deeply integrated into contract storage

### Security Considerations
- **Accidental Exposure**: Prevents accidental market breaking through governance
- **Consistency**: Ensures market maintains consistent behavior over time
- **Upgrade Safety**: Allows safe parameter adjustments without core changes

## Best Practices

### Planning Your Market
1. **Choose Base Token Wisely**: Consider long-term market needs
2. **Verify Scale Requirements**: Ensure tracking scale matches token decimals
3. **Test Configuration**: Validate initial configuration thoroughly before deployment

### Making Changes
1. **Verify Alignment**: Ensure proposed changes maintain base token and scale
2. **Use Governance**: All changes must go through proper governance process
3. **Test Thoroughly**: Validate configuration changes before execution

## What You Need to Document Next

This limitations guide should include:

- **Market planning checklists** before initial deployment
- **Configuration validation scripts** and tools
- **Migration strategies** when limitation conflicts are encountered
- **Real-world examples** of valid vs invalid reconfiguration attempts
- **Integration with governance** procedures for compliant changes

## Related Documentation

- [Market Configuration](./market-configuration.md) - Understanding configuration parameters
- [Governance System](./governance-system.md) - Making configuration changes through governance
- [Deployment Process](./deployment-process.md) - Ensuring proper initial configuration
