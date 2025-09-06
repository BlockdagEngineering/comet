#!/usr/bin/env ts-node

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { runGovernanceFlow, GovernanceFlowOptions } from '../helpers/governanceFlow';
import { ScriptUtils } from '../helpers/scriptUtils';

interface DeployOptions {
  network: string;
  deployment: string;
  clean?: boolean;
}

class MarketDeployer {
  private utils: ScriptUtils;
  private options: DeployOptions;

  constructor(options: DeployOptions) {
    this.options = options;
    this.utils = new ScriptUtils();
  }

  private async runCommand(command: string, description: string): Promise<void> {
    this.utils.log(`\n🔄 ${description}...`, 'info');
    try {
      execSync(command, { 
        stdio: 'inherit',
        encoding: 'utf8'
      });
      this.utils.log(`✅ ${description} completed successfully`, 'success');
    } catch (error) {
      this.utils.log(`❌ ${description} failed: ${error}`, 'error');
      throw error;
    }
  }

  private getConfigPath(): string {
    return path.join(
      process.cwd(),
      'deployments',
      this.options.network,
      this.options.deployment,
      'configuration.json'
    );
  }

  private async checkConfigurationFile(): Promise<void> {
    const configPath = this.getConfigPath();
    
    if (!fs.existsSync(configPath)) {
      this.utils.log(`❌ Configuration file not found at: ${configPath}`, 'error');
      throw new Error('Configuration file not found');
    }

    this.utils.log(`📁 Configuration file found at: ${configPath}`, 'info');
    
    try {
      const configContent = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(configContent);
      this.utils.log(`📋 Current configuration loaded successfully`, 'success');
      return config;
    } catch (error) {
      this.utils.log(`❌ Failed to parse configuration file: ${error}`, 'error');
      throw error;
    }
  }

  private async promptForConfigurationUpdate(): Promise<void> {
    this.utils.log(`\n⚠️  IMPORTANT: After infrastructure deployment, you need to update the market configuration.`, 'warning');
    this.utils.log(`📁 Configuration file location: ${this.getConfigPath()}`, 'info');
    
    this.utils.log(`\n📝 You need to update the following in your configuration.json:`, 'info');
    this.utils.log(`   - Price feeds for your assets`, 'info');
    this.utils.log(`   - Asset configurations`, 'info');
    this.utils.log(`   - Supply caps and collateral factors`, 'info');
    this.utils.log(`   - Any other market-specific settings`, 'info');
    
    const shouldContinue = await this.utils.confirm(
      `\nHave you updated the configuration.json file and are ready to continue with market deployment?`
    );
    
    if (!shouldContinue) {
      this.utils.log(`\n⏸️  Deployment paused. Please update the configuration and run the script again.`, 'warning');
      process.exit(0);
    }
  }

  private async cleanDeployment(): Promise<void> {
    const network = this.options.network;
    const deployment = this.options.deployment;
    
    this.utils.log(`\n🧹 Cleaning deployment cache for ${network}/${deployment}...`, 'info');
    
    const cleanCommand = `rm -rf deployments/${network}/_infrastructure/aliases.json deployments/${network}/_infrastructure/roots.json deployments/${network}/.contracts deployments/${network}/*/aliases.json deployments/${network}/*/roots.json`;
    
    try {
      execSync(cleanCommand, { stdio: 'inherit' });
      this.utils.log(`✅ Cleaned deployment cache successfully`, 'success');
    } catch (error) {
      this.utils.log(`⚠️  Clean command completed (some files may not have existed)`, 'warning');
    }
  }

  private async deployInfrastructure(): Promise<void> {
    const command = `yarn hardhat deploy_infrastructure --network ${this.options.network} --bdag`;
    
    await this.runCommand(command, 'Deploying infrastructure');
  }

  private async deployMarket(): Promise<void> {
    const command = `yarn hardhat deploy --network ${this.options.network} --deployment ${this.options.deployment} --bdag`;
    
    await this.runCommand(command, 'Deploying market');
  }

  private async runDeploymentVerification(): Promise<void> {
    const command = `MARKET=${this.options.deployment} yarn hardhat test test/deployment-verification-test.ts --network ${this.options.network}`;
    
    await this.runCommand(command, 'Running deployment verification test');
  }



  private async runGovernanceToAcceptImplementation(): Promise<void> {
    this.utils.log(`\n🎉 Market deployment completed successfully!`, 'success');
    this.utils.log(`\n🚀 Starting governance flow to accept implementation...`, 'info');
    
    // Step 1: Run governance flow to accept implementation
    const proposalId = await this.utils.question(`\nEnter the proposal ID: `);
    await runGovernanceFlow({
      network: this.options.network,
      deployment: this.options.deployment,
      proposalId,
      executionType: 'comet-impl-in-configuration'
    });
    this.utils.log(`\n🎉 Governance flow to accept implementation completed successfully!`, 'success');
    
    // Step 2: Propose upgrade (if needed)
    const shouldProposeUpgrade = true;

    this.utils.log(`\n🔧 Proposing upgrade to a new implementation...`, 'info');
    if (shouldProposeUpgrade) {
      const implementationAddress = await this.utils.question(`\nEnter the new implementation address: `);
      
      if (implementationAddress) {
        await this.runCommand(
          `yarn hardhat governor:propose-upgrade --network ${this.options.network} --deployment ${this.options.deployment} --implementation ${implementationAddress}`,
          'Proposing upgrade'
        );
        
        // Step 3: Process upgrade proposal
        await this.runGovernanceToAcceptUpgrade();
      }
    }
    
    this.utils.log(`\n🎉 Governance flow completed successfully!`, 'success');
  }

