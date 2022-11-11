/**
 * MIT License
 *
 * Copyright (c) 2022 Brion Mario
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import chalk from "chalk";
import { getProcessForPort } from "./helpers";
import { IProcessInfo, IReporter, IReporterExtensions } from "./models";

export class Reporter implements IReporter {

  static extensions: Partial<IReporterExtensions> | undefined;
  static overrides: Partial<IReporter> | undefined;

  /**
   * Constructor.
   * @param extensions - Extensions.
   * @param overrides - Overrides.
   */
  constructor(extensions?: Partial<IReporterExtensions>, overrides?: Partial<IReporter>) {
    Reporter.extensions = extensions;
    Reporter.overrides = overrides;
  }

  /**
   * Get the root permission required message
   *
   * @param wellknownPortRange - Range of reserved wellknown ports.
   * @returns Returns a formatted root permission required message as a string.
   */
  @override()
  @extend()
  getMissingRootPermissionMessage(wellknownPortRange: number[]): string {
    return chalk.redBright(`Admin permissions are required to run a server on a port below ${
      wellknownPortRange[1] }.`);
  }

  /**
   * Get the process information report.
   *
   * @param process - Process info.
   * @returns Returns a formatted process info report as a string.
   */
  @override()
  @extend()
  getProcessInfoReport(process: IProcessInfo): string {
    return `
    process       : ${ chalk.cyan(process.command) }
    pid           : ${ chalk.grey(process.pid)}
    invoked from  : ${ chalk.blue(process.directory) }`;
  }

  /**
   * Get the port in use disclaimer message.
   *
   * @param port - Port which the server is running on.
   * @returns Returns a formatted port in use disclaimer message as a string.
   */
  @override()
  @extend()
  getPortInUseDisclaimerMessage(port: number): string {

    return `${ chalk.bgRedBright(chalk.whiteBright("PORT IN USE")) } ${
      chalk.white("-" )
    } Someone is already using the port ${ chalk.bold(chalk.yellowBright(port)) }.`;
  }

  /**
   * Get the port fallback confirmarion message.
   *
   * @param availablePorts - Available ports.
   * @returns Returns a formatted port fallback prompt message as a string.
   */
  @override()
  @extend()
  getNonePortFallbackMessage(availablePorts: number[]): string {

    return `
${ chalk.yellowBright("If possible, free up the port or choose an avaiable one.") }

The following ${ availablePorts.length > 1 ? "ports are" : "port is" } available:

        ${ chalk.green(availablePorts.join("\n")) }

${ this.getProcessTerminationMessage() }`;
  }

  /**
   * Get the port fallback confirmation message.
   *
   * @returns Returns a formatted port fallback confirmation message as a string.
   */
  @override()
  @extend()
  getPortFallbackConfirmation(): string {

    return "Would you like to run the app on another port instead?";
  }

  /**
   * Build and print the port fallback confirmarion message.
   *
   * @param port - Requested Port.
   * @param availablePort - Aavailable port.
   * @param isInteractive - Should show port fallback confirmation on the prompt.
   * @returns Returns a formatted port in use prompt as a string.
   */
  @override()
  @extend()
  buildPortInUsePromptMessage(port: number, availablePort: number, isInteractive: boolean | undefined): string {

    const { command, directory, pid } = getProcessForPort(port);
    const confirmation: string = isInteractive
      ? this.getPortFallbackConfirmation()
      : this.getNonePortFallbackMessage([ availablePort ]);

    return `${ this.getPortInUseDisclaimerMessage(port) }
    ${ this.getProcessInfoReport({ command, directory, pid }) }
    
${ confirmation }`;
  }

  /**
   * Get the un-interative terminal error message.
   *
   * @returns Returns un-interative terminal error message as a string.
   */
  @override()
  @extend()
  getUnInteractiveTerminalError(): string {

    return chalk.red("Prompt couldn't be rendered in the current environment.");
  }

  /**
   * Get the generic prompt error message.
   *
   * @returns Returns a generic prompt error message as a string.
   */
  @override()
  @extend()
  getGenericPromptError(): string {

    return chalk.red("Something wen wrong when trying to render the prompt.");
  }

  /**
   * Get no open port on host error message.
   *
   * @param hostname - Host.
   * @param error - Error object.
   * @returns Returns no open port on host error message as string.
   */
  @override()
  @extend()
  getOpenPortUnAvailablityOnHost(hostname: string | undefined, error: Error): string {
    return `${ chalk.red(`Could not find an open port at ${ chalk.bold(hostname) }.`) }

              (Network error message: ${ error.message || error })
    }`;
  }

  /**
   * Get process termination message.
   *
   * @returns Returns a message containing process termination info.
   */
  @override()
  @extend()
  getProcessTerminationMessage(): string {

    return `${ chalk.white("Press ctrl/cmd + c to exit.") }`;
  }
}

/**
 * Override decorator.
 *
 * @returns Returns the result of the execution.
 */
function override(): any {

  return function(_target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {

    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {

      let result: any = originalMethod.apply(this, args);

      if ((this.constructor as any)?.overrides
        && Object.prototype.hasOwnProperty.call((this.constructor as any).overrides, propertyKey)) {
        result = (this.constructor as any).overrides[propertyKey].apply(this, args);
      }

      return result;
    };
  };
}

/**
 * Extension decorator.
 *
 * @returns Returns the result of the execution.
 */
function extend(): any {

  return function(_target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {

    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {

      let result: any = originalMethod.apply(this, args);

      if ((this.constructor as any)?.extensions) {
        if (Object.prototype.hasOwnProperty.call((this.constructor as any).extensions, `BEFORE_${ propertyKey }`)) {
          result = `${ (this.constructor as any).extensions[`BEFORE_${ propertyKey }`].apply(this, args) }

${ result }`;
        }

        if (Object.prototype.hasOwnProperty.call((this.constructor as any).extensions, `AFTER_${ propertyKey }`)) {
          result = `${ result }

${ (this.constructor as any).extensions[`AFTER_${ propertyKey }`].apply(this, args) }`;
        }
      }

      return result;
    };
  };
}
