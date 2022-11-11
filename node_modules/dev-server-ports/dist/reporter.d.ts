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
import { IProcessInfo, IReporter, IReporterExtensions } from "./models";
export declare class Reporter implements IReporter {
    static extensions: Partial<IReporterExtensions> | undefined;
    static overrides: Partial<IReporter> | undefined;
    /**
     * Constructor.
     * @param extensions - Extensions.
     * @param overrides - Overrides.
     */
    constructor(extensions?: Partial<IReporterExtensions>, overrides?: Partial<IReporter>);
    /**
     * Get the root permission required message
     *
     * @param wellknownPortRange - Range of reserved wellknown ports.
     * @returns Returns a formatted root permission required message as a string.
     */
    getMissingRootPermissionMessage(wellknownPortRange: number[]): string;
    /**
     * Get the process information report.
     *
     * @param process - Process info.
     * @returns Returns a formatted process info report as a string.
     */
    getProcessInfoReport(process: IProcessInfo): string;
    /**
     * Get the port in use disclaimer message.
     *
     * @param port - Port which the server is running on.
     * @returns Returns a formatted port in use disclaimer message as a string.
     */
    getPortInUseDisclaimerMessage(port: number): string;
    /**
     * Get the port fallback confirmarion message.
     *
     * @param availablePorts - Available ports.
     * @returns Returns a formatted port fallback prompt message as a string.
     */
    getNonePortFallbackMessage(availablePorts: number[]): string;
    /**
     * Get the port fallback confirmation message.
     *
     * @returns Returns a formatted port fallback confirmation message as a string.
     */
    getPortFallbackConfirmation(): string;
    /**
     * Build and print the port fallback confirmarion message.
     *
     * @param port - Requested Port.
     * @param availablePort - Aavailable port.
     * @param isInteractive - Should show port fallback confirmation on the prompt.
     * @returns Returns a formatted port in use prompt as a string.
     */
    buildPortInUsePromptMessage(port: number, availablePort: number, isInteractive: boolean | undefined): string;
    /**
     * Get the un-interative terminal error message.
     *
     * @returns Returns un-interative terminal error message as a string.
     */
    getUnInteractiveTerminalError(): string;
    /**
     * Get the generic prompt error message.
     *
     * @returns Returns a generic prompt error message as a string.
     */
    getGenericPromptError(): string;
    /**
     * Get no open port on host error message.
     *
     * @param hostname - Host.
     * @param error - Error object.
     * @returns Returns no open port on host error message as string.
     */
    getOpenPortUnAvailablityOnHost(hostname: string | undefined, error: Error): string;
    /**
     * Get process termination message.
     *
     * @returns Returns a message containing process termination info.
     */
    getProcessTerminationMessage(): string;
}
