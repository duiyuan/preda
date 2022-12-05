import * as vscode from "vscode";
import { existsSync } from "fs-extra";

const isWin = process.platform === "win32";

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

export function findTSByPrdName(uri: vscode.Uri) {
  const fileContext = getCurrentActiveFileAndFolder(uri);
  const { currentFolder } = fileContext;
  let { currentFileName, currentFilePath } = fileContext;

  if (currentFileName.endsWith(".prd")) {
    currentFileName = currentFileName.replace(".prd", ".prdts");
    currentFilePath = currentFilePath.replace(".prd", ".prdts");
  }

  return {
    currentFileName,
    currentFilePath,
    currentFolder,
    exist: existsSync(currentFilePath),
  };
}
