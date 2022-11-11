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

import child_process, { ExecSyncOptionsWithStringEncoding } from "child_process";
import path from "path";
import readline from "readline";
import detect from "detect-port";
import inquirer, { Question } from "inquirer";
import isRoot from "is-root";
import { WELL_KNOWN_PORT_RANGE } from "./constants";
import { IProcessInfo, IReporter, IReporterExtensions } from "./models";
import { Reporter } from "./reporter";
import { logger } from "./utils";

// Check if the process is running on a text terminal.
const IS_INTERACTIVE: boolean = process.stdout.isTTY;

const execOptions: ExecSyncOptionsWithStringEncoding = {
  encoding: "utf8",
  // eslint-disable-next-line @typescript-eslint/no-array-constructor
  stdio: [
    "pipe", // stdin (default)
    "pipe", // stdout (default)
    "ignore" //stderr
  ]
};

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
export const clearTerminal = (): void => {

  process.stdout.write(process.platform === "win32" ? "\x1B[2J\x1B[0f" : "\x1B[2J\x1B[3J\x1B[H");
};

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
export const getProcessIdOnPort = (port: number): string => {

  return child_process
    .execFileSync("lsof", [ "-i:" + port, "-P", "-t", "-sTCP:LISTEN" ], execOptions)
    .split("\n")[0]
    .trim();
};

/**
 * Get the directory of the process with the given id (pid).
 *
 * @param processId - Process id.
 * @returns Returns the directory of the process.
 */
export const getDirectoryOfProcessById = (processId: string): string => {

  return child_process
    .execSync("lsof -p " + processId + " | awk '$4==\"cwd\" {for (i=9; i<=NF; i++) printf \"%s \", $i}'", execOptions)
    .trim();
};

/**
 * Checks if the process is a known Node.js process.
 *
 * @param processCommand - Command ran for the process.
 * @returns Returns true if the process is a React app.
 */
const isKnownNodeProcess = (processCommand: string): boolean => {

  return /^node .*react-scripts\/scripts\/start\.js\s?$/.test(processCommand);
};

/**
 * Get the package name in the given directory.
 *
 * @param directory - Directory to search for package.json.
 * @returns Returns the package name.
 */
export const getPackageNameInDirectory = (directory: string): string | null => {

  const packagePath: string = path.join(directory.trim(), "package.json");

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(packagePath).name;
  } catch (e) {
    return null;
  }
};

/**
 * Get the command ran for the process with the given id (pid).
 *
 * @param processId - Process id.
 * @param processDirectory - Directory of the process.
 * @returns Returns the command ran for the process.
 */
export const getProcessCommand = (processId: string, processDirectory: string): string => {

  let command: string = child_process.execSync("ps -o command -p " + processId + " | sed -n 2p", execOptions);

  command = command.replace(/\n$/, "");

  // If thr process is a known Node.js process, get the package name from `package.json`.
  if (isKnownNodeProcess(command)) {
    const packageName: string | null = getPackageNameInDirectory(processDirectory);

    return packageName ? packageName : command;
  } else {
    return command;
  }
};

/**
 * Get the process information for the given port.
 *
 * @param port - Port number.
 * @returns Returns the process information or null.
 */
export const getProcessForPort = (port: number): IProcessInfo => {
  
  try {
    const pid: string = getProcessIdOnPort(port);
    const directory: string = getDirectoryOfProcessById(pid);
    const command: string= getProcessCommand(pid, directory);

    return {
      command,
      directory,
      pid
    };
  } catch (e) {
    return {
      command: undefined,
      directory: undefined,
      pid: undefined
    };
  }
};

/**
 * Shows a message without any interactions and exits the process on `ctrl+c`.
 * @param message - Message to show.
 */
const showNonInteractivePrompt = (message: string): void => {

  logger.info(message);
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on("keypress", (str) => {
    if (str === "\u0003") {
      process.exit();
    }
  });
};

/**
 * Find a port that is available for use.
 *
 * @param port - Preffered port number. ex: 3000
 * @param hostname - Host name. ex: "0.0.0.0" | "localhost"
 * @param reporter - Reporter overrides and extensions.
 * @returns Returns a promise that resolves to the available port or null on error.
 */
export const findPort = (port: number,
  hostname?: string,
  shouldFallback?: boolean | undefined,
  reporter?: {
    extensions: Partial<IReporterExtensions>;
    overrides: Partial<IReporter>;
  }
): Promise<number | null> => {

  const _reporter: IReporter = new Reporter(reporter?.extensions, reporter?.overrides);

  return detect({
    hostname,
    port
  })
    .then((availablePort: number) => new Promise(
      (resolve) => {
        if (availablePort === port) {
          return resolve(availablePort);
        }

        const needSudoPermissions: boolean = (process.platform !== "win32"
          && (port < WELL_KNOWN_PORT_RANGE[1] || availablePort < WELL_KNOWN_PORT_RANGE[1])
          && !isRoot());

        const question: Question = {
          default: true,
          message: _reporter.buildPortInUsePromptMessage(port, availablePort, shouldFallback),
          name: "shouldChangePort",
          type: "confirm"
        };

        // If the port needs permission to run, show a message & terminate on ctrl + c.
        if (needSudoPermissions) {
          showNonInteractivePrompt(_reporter.getMissingRootPermissionMessage(WELL_KNOWN_PORT_RANGE));

          return;
        }

        if (IS_INTERACTIVE) {
          // First clear the terminal.
          clearTerminal();

          if (shouldFallback === false) {
            showNonInteractivePrompt(question.message as string);
          } else {
            inquirer
              .prompt([ question ])
              .then((answers) => {
                if (answers.shouldChangePort) {
                  resolve(availablePort);
                } else {
                  process.exit();
                }
              })
              .catch((error) => {
                if (error.isTtyError) {
                  _reporter.getUnInteractiveTerminalError();
                } else {
                  _reporter.getGenericPromptError();
                }
              });
          }
        } else {
          showNonInteractivePrompt(question.message as string);
        }
      }
    ),
    (err) => {
      throw new Error(_reporter.getOpenPortUnAvailablityOnHost(hostname, err));
    });
};
