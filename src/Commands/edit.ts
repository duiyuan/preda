import * as vscode from "vscode";
import path = require("path");
import { existsSync, writeFileSync } from "fs";

import {
  getCurrentActiveFileAndFolder,
  findTSByPrdName,
} from "../utils/finder";
import { outputToChannel } from "../utils/chsimu";

const CONFIG_NAME = "scriptArgs.json";

export default async (uri: vscode.Uri, context: vscode.ExtensionContext) => {
  try {
    const { currentFolder } = getCurrentActiveFileAndFolder(uri);
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

      // 获取用户输入的参数
      const inputBox = vscode.window.createInputBox();
      inputBox.placeholder = "contract script args";
      inputBox.prompt = "run contract with script args. e.g.: -count:1000";
      inputBox.value = configJson[currentFileName] || "";
      inputBox.ignoreFocusOut = true;
      inputBox.show();
      inputBox.onDidAccept(async () => {
        if (inputBox) {
          const contractScriptArg = inputBox.value;
          // 关闭input框
          inputBox.hide();
          try {
            await outputToChannel({
              context,
              currentFileName,
              currentFilePath,
              currentFolder,
              contractScriptArg,
            });
          } catch (ex: any) {
            vscode.window.showErrorMessage(ex.message);
          }

          configJson[currentFileName] = contractScriptArg;
          writeFileSync(configPath, JSON.stringify(configJson, null, 2));
        }
      });
    } else {
      vscode.window.showErrorMessage(
        "Run Chain Simulator: only run with script file"
      );
    }
  } catch (e: any) {
    vscode.window.showErrorMessage(e.toString());
  }
};
