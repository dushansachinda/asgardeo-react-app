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

/**
 * Interface for Process information.
 */
export interface IProcessInfo {
  /**
   * Process id.
   * @example "3158"
   */
  pid: string | undefined;
  /**
   * Command which started the process.
   * @example "http-server"
   */
  command: string | undefined;
  /**
   * Directory which initiated the process.
   * @example "/Users/brion/Projects/demo-app"
   */
  directory: string | undefined;
}

export interface IReporter {
  /**
   * Get the root permission required message.
   * @param wellknownPortRange - Range of reserved wellknown ports.
   * @returns Returns a formatted root permission required message as a string.
   */
  getMissingRootPermissionMessage(wellknownPortRange: number[]): string;
  /**
   * Get the process information report.
   * @param process - Process info.
   * @returns Returns a formatted process info report as a string.
   */
   getProcessInfoReport(process: IProcessInfo): string;
  /**
   * Get the port in use disclaimer message.
   * @param port - Port which the server is running on.
   * @returns Returns a formatted port in use disclaimer message as a string.
   */
  getPortInUseDisclaimerMessage(port: number): string;
  /**
   * Get the port fallback confirmarion message.
   * @param availablePorts - Available ports.
   * @returns Returns a formatted port fallback prompt message as a string.
   */
  getNonePortFallbackMessage(availablePorts: number[]): string;
  /**
   * Get the port fallback confirmation message.
   * @returns Returns a formatted port fallback confirmation message as a string.
   */
  getPortFallbackConfirmation(): string;
  /**
   * Build and print the port fallback confirmarion message.
   * @param port - Requested Port.
   * @param availablePort - Aavailable port.
   * @param isInteractive - Should show port fallback confirmation on the prompt.
   * @returns Returns a formatted port in use prompt as a string.
   */
  buildPortInUsePromptMessage(port: number, availablePort: number, isInteractive: boolean | undefined): string;
  /**
   * Get the un-interative terminal error message.
   * @returns Returns un-interative terminal error message as a string.
   */
  getUnInteractiveTerminalError(): string;
  /**
   * Get the generic prompt error message.
   * @returns Returns a generic prompt error message as a string.
   */
  getGenericPromptError(): string;
  /**
   * Get no open port on host error message.
   * @param hostname - Host.
   * @param error - Error object.
   * @returns Returns no open port on host error message as string.
   */
  getOpenPortUnAvailablityOnHost(hostname: string | undefined, error: Error): string;
  /**
   * Get process termination message.
   * @returns Returns a message containing process termination info.
   */
   getProcessTerminationMessage(): string;
}

/**
 * Interface for Reporter Message Extensions.
 */
export type IReporterExtensions = {
  [ key in ReporterExtensionPoints ]: (...args: any[]) => string;
}

/**
 * Reporter Extension Points.
 */
export type ReporterExtensionPoints = "BEFORE_getMissingRootPermissionMessage"
  | "AFTER_getMissingRootPermissionMessage"
  | "BEFORE_getProcessInfoReport"
  | "AFTER_getProcessInfoReport"
  | "BEFORE_getPortInUseDisclaimerMessage"
  | "AFTER_getPortInUseDisclaimerMessage"
  | "BEFORE_getNonePortFallbackMessage"
  | "AFTER_getNonePortFallbackMessage"
  | "BEFORE_getPortFallbackConfirmation"
  | "AFTER_getPortFallbackConfirmation"
  | "BEFORE_buildPortInUsePromptMessage"
  | "AFTER_buildPortInUsePromptMessage"
  | "BEFORE_getUnInteractiveTerminalError"
  | "AFTER_getUnInteractiveTerminalError"
  | "BEFORE_getGenericPromptError"
  | "AFTER_getGenericPromptError"
  | "BEFORE_getOpenPortUnAvailablityOnHost"
  | "AFTER_getOpenPortUnAvailablityOnHost"
  | "BEFORE_getProcessTerminationMessage"
  | "AFTER_getProcessTerminationMessage";
