import * as vscode from "vscode";

import {
  getCurrentActiveFileAndFolder,
  getChsimuFileFloder,
} from "../utils/finder";

let terminal: vscode.Terminal | undefined;
const isWin = process.platform === "win32";

export default async (uri: vscode.Uri, context: vscode.ExtensionContext) => {
  try {
    const { currentFileName, currentFilePath } =
      getCurrentActiveFileAndFolder(uri);

    if (currentFileName.match(/\.prd/)) {
      const { chsimuFloder, chsimuName } = getChsimuFileFloder();

      // 释放终端，防止卡住
      if (terminal) {
        terminal.dispose();
      }

      terminal = vscode.window.createTerminal({
        message: "Preda Compile",
        cwd: chsimuFloder,
      });
      terminal.show();
      terminal.sendText(
        `.${isWin ? "\\" : "/"}${chsimuName} -log "${currentFilePath}"`
      );
    } else {
      vscode.window.showErrorMessage("Preda Compile: only run with prd file");
    }
  } catch (e: any) {
    vscode.window.showErrorMessage(e.toString());
  }
};
