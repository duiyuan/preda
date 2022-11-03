// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import path = require("path");
import { existsSync, writeFileSync } from "fs";

import { spawn } from "./utils/process";
import ViewLoader from "./viewloader";
import FileHandler from "./utils/filehandler";
import { formatTime } from "./utils/time";

const { normalize, resolve } = path;

let terminal: vscode.Terminal | undefined;
let outputChannel: vscode.OutputChannel;

const CONFIG_NAME = "scriptArgs.json";

const isWin = process.platform === "win32";

const getPathFloderAndName = (path: string) => {
  const lastStr = path.lastIndexOf(isWin ? "\\" : "/") + 1;
  const fileName = path.substring(lastStr);
  const fileFloder = path.substring(0, lastStr);
  return {
    fileName,
    fileFloder,
  };
};
const getCurrentActiveFileAndFolder = (uri: vscode.Uri) => {
  // uri会给出命令执行时选择的路径
  // 如果右键点击文件夹，这里就是文件夹的路径
  let currentFilePath = uri?.fsPath;
  // 命令行获取当前tab路径
  if (!currentFilePath) {
    currentFilePath =
      vscode.window?.activeTextEditor?.document.uri.fsPath || "";
  }
  const lastStr = currentFilePath.lastIndexOf(isWin ? "\\" : "/") + 1;
  const currentFileName = currentFilePath.substring(lastStr);
  const currentFolder = currentFilePath.substring(0, lastStr);
  return {
    currentFileName,
    currentFolder,
    currentFilePath,
  };
};
const getChsimuFileFloder = () => {
  // 获取Chsimu路径
  const chsimuPath = vscode.workspace
    .getConfiguration("ChsimuDev")
    .get("path") as string;

  if (!chsimuPath || !existsSync(chsimuPath)) {
    const errorText = "Run Chain Simulator: can not find Chsimu " + chsimuPath;
    vscode.window.showErrorMessage(errorText);
    throw new Error(errorText);
  }

  const { fileName: chsimuName, fileFloder: chsimuFloder } =
    getPathFloderAndName(chsimuPath);

  return {
    chsimuName,
    chsimuFloder,
  };
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  outputChannel = vscode.window.createOutputChannel("ChsimuDev");

  // run
  const runChsimuCommand = vscode.commands.registerCommand(
    "ChsimuDev.run",
    async (uri: vscode.Uri) => {
      try {
        const extessionPath = context.extensionPath;
        const { currentFileName, currentFolder, currentFilePath } =
          getCurrentActiveFileAndFolder(uri);

        if (currentFileName.match(/\.script/)) {
          const configPath = path.resolve(currentFolder, CONFIG_NAME);
          const configJson = existsSync(configPath) ? require(configPath) : {};
          const contractScriptArg = configJson[currentFileName] || "";
          const { chsimuFloder, chsimuName } = getChsimuFileFloder();

          const uiTemp = resolve(extessionPath, "out/web/index.html");
          const now = formatTime(Date.now(), "HH_mm_ss");
          const fname = currentFileName.split(".")[0];
          const outFilename = `${fname.replace(/\./g, "_")}_${now}`;
          const outFilePath = resolve(
            currentFolder,
            `results/${outFilename}.html`
          );

          const args = [
            `-log ${currentFilePath}`,
            `${contractScriptArg || ""}`,
            `-viz_templ:${uiTemp}`,
            `-viz:${outFilePath}`,
          ];
          const invokeMsg = `==> [Job Runing] ${chsimuName} ${args.join(" ")}`;

          outputChannel.appendLine(invokeMsg);
          outputChannel.show();
          spawn({
            cmd: chsimuName,
            option: { cwd: chsimuFloder, shell: true },
            args,
            onData: (data) => {
              outputChannel.appendLine(data.toString());
            },
            onErr: (err) => {
              outputChannel.appendLine(`==> [Job Failed]: ${err.toString()}`);
            },
            onExt: async (code) => {
              outputChannel.show();
              // const staticPath = vscode.Uri.file(
              //   path.join(context.extensionPath, "out/web")
              // );
              if (code === 0) {
                outputChannel.appendLine(
                  `==> [Job Done] Result has been output to ${outFilePath}`
                );
                outputChannel.appendLine("");
                const file = new FileHandler({
                  filepath: outFilePath,
                  context,
                });
                try {
                  await file.inject({
                    args: contractScriptArg,
                    contract: currentFileName,
                    staticPath: "{{staticPath}}",
                    title: outFilename,
                  });
                } catch (ex: any) {
                  vscode.window.showErrorMessage(ex.message);
                }
                const view = new ViewLoader({ context, filepath: outFilePath });
                view.create();
                return;
              }
              outputChannel.appendLine(`==> [Job Failed] exit code: ${code}`);
            },
          });

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
    "ChsimuDev.edit",
    async (uri: vscode.Uri) => {
      try {
        const { currentFileName, currentFolder, currentFilePath } =
          getCurrentActiveFileAndFolder(uri);

        if (currentFileName.match(/\.script/)) {
          const configPath = path.resolve(currentFolder, CONFIG_NAME);
          const configJson = existsSync(configPath) ? require(configPath) : {};

          const { chsimuFloder, chsimuName } = getChsimuFileFloder();

          // 获取用户输入的参数
          const inputBox = vscode.window.createInputBox();
          inputBox.placeholder = "contract script args";
          inputBox.prompt = "run contract with script args. e.g.: /count:1000";
          inputBox.value = configJson[currentFileName] || "";
          inputBox.ignoreFocusOut = true;
          inputBox.show();
          inputBox.onDidAccept(() => {
            if (inputBox) {
              const contractScriptArg = inputBox.value;
              // 释放终端，防止卡住
              if (terminal) {
                terminal.dispose();
              }
              // 创建并执行
              terminal = vscode.window.createTerminal({
                message: "Run Chain Simulator",
                cwd: chsimuFloder,
              });
              terminal.show();
              terminal.sendText(
                `.${isWin ? "\\" : "/"}${chsimuName} -log ${currentFilePath} ${
                  contractScriptArg || ""
                }`
              );
              // 写入配置
              configJson[currentFileName] = contractScriptArg;
              writeFileSync(configPath, JSON.stringify(configJson, null, 2));
              // 关闭input框
              inputBox.hide();
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
    "ChsimuDev.compile",
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
            message: "Run Compile",
            cwd: chsimuFloder,
          });
          terminal.show();
          terminal.sendText(
            `.${isWin ? "\\" : "/"}${chsimuName} -log ${currentFilePath}`
          );
        } else {
          vscode.window.showErrorMessage("Run Compile: only run with prd file");
        }
      } catch (e) {
        console.log(e);
      }
    }
  );

  const viewHtmlCommand = vscode.commands.registerCommand(
    "ChsimuDev.view",
    async (uri: vscode.Uri) => {
      try {
        const { currentFileName, currentFilePath } =
          getCurrentActiveFileAndFolder(uri);
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
