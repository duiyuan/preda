import * as vscode from "vscode";
import { existsSync, writeFileSync } from "fs";
import * as path from "path";

import { spawn } from "./process";
import { formatTime } from "./time";
import ViewLoader from "../viewloader";
import FileHandler from "./filehandler";

const isWin = process.platform === "win32";
let outputChannel: vscode.OutputChannel;

export const getCurrentActiveFileAndFolder = (uri: vscode.Uri) => {
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

export const getPathFloderAndName = (path: string) => {
  const lastStr = path.lastIndexOf(isWin ? "\\" : "/") + 1;
  const fileName = path.substring(lastStr);
  const fileFloder = path.substring(0, lastStr);
  return {
    fileName,
    fileFloder,
  };
};

export const getChsimuFileFloder = () => {
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

  return { chsimuName, chsimuFloder };
};

interface OutputParams {
  currentFilePath: string;
  currentFolder: string;
  currentFileName: string;
  contractScriptArg: string;
  channel?: string;
  context: vscode.ExtensionContext;
}

export function outputToChannel(params: OutputParams) {
  return new Promise((resolve, reject) => {
    const {
      currentFilePath,
      contractScriptArg,
      currentFolder,
      currentFileName,
      context,
      channel = "ChsimuDev",
    } = params;

    const extesionPath = context.extensionPath;
    const { chsimuFloder, chsimuName } = getChsimuFileFloder();

    const uiTemp = path.resolve(extesionPath, "out/web/index.html");
    const now = formatTime(Date.now(), "YYYY_MM_DD_HH_mm_ss");
    const fname = currentFileName.split(".")[0];
    const outFilename = `${fname.replace(/\./g, "_")}_${now}`;
    const outFilePath = path.resolve(
      currentFolder,
      `results/${outFilename}.html`
    );
    const args = [
      `-log ${currentFilePath}`,
      `${contractScriptArg || ""}`,
      `-viz_templ:${uiTemp}`,
      `-viz:${outFilePath}`,
    ];
    const invokeMsg = `[${formatTime(
      Date.now(),
      "YYYY-MM-DD HH:mm:ss"
    )}] ${chsimuName} ${args.join(" ")}`;

    if (outputChannel) {
      outputChannel.clear();
    } else {
      outputChannel = vscode.window.createOutputChannel(channel);
    }
    outputChannel.show();
    outputChannel.appendLine(invokeMsg);
    spawn({
      cmd: chsimuName,
      option: { cwd: chsimuFloder, shell: true },
      args,
      onData: (data) => {
        const message = data.toString();
        outputChannel.appendLine(message);
      },
      onErr: (err) => {
        outputChannel.appendLine(`${err.toString()}`);
        reject(err.toString());
      },
      onExt: async (code) => {
        outputChannel.show();

        if (code === 0) {
          outputChannel.appendLine(`Result has been output to ${outFilePath}`);
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
          resolve(null);
          return;
        }
        outputChannel.appendLine(`==> [Job Failed] exit code: ${code}`);
        reject(code);
      },
    });
  });
}
