import * as vscode from "vscode";
import * as fs from "fs";
import { promisify } from "util";
import * as Mustache from "mustache";
import * as path from "path";

interface Params {
  filepath: string;
  context: vscode.ExtensionContext;
}

export default class FileHandler {
  filepath: string;
  context: vscode.ExtensionContext;

  constructor(params: Params) {
    this.filepath = params.filepath;
    this.context = params.context;
  }

  async inject(data: KeyValue) {
    const exist = await this.fileExist();
    if (exist) {
      const raw = await this.readFile()(this.filepath, {
        encoding: "utf-8",
      });
      const content = Mustache.render(raw, data || {});
      return this.writeFile()(this.filepath, content);
    }
    throw new Error(
      "inject data failded beacause file not exist:" + this.filepath
    );
  }

  readFile() {
    return promisify(fs.readFile);
  }

  writeFile() {
    return promisify(fs.writeFile);
  }

  async fileExist() {
    return fs.existsSync(this.filepath);
  }

  // 复写文件内容
  async overide() {}
}