  private async runSpiderForMarket(): Promise<void> {
    try {
      await this.runCommand(
        `yarn hardhat spider --network ${this.options.network} --deployment ${this.options.deployment}`,
        'Refreshing roots'
      );
    } catch (error) {
      this.utils.log(`\n⚠️  Spider failed, but this is expected behavior after upgrades.`, 'warning');
      this.utils.log(`📝 This happens because the implementation address doesn't match the expected one.`, 'info');
      this.utils.log(`\n🔧 To fix this:`, 'info');
      this.utils.log(`   1. Update the 'comet:implementation' entry in aliases.json`, 'info');
      this.utils.log(`   2. Update roots.json if needed`, 'info');
      this.utils.log(`\n📁 Files to update:`, 'info');
      this.utils.log(`   - deployments/${this.options.network}/${this.options.deployment}/aliases.json`, 'info');
      this.utils.log(`   - deployments/${this.options.network}/${this.options.deployment}/roots.json`, 'info');
      
      const filesUpdated = await this.utils.confirm(`\nHave you updated the aliases.json and roots.json files?`);
      if (filesUpdated) {
        this.utils.log(`\n🔄 Retrying spider...`, 'info');
        await this.runSpiderForMarket(); // Recursive call to retry
      } else {
        this.utils.log(`\n⏸️  Spider refresh skipped. You can run it manually later.`, 'warning');
      }
    }
  }

  private async runGovernanceToAcceptUpgrade(): Promise<void> {
    const upgradeProposalId = await this.utils.question(`\nEnter the upgrade proposal ID: `);
    
    if (upgradeProposalId) {
      this.utils.log(`\n📋 Processing upgrade proposal ID: ${upgradeProposalId}`, 'info');
      
      // Approve all upgrade governance steps at once
      const shouldProcessUpgradeGovernance = await this.utils.confirm(`\nDo you want to approve, queue, and execute upgrade proposal ${upgradeProposalId}?`);
      if (shouldProcessUpgradeGovernance) {
        await runGovernanceFlow({
          network: this.options.network,
          deployment: this.options.deployment,
          proposalId: upgradeProposalId,
          executionType: 'comet-upgrade'
        });
        
        // Refresh roots after upgrade
        const shouldRefreshRoots = await this.utils.confirm(`\nDo you want to refresh roots after the upgrade?`);
        if (shouldRefreshRoots) {
          await this.runSpiderForMarket();
        }
      }
    }
  }

  private async createUpdateProposals(): Promise<void> {
    this.utils.log(`\n📝 Creating timelock delay and governance update proposal...`, 'info');
    
    // Get environment variables for governance configuration
    const newAdmins = process.env.NEW_GOVERNANCE_ADMINS;
    const newThreshold = process.env.NEW_GOVERNANCE_THRESHOLD;
    const newTimelockDelay = process.env.NEW_TIMELOCK_DELAY;
    
    if (!newAdmins || !newThreshold) {
      this.utils.log(`\n⚠️  Environment variables NEW_GOVERNANCE_ADMINS and NEW_GOVERNANCE_THRESHOLD are required for governance updates`, 'warning');
      this.utils.log(`   Example: NEW_GOVERNANCE_ADMINS="0x123...,0x456...,0x789..." NEW_GOVERNANCE_THRESHOLD="2"`, 'info');
      
      const shouldContinue = await this.utils.confirm(`\nDo you want to continue without governance configuration updates?`);
      if (!shouldContinue) {
        return;
      }
    }
    
    // Create proposal for timelock delay and governance updates
    if (newAdmins && newThreshold) {
      this.utils.log(`\n🏛️  Creating proposal for:`, 'info');
      this.utils.log(`   New admins: ${newAdmins}`, 'info');
      this.utils.log(`   New threshold: ${newThreshold}`, 'info');
      if (newTimelockDelay) {
        this.utils.log(`   New timelock delay: ${newTimelockDelay} seconds`, 'info');
      }
      
      const shouldCreateProposal = await this.utils.confirm(`\nDo you want to create a proposal to update governance configuration${newTimelockDelay ? ' and timelock delay' : ''}?`);
      if (shouldCreateProposal) {
        await this.runCommand(
          `yarn hardhat governor:propose-timelock-delay-and-governance-update --network ${this.options.network} --deployment ${this.options.deployment} --admins "${newAdmins}" --threshold ${newThreshold}${newTimelockDelay ? ` --timelock-delay ${newTimelockDelay}` : ''}`,
          'Creating timelock delay and governance update proposal'
        );
      }
    }
    
    this.utils.log(`\n✅ Timelock delay and governance update proposal creation completed!`, 'success');
    
    // Automatically run governance flow for the created proposal
    const shouldRunGovernance = await this.utils.confirm(`\nDo you want to automatically approve, queue, and execute the proposal?`);
    if (shouldRunGovernance) {
      this.utils.log(`\n🚀 Running governance flow for the created proposal...`, 'info');
      
      const proposalId = await this.utils.question(`\nEnter the proposal ID: `);
      const options: GovernanceFlowOptions = {
        network: this.options.network,
        deployment: this.options.deployment,
        proposalId,
        executionType: 'governance-config'
      };
      
      const successMessage = `\n🎉 Timelock delay and governance configuration have been updated!`;
      
      await runGovernanceFlow(options, successMessage);
    } else {
      this.utils.log(`\n💡 Next steps:`, 'info');
      this.utils.log(`   1. Review the created proposal`, 'info');
      this.utils.log(`   2. Approve, queue, and execute it using the governance flow`, 'info');
      this.utils.log(`   3. Or use: yarn hardhat governor:approve/queue/execute --network ${this.options.network} --proposal-id <ID>`, 'info');
    }
  }

