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
/**
 * Clears the terminal screen.
 *
 * @example
 * Usage:
 * ```
 * // Clears the terminal.
 * clearTerminal();
 * ```
 *
 * @returns Returns a void.
 */
export declare const clearTerminal: () => void;
/**
 * Get the process id (pid) on the given port.
 *
 * @example
 * Usage:
 * ```
 * // Returns a numeric value as a string like "55543".
 * getProcessIdOnPort(3000);
 * ```
 *
 * @param port - Port number.
 * @returns
 */
export declare const getProcessIdOnPort: (port: number) => string;
/**
 * Get the directory of the process with the given id (pid).
 *
 * @param processId - Process id.
 * @returns Returns the directory of the process.
 */
export declare const getDirectoryOfProcessById: (processId: string) => string;
/**
 * Get the package name in the given directory.
 *
 * @param directory - Directory to search for package.json.
 * @returns Returns the package name.
 */
export declare const getPackageNameInDirectory: (directory: string) => string | null;
/**
 * Get the command ran for the process with the given id (pid).
 *
 * @param processId - Process id.
 * @param processDirectory - Directory of the process.
 * @returns Returns the command ran for the process.
 */
export declare const getProcessCommand: (processId: string, processDirectory: string) => string;
/**
 * Get the process information for the given port.
 *
 * @param port - Port number.
 * @returns Returns the process information or null.
 */
export declare const getProcessForPort: (port: number) => IProcessInfo;
/**
 * Find a port that is available for use.
 *
 * @param port - Preffered port number. ex: 3000
 * @param hostname - Host name. ex: "0.0.0.0" | "localhost"
 * @param reporter - Reporter overrides and extensions.
 * @returns Returns a promise that resolves to the available port or null on error.
 */
export declare const findPort: (port: number, hostname?: string | undefined, shouldFallback?: boolean | undefined, reporter?: {
    extensions: Partial<IReporterExtensions>;
    overrides: Partial<IReporter>;
} | undefined) => Promise<number | null>;
