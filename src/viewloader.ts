import * as vscode from "vscode";
import * as fs from "fs/promises";
import * as ejs from "ejs";
import * as path from "path";

interface ViewLoaderParams {
  filepath: string;
  context: vscode.ExtensionContext;
}

export default class ViewLoader {
  // static currentPanel?: vscode.WebviewPanel;

  private context: vscode.ExtensionContext;
  private filepath: string;
  private panel?: vscode.WebviewPanel;
  private disposables: vscode.Disposable[];

  resourceUri: vscode.Uri;

  constructor(params: ViewLoaderParams) {
    this.context = params.context;
    this.filepath = params.filepath;
    this.disposables = [];
    this.resourceUri = vscode.Uri.file(
      path.join(this.context.extensionPath, "resource")
    );
  }

  get currentPanel() {
    return this.panel;
  }

  async create() {
    this.panel = vscode.window.createWebviewPanel(
      "ChsimuDev",
      "ChsimuDev View Dump",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(this.context.extensionPath, "resource")),
        ],
      }
    );
    this.panel.webview.html = await this.render();

    // Reset when the current panel is closed
    this.panel.onDidDispose(
      () => {
        this.panel = undefined;
        console.log("webview disposed");
      },
      null,
      this.context.subscriptions
    );
    return this;
  }

  dispose() {
    this.panel?.dispose();
  }

  async render(): Promise<string> {
    const content = await fs.readFile(this.filepath, { encoding: "utf-8" });
    const resourcePath = this.panel?.webview.asWebviewUri(this.resourceUri);
    return ejs.render(
      content,
      { staticPath: resourcePath },
      { beautify: true }
    );
  }
}
