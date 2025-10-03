# BDAG Governance System

*This document describes the custom BDAG governance implementation and how it differs from standard Compound governance.*

## Overview

The BDAG fork implements a custom multisig governance system as an alternative to token-based voting systems, designed specifically for BlockDAG network requirements.

## Governance Architecture

### Custom Governor Implementation

- **Contract**: `contracts/CustomGovernor.sol`
- **Pattern**: Multisig with admin approvals instead of token voting
- **Upgradeability**: UUPS upgradeable for future improvements
- **Interface**: Implements `IGovernorBravo` for compatibility

### Key Differences from Standard Governance

| Feature | Standard Governor Bravo | BDAG Custom Governor |
|---------|------------------------|---------------------|
| **Approval Mechanism** | Token voting | Admin multisig |
| **Threshold** | Token vote count | Admin signature count |
| **Upgradeability** | Upgradeable proxy | UUPS upgradeable |
| **Security Model** | Token holders | Multisig signers |

### SimpleTimelock Integration

The BDAG governance uses a simplified timelock where:

- **Governor**: Encodes function signatures in calldata
- **Timelock**: Executes pre-encoded calldata directly
- **Security**: Clean separation of encoding vs execution responsibilities

## Configuration Requirements

### Environment Variables

```bash
# Required for BDAG governance setup
GOV_SIGNERS=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6,0x1234567890123456789012345678901234567890
MULTISIG_THRESHOLD=2
TIMELOCK_DELAY=0                    # 0 for development, non-zero for production
GRACE_PERIOD=1209600                # 2 weeks
MINIMUM_DELAY=0                     # Minimum allowed delay
MAXIMUM_DELAY=2592000               # 30 days
```

### Governance Flow

1. **Infrastructure Deployment**: Deploy governance contracts with BDAG flag
2. **Proposal Creation**: Create governance proposals for market changes
3. **Multisig Approval**: Required number of admins approve the proposal
4. **Queue & Execute**: After threshold approval, queue and execute transaction
5. **Upgrade Handling**: Implementations upgrades follow same governance process

### Security Considerations

**Why UUPS over Transparent Proxy:**

- **Proxy Admin Control**: In Transparent Proxy, proxy admin ownership is critical
- **Security Risk**: EOA controlling proxy admin compromises all future security
- **UUPS Benefit**: Governor contract itself manages upgrades autonomously

## What You Need to Document Next

This governance system guide should include:

- **Detailed governance flow** with step-by-step procedures
- **Security analysis** comparing multisig vs token voting
- **Upgrade procedures** and best practices
- **Failover mechanisms** and emergency procedures
- **Integration testing** for governance functions
- **Real-world deployment** considerations

## Related Documentation

- [Deployment Process](./deployment-process.md) - How governance integrates with deployment
- [Market Configuration](./market-configuration.md) - Governance influence on market parameters
- [Environment Configuration](./environment-configuration.md) - Required configuration for governance