  public close(): void {
    this.utils.close();
  }

  public async deploy(): Promise<void> {
    try {
      this.utils.log(`\n🚀 Starting market deployment for ${this.options.deployment} on ${this.options.network}`, 'info');
      
      this.utils.log(`🔧 Using BDAG custom governor`, 'info');

      // Build project before deployment
      await this.runCommand('yarn build', 'Building project');

      if (this.options.clean) {
        this.utils.log(`🧹 Clean mode enabled`, 'info');
        await this.cleanDeployment();
      }

      // Step 1: Deploy Infrastructure
      await this.deployInfrastructure();
      
      // Step 2: Check configuration file exists
      await this.checkConfigurationFile();
      
      // Step 3: Prompt for configuration update
      await this.promptForConfigurationUpdate();
      
      // Step 4: Deploy Market
      await this.deployMarket();
      
      // Step 5: Run governance flow
      const runGovernance = await this.utils.confirm(`\nDo you want to run the governance flow?`);
      if (runGovernance) {
        await this.runGovernanceToAcceptImplementation();
      }
      
      // Step 6: Create and execute governance and timelock update proposals
      await this.createUpdateProposals();
      
      // Step 7: Run verification test (after governance)
      const runVerification = await this.utils.confirm(`\nDo you want to run deployment verification test?`);
      
      if (runVerification) {
        await this.runDeploymentVerification();
      }
      
    } catch (error) {
      this.utils.log(`\n❌ Deployment failed: ${error}`, 'error');
      this.utils.log(`\n💡 Troubleshooting tips:`, 'info');
      this.utils.log(`   - Check your .env file has all required API keys`, 'info');
      this.utils.log(`   - Verify network configuration in hardhat.config.ts`, 'info');
      this.utils.log(`   - Ensure you have sufficient funds for deployment`, 'info');
      this.utils.log(`   - Check that all dependencies are installed (yarn install)`, 'info');
      process.exit(1);
    } finally {
      this.close();
    }
  }
}

// Parse command line arguments
function parseArguments(): DeployOptions {
  const args = process.argv.slice(2);
  const options: DeployOptions = {
    network: 'local',
    deployment: 'dai'
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--network':
        options.network = args[++i];
        break;
      case '--deployment':
        options.deployment = args[++i];
        break;

      case '--clean':
        options.clean = true;
        break;

      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
        break;
    }
  }

  return options;
}

function showHelp(): void {
  console.log(`
🚀 Market Deployment Script

Usage: yarn ts-node scripts/deploy-market.ts [options]

Options:
  --network <network>     Network to deploy to (default: local)
  --deployment <market>   Market to deploy (default: dai)

  --clean                 Clean deployment cache before deploying

  --help, -h             Show this help message

Examples:
  # Deploy DAI market on local network
  yarn ts-node scripts/deploy-market.ts --network local --deployment dai

  # Deploy USDC market on polygon network
  yarn ts-node scripts/deploy-market.ts --network polygon --deployment usdc

  # Deploy with clean cache
  yarn ts-node scripts/deploy-market.ts --network local --deployment dai --clean



Available networks: local, hardhat, mainnet, polygon, arbitrum, optimism, base, etc.
Available markets: dai, usdc, usdt, weth, wbtc, etc.
  `);
}

// Main execution
async function main(): Promise<void> {
  const options = parseArguments();
  
  if (!options.network || !options.deployment) {
    console.error('❌ Network and deployment are required');
    showHelp();
    process.exit(1);
  }

  const deployer = new MarketDeployer(options);
  await deployer.deploy();
}

// Run the script
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

export { MarketDeployer, DeployOptions };
