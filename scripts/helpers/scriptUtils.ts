import * as readline from 'readline';

export type LogType = 'info' | 'success' | 'warning' | 'error';

export class ScriptUtils {
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Logs a message with color coding
   * @param message - The message to log
   * @param type - The type of log message (determines color)
   */
  public log(message: string, type: LogType = 'info'): void {
    const colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m'    // Red
    };
    const reset = '\x1b[0m';
    console.log(`${colors[type]}${message}${reset}`);
  }

  /**
   * Asks a question and returns the user's input
   * @param prompt - The question prompt
   * @returns Promise<string> - The user's input
   */
  public async question(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(prompt, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  /**
   * Asks a yes/no question and returns a boolean
   * @param prompt - The question prompt
   * @returns Promise<boolean> - True if user answered yes, false otherwise
   */
  public async confirm(prompt: string): Promise<boolean> {
    while (true) {
      const answer = await this.question(`${prompt} (Y/n): `);
      const lowerAnswer = answer.toLowerCase().trim();
      
      if (lowerAnswer === '' || lowerAnswer === 'y' || lowerAnswer === 'yes') {
        return true;
      } else if (lowerAnswer === 'n' || lowerAnswer === 'no') {
        return false;
      } else {
        this.log(`Please enter 'y' for yes or 'n' for no.`, 'warning');
      }
    }
  }

  /**
   * Closes the readline interface
   */
  public close(): void {
    this.rl.close();
  }
}

/**
 * Convenience function to create a ScriptUtils instance
 */
export function createScriptUtils(): ScriptUtils {
  return new ScriptUtils();
}

/**
 * Convenience function to run a function with ScriptUtils and automatically close it
 */
export async function withScriptUtils<T>(
  fn: (utils: ScriptUtils) => Promise<T>
): Promise<T> {
  const utils = new ScriptUtils();
  try {
    return await fn(utils);
  } finally {
    utils.close();
  }
}
