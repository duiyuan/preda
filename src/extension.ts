// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import path = require('path');
import { existsSync } from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log(123);
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
			const lastStr = dirPath.lastIndexOf('/') + 1;
			const fileName = dirPath.substring(lastStr);
			const fileFloder = dirPath.substring(0, lastStr);
			if (fileName.match(/\.prd/)) {
				// 获取Chsimu路径
				const chsimuPath = vscode.workspace.getConfiguration('ChsimuDev').get('path') as string;

				if (!chsimuPath || !existsSync(chsimuPath)) {
					return vscode.window.showErrorMessage('Run Chain Simulator: can not find Chsimu ' + chsimuPath);
				}

				// 获取用户输入的script 和 参数
				const contractScript = await vscode.window.showInputBox({
					placeHolder: "contract script and args",
					prompt: "run contract with script and args. e.g.: test.script /count:1000",
				});
				const [scriptPath, scriptArg] = (contractScript || '').split(' ');
				const sPath = path.resolve(fileFloder, scriptPath);
				if(contractScript === '' || !existsSync(sPath)){
					return vscode.window.showErrorMessage('Run Chain Simulator: can not find script ' + sPath);
				}

				const t = vscode.window.createTerminal({
					message: 'Dev Chain Simulator'
				});
				t.show();
				t.sendText(`${chsimuPath} ${sPath} ${scriptArg}`);

				dirPath && vscode.window.showInformationMessage(fileFloder);
			} else {
				vscode.window.showErrorMessage('Run Chain Simulator: only run with prd file');
			}
		}
	);
	// 注册到监听队列中
	context.subscriptions.push(devChsimuCommand);

}

// this method is called when your extension is deactivated
export function deactivate() {}
