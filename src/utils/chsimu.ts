import * as vscode from "vscode";
import { existsSync, ensureDirSync } from "fs-extra";
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
    .getConfiguration("Preda")
    .get("path") as string;

  if (!chsimuPath) {
    const errorText = "settings.preda.path is unset ";
    vscode.window.showErrorMessage(errorText);
    throw new Error(errorText);
  }

  if (!existsSync(chsimuPath)) {
    const errorText =
      "The executable program(" + chsimuPath + ") doesn't exist";
    vscode.window.showErrorMessage(errorText);
    throw new Error(errorText);
  }

  const { fileName: chsimuName, fileFloder: chsimuFloder } =
    getPathFloderAndName(chsimuPath);

  return { chsimuName, chsimuFloder };
};

// export const getOutputPath = () => {
//   const chsimuConf = vscode.workspace.getConfiguration("Preda");
//   return chsimuConf.get<string>("output");
// };

interface OutputParams {
  currentFilePath: string;
  currentFolder: string;
  currentFileName: string;
  contractScriptArg: string;
  channel?: string;
  context: vscode.ExtensionContext;
}

export async function outputToChannel(params: OutputParams) {
  const {
    currentFilePath,
    contractScriptArg,
    currentFolder,
    currentFileName,
    context,
    channel = "Preda",
  } = params;

  const extesionPath = context.extensionPath;
  const { chsimuFloder, chsimuName } = getChsimuFileFloder();
  const uiTemp = path.resolve(extesionPath, "out/web/index.html");
  const now = formatTime(Date.now(), "YYYY_MM_DD_HH_mm_ss");
  const fname = currentFileName.split(".")[0];
  const outFilename = `${fname}_latest_run`;

  // let outputDirPath = getOutputPath();

  // ensure output directory exist
  // if (outputDirPath) {
  //   await ensureDirSync(outputDirPath, 766);
  // }

  const outputDirPath = path.resolve(currentFolder);
  const outFilePath = path.resolve(outputDirPath, outFilename + ".html");
  const logPath = path.resolve(outputDirPath, outFilename + ".log");

  if (outputChannel) {
    outputChannel.clear();
  } else {
    outputChannel = vscode.window.createOutputChannel(channel);
  }

  const args = [
    `"${currentFilePath}"`,
    `${contractScriptArg || ""}`,
    `-viz_templ:"${uiTemp}"`,
    `-viz:"${outFilePath}"`,
    `-log:"${logPath}"`,
  ];
  const invokeMsg = `[${formatTime(
    Date.now(),
    "YYYY-MM-DD HH:mm:ss"
  )}] ${chsimuName} ${args.join(" ")}`;

  outputChannel.show();
  outputChannel.appendLine(invokeMsg);
  spawn({
    cmd: isWin ? chsimuName : "./" + chsimuName,
    option: { cwd: chsimuFloder, shell: true },
    args,
    onData: (data) => {
      const message = data.toString();
      outputChannel.append(message);
    },
    onErr: (err) => {
      outputChannel.appendLine(`${err.toString()}`);
    },
    onExt: (code) => {
      outputChannel.show();

      if (code === 0) {
        outputChannel.appendLine(`Result will output to "${outFilePath}"`);
        outputChannel.appendLine("");
        const file = new FileHandler({
          filepath: outFilePath,
          context,
        });
        file
          .inject({
            args: contractScriptArg,
            contract: currentFileName,
            staticPath: "{{staticPath}}",
            title: outFilename,
          })
          .then(() => {
            const view = new ViewLoader({ context, filepath: outFilePath });
            view.create();
          })
          .catch((ex) => {
            vscode.window.showErrorMessage(ex.message);
          });
        return;
      }
      outputChannel.appendLine(`[Failed] exit code: ${code}`);
    },
  });
}
