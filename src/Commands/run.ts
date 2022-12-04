import * as vscode from "vscode";
import path = require("path");
import { existsSync } from "fs";

import {
  getCurrentActiveFileAndFolder,
  findTSByPrdName,
} from "../utils/finder";
import { outputToChannel } from "../utils/chsimu";

const CONFIG_NAME = "scriptArgs.json";

export default async (uri: vscode.Uri, context: vscode.ExtensionContext) => {
  try {
    const fileContext = getCurrentActiveFileAndFolder(uri);
    const { currentFolder } = fileContext;
    let { currentFileName, currentFilePath, exist } = findTSByPrdName(uri);

    if (!exist) {
      vscode.window.showErrorMessage(`${currentFilePath} not exist`);
      return;
    }

    if (currentFileName.match(/\.prdts|\.prd/)) {
      const configPath = path.resolve(currentFolder, CONFIG_NAME);
      let configJson: any = {};
      if (existsSync(configPath)) {
        delete require.cache[require.resolve(configPath)];
        configJson = require(configPath);
      }

      const contractScriptArg = configJson[currentFileName] || "";

      try {
        await outputToChannel({
          context,
          currentFileName,
          currentFolder,
          contractScriptArg,
          currentFilePath,
        });
      } catch (ex: any) {
        vscode.window.showErrorMessage(ex.message);
      }
    } else {
      vscode.window.showErrorMessage(
        "Run Chain Simulator: only run with script file"
      );
    }
  } catch (e: any) {
    vscode.window.showErrorMessage(e.toString());
  }
};
