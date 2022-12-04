// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import PrdtsComplationProvider from "./CompletionProvider/predats";
import runPreda from "./Commands/run";
import editArgs from "./Commands/edit";
import compile from "./Commands/compile";
import view from "./Commands/view";

const util = require("./utils/hl");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // run
  const runChsimuCommand = vscode.commands.registerCommand(
    "Preda.run",
    (uri: vscode.Uri) => runPreda(uri, context)
  );

  // edit
  const editChsimuCommand = vscode.commands.registerCommand(
    "Preda.edit",
    (uri: vscode.Uri) => editArgs(uri, context)
  );

  // compile
  const compileChsimuCommand = vscode.commands.registerCommand(
    "Preda.compile",
    (uri: vscode.Uri) => compile(uri, context)
  );

  const viewHtmlCommand = vscode.commands.registerCommand(
    "Preda.view",
    (uri: vscode.Uri) => view(uri, context)
  );

  const completionItemProvider = new PrdtsComplationProvider();
  const provider = vscode.languages.registerCompletionItemProvider(
    "prdts",
    completionItemProvider,
    ".",
    "@"
  );
  // 注册到监听队列中
  context.subscriptions.push(runChsimuCommand);
  context.subscriptions.push(editChsimuCommand);
  context.subscriptions.push(compileChsimuCommand);
  context.subscriptions.push(viewHtmlCommand);
  context.subscriptions.push(provider);

  let timeout: any = null;
  let activeEditor = vscode.window.activeTextEditor;
  let isCaseSensitive: boolean,
    assembledData: any,
    decorationTypes: { [key: string]: vscode.TextEditorDecorationType },
    pattern: any,
    styleForRegExp: any,
    keywordsPattern: string;
  let settings = vscode.workspace.getConfiguration("Preda");

  const diagnostics =
    vscode.languages.createDiagnosticCollection("Predalog-highlight");

  context.subscriptions.push(diagnostics);

  init(settings);

  if (activeEditor) {
    triggerUpdateDecorations();
  }

  vscode.window.onDidChangeActiveTextEditor(
    function (editor) {
      activeEditor = editor;
      if (editor) {
        triggerUpdateDecorations();
      }
    },
    null,
    context.subscriptions
  );

  // An event that is emitted when a text document is changed.
  // This usually happens when the contents changes but also when other things like the dirty-state changes
  vscode.workspace.onDidChangeTextDocument(
    function (event: vscode.TextDocumentChangeEvent) {
      if (activeEditor && event.document === activeEditor.document) {
        triggerUpdateDecorations();
      }
    },
    null,
    context.subscriptions
  );

  // An event that is emitted when a text document is disposed
  // or when the language id of a text document has been changed.
  vscode.workspace.onDidCloseTextDocument(
    function (event: any) {
      diagnostics.set(event.document, []);
    },
    null,
    context.subscriptions
  );

  // An event that is emitted when the configuration changed.
  vscode.workspace.onDidChangeConfiguration(
    function () {
      settings = vscode.workspace.getConfiguration("Preda");
      //NOTE: if disabled, do not re-initialize the data or we will not be able to clear the style immediatly via 'toggle highlight' command
      // if (!settings.get("isEnable")) {
      //   return;
      // }

      init(settings);
      triggerUpdateDecorations();
    },
    null,
    context.subscriptions
  );

  function createDiagnostic(
    document: vscode.TextDocument,
    range: vscode.Range,
    match: RegExpExecArray | null,
    matchedValue: any
  ) {
    let lineText = document.lineAt(range.start).text;
    let content = util.getContent(lineText, match);
    if (content.length > 160) {
      content = content.substring(0, 160).trim() + "...";
    }
    const severity = assembledData[matchedValue]?.diagnosticSeverity;
    if (severity !== null && severity !== undefined) {
      return new vscode.Diagnostic(range, content, severity);
    }
  }

  function updateDecorations() {
    if (!activeEditor || !activeEditor.document) {
      return;
    }

    const problems = [];
    const postDiagnostics =
      settings.get("isEnable") && settings.get("enableDiagnostics");

    const text = activeEditor.document.getText();
    const matches: any = {};
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text))) {
      let startPos = activeEditor.document.positionAt(match.index);
      let endPos = activeEditor.document.positionAt(
        match.index + match[0].length
      );

      let decoration = {
        range: new vscode.Range(startPos, endPos),
      };

      let matchedValue = match[0];
      let patternIndex = match.slice(1).indexOf(matchedValue);
      matchedValue = Object.keys(decorationTypes)[patternIndex] || matchedValue;

      if (postDiagnostics) {
        let problem = createDiagnostic(
          activeEditor.document,
          decoration.range,
          match,
          matchedValue
        );
        if (problem) {
          problems.push(problem);
        }
      }

      if (!isCaseSensitive) {
        matchedValue = matchedValue.toUpperCase();
      }

      if (matches[matchedValue]) {
        matches[matchedValue].push(decoration);
      } else {
        matches[matchedValue] = [decoration];
      }

      if (keywordsPattern.trim() && !decorationTypes[matchedValue]) {
        decorationTypes[matchedValue] =
          vscode.window.createTextEditorDecorationType(styleForRegExp);
      }
    }

    Object.keys(decorationTypes).forEach((v) => {
      const rangeOption =
        settings.get("isEnable") && matches[v] ? matches[v] : [];
      const decorationType = decorationTypes[v];
      activeEditor?.setDecorations(decorationType, rangeOption);
    });

    diagnostics.set(activeEditor.document.uri, problems);
  }

  function init(settings: any) {
    const customDefaultStyle = settings.get("defaultStyle");
    keywordsPattern = settings.get("keywordsPattern");
    isCaseSensitive = settings.get("isCaseSensitive", true);

    decorationTypes = {};

    if (keywordsPattern.trim()) {
      styleForRegExp = Object.assign(
        {},
        util.DEFAULT_STYLE,
        customDefaultStyle,
        {
          overviewRulerLane: vscode.OverviewRulerLane.Right,
        }
      );

      pattern = keywordsPattern;
    } else {
      assembledData = util.getAssembledData(
        settings.get("keywords"),
        customDefaultStyle,
        isCaseSensitive
      );
      Object.keys(assembledData).forEach((v) => {
        if (!isCaseSensitive) {
          v = v.toUpperCase();
        }

        var mergedStyle = Object.assign(
          {},
          {
            overviewRulerLane: vscode.OverviewRulerLane.Right,
          },
          assembledData[v]
        );

        if (!mergedStyle.overviewRulerColor) {
          // use backgroundColor as the default overviewRulerColor if not specified by the user setting
          mergedStyle.overviewRulerColor = mergedStyle.backgroundColor;
        }

        decorationTypes[v] =
          vscode.window.createTextEditorDecorationType(mergedStyle);
      });

      // Give each keyword a group in the pattern
      pattern = Object.keys(assembledData)
        .map((v) => {
          if (!assembledData[v].regex) {
            return `(${util.escapeRegExp(v)})`;
          }

          let p = assembledData[v].regex.pattern || v;
          // Ignore unescaped parantheses to avoid messing with our groups
          return `(${util.escapeRegExpGroups(p)})`;
        })
        .join("|");
    }

    pattern = new RegExp(pattern, "gi");
    if (isCaseSensitive) {
      pattern = new RegExp(pattern, "g");
    }
  }

  function triggerUpdateDecorations() {
    timeout && clearTimeout(timeout);
    timeout = setTimeout(updateDecorations, 0);
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
