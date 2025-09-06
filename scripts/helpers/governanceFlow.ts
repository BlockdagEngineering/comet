import { execSync } from 'child_process';
import { ScriptUtils } from './scriptUtils';

export interface GovernanceFlowOptions {
  network: string;
  deployment: string;
  proposalId: string;
  executionType?: string;
}

export class GovernanceFlowHelper {
  private utils: ScriptUtils;

  constructor() {
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

  private async checkProposalStatus(options: GovernanceFlowOptions): Promise<void> {
    const command = `yarn hardhat governor:status --network ${options.network} --deployment ${options.deployment} --proposal-id ${options.proposalId}`;
    
    try {
      await this.runCommand(command, 'Checking proposal status');
    } catch (error) {
      this.utils.log(`\n⚠️  Could not check proposal status. Please verify the proposal ID is correct.`, 'warning');
      const shouldContinue = await this.utils.confirm(`\nDo you want to continue with the governance flow?`);
      if (!shouldContinue) {
        throw new Error('Governance flow cancelled by user');
      }
    }
  }

  private async approveProposal(options: GovernanceFlowOptions): Promise<void> {
    const command = `yarn hardhat governor:approve --network ${options.network} --deployment ${options.deployment} --proposal-id ${options.proposalId}`;
    
    await this.runCommand(command, 'Approving proposal');
  }

  private async queueProposal(options: GovernanceFlowOptions): Promise<void> {
    const command = `yarn hardhat governor:queue --network ${options.network} --deployment ${options.deployment} --proposal-id ${options.proposalId}`;
    
    await this.runCommand(command, 'Queueing proposal');
  }

  private async executeProposal(options: GovernanceFlowOptions): Promise<void> {
    const executionType = options.executionType || 'governance-config';
    const command = `yarn hardhat governor:execute --network ${options.network} --deployment ${options.deployment} --proposal-id ${options.proposalId} --execution-type ${executionType}`;
    
    await this.runCommand(command, 'Executing proposal');
  }

  /**
   * Runs the complete governance flow for a proposal
   * @param options - Governance flow options including network, deployment, and proposal ID
   * @param successMessage - Custom success message to display after completion
   * @param manualCommands - Custom manual commands to display if user chooses not to run automatically
   */
  public async runGovernanceFlow(
    options: GovernanceFlowOptions,
    successMessage?: string,
    manualCommands?: string[]
  ): Promise<void> {
    this.utils.log(`\n🎯 Running governance flow for proposal ${options.proposalId}...`, 'info');
    
    // Check proposal status first
    await this.checkProposalStatus(options);
    
    // Ask user if they want to proceed with governance
    const shouldProcessGovernance = await this.utils.confirm(`\nDo you want to approve, queue, and execute proposal ${options.proposalId}?`);
    
    if (shouldProcessGovernance) {
      // Approve proposal
      await this.approveProposal(options);
      
      // Queue proposal
      await this.queueProposal(options);
      
      // Execute proposal
      await this.executeProposal(options);
      
      this.utils.log(`\n✅ Governance flow completed successfully!`, 'success');
      if (successMessage) {
        this.utils.log(successMessage, 'success');
      }
    } else {
      this.utils.log(`\n⏸️  Governance flow paused. You can manually process the proposal later.`, 'warning');
      this.utils.log(`\n📋 Commands to run manually:`, 'info');
      
      if (manualCommands && manualCommands.length > 0) {
        manualCommands.forEach(cmd => this.utils.log(`   ${cmd}`, 'info'));
      } else {
        // Default manual commands
        this.utils.log(`   yarn hardhat governor:approve --network ${options.network} --deployment ${options.deployment} --proposal-id ${options.proposalId}`, 'info');
        this.utils.log(`   yarn hardhat governor:queue --network ${options.network} --deployment ${options.deployment} --proposal-id ${options.proposalId}`, 'info');
        this.utils.log(`   yarn hardhat governor:execute --network ${options.network} --deployment ${options.deployment} --proposal-id ${options.proposalId} --execution-type ${options.executionType || 'governance-config'}`, 'info');
      }
    }
  }

  /**
   * Closes the readline interface
   */
  public close(): void {
    this.utils.close();
  }
}

/**
 * Convenience function to run governance flow without creating a class instance
 * @param options - Governance flow options (proposalId defaults to 'latest' if not provided)
 * @param successMessage - Custom success message to display after completion
 * @param manualCommands - Custom manual commands to display if user chooses not to run automatically
 */
export async function runGovernanceFlow(
  options: GovernanceFlowOptions,
  successMessage?: string,
  manualCommands?: string[]
): Promise<void> {
  const helper = new GovernanceFlowHelper();
  try {
    await helper.runGovernanceFlow(options, successMessage, manualCommands);
  } finally {
    helper.close();
  }
}
