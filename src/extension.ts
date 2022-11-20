// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import path = require("path");
import { existsSync, writeFileSync } from "fs";

import ViewLoader from "./viewloader";
import {
  getCurrentActiveFileAndFolder,
  getChsimuFileFloder,
  outputToChannel,
} from "./utils/chsimu";

let terminal: vscode.Terminal | undefined;
let outputChannel: vscode.OutputChannel;

const CONFIG_NAME = "scriptArgs.json";

const isWin = process.platform === "win32";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // run
  const runChsimuCommand = vscode.commands.registerCommand(
    "Preda.run",
    async (uri: vscode.Uri) => {
      try {
        const extessionPath = context.extensionPath;
        const { currentFileName, currentFolder, currentFilePath } =
          getCurrentActiveFileAndFolder(uri);

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

          // 释放终端，防止卡住
          // if (terminal) {
          //   terminal.dispose();
          // }
          // // // 创建并执行
          // terminal = vscode.window.createTerminal({
          //   message: "Run Chain Simulator",
          //   cwd: chsimuFloder,
          // });
          // // // 创建并执行
          // terminal.show();
          // terminal.sendText(
          //   `.${isWin ? "\\" : "/"}${chsimuName} -log ${currentFilePath} ${
          //     contractScriptArg || ""
          //   }`
          // );
        } else {
          vscode.window.showErrorMessage(
            "Run Chain Simulator: only run with script file"
          );
        }
      } catch (e) {
        console.log(e);
      }
    }
  );

  // edit
  const editChsimuCommand = vscode.commands.registerCommand(
    "Preda.edit",
    async (uri: vscode.Uri) => {
      try {
        const { currentFileName, currentFolder, currentFilePath } =
          getCurrentActiveFileAndFolder(uri);

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

              // 释放终端，防止卡住
              // if (terminal) {
              //   terminal.dispose();
              // }
              // // 创建并执行
              // terminal = vscode.window.createTerminal({
              //   message: "Run Chain Simulator",
              //   cwd: chsimuFloder,
              // });
              // terminal.show();
              // terminal.sendText(
              //   `.${isWin ? "\\" : "/"}${chsimuName} -log ${currentFilePath} ${
              //     contractScriptArg || ""
              //   }`
              // );
              // 写入配置
              configJson[currentFileName] = contractScriptArg;
              writeFileSync(configPath, JSON.stringify(configJson, null, 2));
            }
          });
        } else {
          vscode.window.showErrorMessage(
            "Run Chain Simulator: only run with script file"
          );
        }
      } catch (e) {
        console.log(e);
      }
    }
  );

  // compile
  const compileChsimuCommand = vscode.commands.registerCommand(
    "Preda.compile",
    async (uri: vscode.Uri) => {
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
          vscode.window.showErrorMessage(
            "Preda Compile: only run with prd file"
          );
        }
      } catch (e) {
        console.log(e);
      }
    }
  );

  const viewHtmlCommand = vscode.commands.registerCommand(
    "Preda.view",
    async (uri: vscode.Uri) => {
      try {
        const webview = new ViewLoader({ context, filepath: uri.fsPath });
        webview.create();
      } catch (e: any) {
        vscode.window.showErrorMessage(e.toString());
      }
    }
  );

  // 注册到监听队列中
  context.subscriptions.push(runChsimuCommand);
  context.subscriptions.push(editChsimuCommand);
  context.subscriptions.push(compileChsimuCommand);
  context.subscriptions.push(viewHtmlCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {}
