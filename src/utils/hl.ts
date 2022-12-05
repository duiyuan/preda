// https://github.com/jgclark/vscode-todo-highlight.git
import * as vscode from "vscode";
import * as os from "os";

const window = vscode.window;
const workspace = vscode.workspace;

const defaultIcon = "$(checklist)";
const zapIcon = "$(zap)";
const defaultMsg = "0";

const SeverityMap: { [type: string]: vscode.DiagnosticSeverity } = {
  error: vscode.DiagnosticSeverity.Error,
  warning: vscode.DiagnosticSeverity.Warning,
  information: vscode.DiagnosticSeverity.Information,
};

const DEFAULT_KEYWORDS: any = {
  "TODO:": {
    text: "TODO:",
    color: "#fff",
    backgroundColor: "#ffbd2a",
    overviewRulerColor: "rgba(255,189,42,0.8)",
    diagnosticSeverity: "error",
  },
  "FIXME:": {
    text: "FIXME:",
    color: "#fff",
    backgroundColor: "#f06292",
    overviewRulerColor: "rgba(240,98,146,0.8)",
    diagnosticSeverity: "warning",
  },
};

var DEFAULT_STYLE = {
  color: "#2196f3",
  backgroundColor: "#ffeb3b",
};

function getAssembledData(
  keywords: any,
  customDefaultStyle: any,
  isCaseSensitive: any
) {
  let result: any = {},
    regex: any = [],
    reg: RegExp | string;
  keywords.forEach((v: any) => {
    v = typeof v === "string" ? { text: v } : v;
    var text = v.text;
    if (!text) {
      //NOTE: in case of the text is empty
      return;
    }

    if (!isCaseSensitive) {
      text = text.toUpperCase();
    }

    if (text === "TODO:" || text === "FIXME:") {
      v = Object.assign({}, DEFAULT_KEYWORDS[text], v);
    }
    v.diagnosticSeverity = SeverityMap[v.diagnosticSeverity];
    result[text] = Object.assign({}, DEFAULT_STYLE, customDefaultStyle, v);

    if (v.regex) {
      regex.push(regex.pattern || text);
    }
  });

  if (regex) {
    reg = regex.join("|");
  }

  // Don't override existing regex keywords with matching defaults
  Object.keys(DEFAULT_KEYWORDS)
    .filter((v) => {
      if (reg) {
        if (v.match(new RegExp(reg))) {
          return false;
        }
      }

      return true;
    })
    .forEach((v) => {
      if (!result[v]) {
        result[v] = Object.assign(
          {},
          DEFAULT_STYLE,
          customDefaultStyle,
          DEFAULT_KEYWORDS[v]
        );
      }
    });

  return result;
}

function chooseAnnotationType(availableAnnotationTypes: any) {
  return window.showQuickPick(availableAnnotationTypes, {});
}

function getContent(lineText: any, match: any) {
  return lineText.substring(lineText.indexOf(match[0]), lineText.length);
}

function escapeRegExp(s: string) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

function escapeRegExpGroups(s: string) {
  // Lookbehind assertions ("(?<!abc) & (?<=abc)") supported from ECMAScript 2018 and onwards. Native in node.js 9 and up.
  if (parseFloat(process.version.replace("v", "")) > 9.0) {
    let grpPattern = /(?<!\\)(\()([^?]\w*(?:\\+\w)*)(\))?/g;
    // Make group non-capturing
    return s.replace(grpPattern, "$1?:$2$3");
  } else {
    return escapeRegExpGroupsLegacy(s);
  }
}

function escapeRegExpGroupsLegacy(s: string) {
  return s
    .replace(/\(\?<[=|!][^)]*\)/g, "") // Remove any unsupported lookbehinds
    .replace(
      /((?:[^\\]{1}|^)(?:(?:[\\]{2})+)?)(\((?!\?[:|=|!]))([^)]*)(\))/g,
      "$1$2?:$3$4"
    ); // Make all groups non-capturing
}

export default {
  DEFAULT_STYLE,
  getAssembledData,
  chooseAnnotationType,
  escapeRegExp,
  escapeRegExpGroups,
  escapeRegExpGroupsLegacy,
  getContent,
};
