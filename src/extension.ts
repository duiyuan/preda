// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import path = require('path');
import { existsSync } from 'fs';


let terminal: vscode.Terminal | undefined;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	const devChsimuCommand = vscode.commands.registerCommand(
		'ChsimuDev.run',
		async (uri: vscode.Uri) => {
			// uri会给出命令执行时选择的路径
			// 如果右键点击文件夹，这里就是文件夹的路径
			let dirPath = uri?.fsPath;
			// 命令行获取当前tab路径
			if (!dirPath) {
				dirPath = vscode.window?.activeTextEditor?.document.uri.fsPath || '';
			}
			const isWin = process.platform === 'win32';
			const lastStr = dirPath.lastIndexOf(isWin ? '\\' : '/') + 1;
			const fileName = dirPath.substring(lastStr);
			if (fileName.match(/\.script/)) {
				// 获取Chsimu路径
				const chsimuPath = vscode.workspace.getConfiguration('ChsimuDev').get('path') as string;

				if (!chsimuPath || !existsSync(chsimuPath)) {
					return vscode.window.showErrorMessage('Run Chain Simulator: can not find Chsimu ' + chsimuPath);
				}

			  const lastStr = chsimuPath.lastIndexOf(isWin ? '\\' : '/') + 1;
			  const chsimuFloder = chsimuPath.substring(0, lastStr);
			  const chsimuName = chsimuPath.substring(lastStr);

				// 获取用户输入的参数
				const contractScriptArg = await vscode.window.showInputBox({
					placeHolder: "contract script args",
					prompt: "run contract with script args. e.g.: /count:1000",
				});

				terminal = terminal || vscode.window.createTerminal({
					message: 'Dev Chain Simulator',
          cwd: chsimuFloder
				});
				terminal.show();
				terminal.sendText(`.${isWin ? '\\' : '/'}${chsimuName} -log ${dirPath} ${contractScriptArg || ''}`);
			} else {
				vscode.window.showErrorMessage('Run Chain Simulator: only run with script file');
			}
		}
	);
	// 注册到监听队列中
	context.subscriptions.push(devChsimuCommand);

}

// this method is called when your extension is deactivated
export function deactivate() {}
