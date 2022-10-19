// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import path = require('path');
import { existsSync, writeFileSync } from 'fs';


let terminal: vscode.Terminal | undefined;
const CONFIG_NAME = 'scriptArgs.json';

const isWin = process.platform === 'win32';

const getPathFloderAndName = (path: string) => {
  const lastStr = path.lastIndexOf(isWin ? '\\' : '/') + 1;
  const fileName = path.substring(lastStr);
  const fileFloder = path.substring(0, lastStr);
  return {
    fileName,
    fileFloder,
  };
};
const getCurrentActiveFileAndFloder = (uri: vscode.Uri) => {
  // uri会给出命令执行时选择的路径
  // 如果右键点击文件夹，这里就是文件夹的路径
  let currentFilePath = uri?.fsPath;
  // 命令行获取当前tab路径
  if (!currentFilePath) {
    currentFilePath = vscode.window?.activeTextEditor?.document.uri.fsPath || '';
  }
  const lastStr = currentFilePath.lastIndexOf(isWin ? '\\' : '/') + 1;
  const currentFileName = currentFilePath.substring(lastStr);
  const currentFloder = currentFilePath.substring(0, lastStr);
  return {
    currentFileName,
    currentFloder,
    currentFilePath
  };
};
const getChsimuFileFloder = () => {
  // 获取Chsimu路径
  const chsimuPath = vscode.workspace.getConfiguration('ChsimuDev').get('path') as string;

  if (!chsimuPath || !existsSync(chsimuPath)) {
    const errorText ='Run Chain Simulator: can not find Chsimu ' + chsimuPath;
    vscode.window.showErrorMessage(errorText);
    throw new Error(errorText);
  }

  const { fileName: chsimuName, fileFloder: chsimuFloder } = getPathFloderAndName(chsimuPath);

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

  // run
	const runChsimuCommand = vscode.commands.registerCommand(
		'ChsimuDev.run',
		async (uri: vscode.Uri) => {
      try {
        const { currentFileName, currentFloder, currentFilePath } = getCurrentActiveFileAndFloder(uri);
        
        if (currentFileName.match(/\.script/)) {
          
          const configPath = path.resolve(currentFloder, CONFIG_NAME);
          const configJson = existsSync(configPath) ? require(configPath) : {};
          const contractScriptArg = configJson[currentFileName] || '';
          const { chsimuFloder, chsimuName } = getChsimuFileFloder();

          // 释放终端，防止卡住
          if (terminal) {
            terminal.dispose();
          }
          // 创建并执行
          terminal = vscode.window.createTerminal({
            message: 'Run Chain Simulator',
            cwd: chsimuFloder
          });
          terminal.show();
          terminal.sendText(`.${isWin ? '\\' : '/'}${chsimuName} -log ${currentFilePath} ${contractScriptArg || ''}`);
        } else {
          vscode.window.showErrorMessage('Run Chain Simulator: only run with script file');
        }
      }catch(e) {
        console.log(e);
      }
		}

	);

  // edit
  const editChsimuCommand= vscode.commands.registerCommand(
		'ChsimuDev.edit',
		async (uri: vscode.Uri) => {
      try {
        const { currentFileName, currentFloder, currentFilePath } = getCurrentActiveFileAndFloder(uri);
        
        if (currentFileName.match(/\.script/)) {
          
          const configPath = path.resolve(currentFloder, CONFIG_NAME);
          const configJson = existsSync(configPath) ? require(configPath) : {};

          const { chsimuFloder, chsimuName } = getChsimuFileFloder();

          // 获取用户输入的参数
          const inputBox = vscode.window.createInputBox();
          inputBox.placeholder = "contract script args";
          inputBox.prompt = "run contract with script args. e.g.: /count:1000";
          inputBox.value = configJson[currentFileName] || '';
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
                message: 'Run Chain Simulator',
                cwd: chsimuFloder
              });
              terminal.show();
              terminal.sendText(`.${isWin ? '\\' : '/'}${chsimuName} -log ${currentFilePath} ${contractScriptArg || ''}`);
              // 写入配置
              configJson[currentFileName] = contractScriptArg;
              writeFileSync(configPath, JSON.stringify(configJson, null, 2));
              // 关闭input框
              inputBox.hide();
            }
          });
          
        } else {
          vscode.window.showErrorMessage('Run Chain Simulator: only run with script file');
        }
      }catch(e) {
        console.log(e);
      }
		}

	);

  // compile
  const compileChsimuCommand = vscode.commands.registerCommand(
		'ChsimuDev.compile',
		async (uri: vscode.Uri) => {
      try {
        const { currentFileName, currentFilePath } = getCurrentActiveFileAndFloder(uri);
        
        if (currentFileName.match(/\.prd/)) {
          
          const { chsimuFloder, chsimuName } = getChsimuFileFloder();

          // 释放终端，防止卡住
          if (terminal) {
            terminal.dispose();
          }
          // 创建并执行
          terminal = vscode.window.createTerminal({
            message: 'Run Compile',
            cwd: chsimuFloder
          });
          terminal.show();
          terminal.sendText(`.${isWin ? '\\' : '/'}${chsimuName} -log ${currentFilePath}`);
        } else {
          vscode.window.showErrorMessage('Run Compile: only run with prd file');
        }
      }catch(e) {
        console.log(e);
      }
		}

	);

	// 注册到监听队列中
	context.subscriptions.push(runChsimuCommand);
	context.subscriptions.push(editChsimuCommand);
	context.subscriptions.push(compileChsimuCommand);


}

// this method is called when your extension is deactivated
export function deactivate() {}
