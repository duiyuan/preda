// https://code.visualstudio.com/api/language-extensions/programmatic-language-features#show-code-completion-proposals

import * as vscode from "vscode";
import providers from "./prdts-items";

export default class PrdtsCompletionItemProvider
  implements vscode.CompletionItemProvider
{
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position
  ) {
    const linePrefix = document
      .lineAt(position)
      .text.substr(0, position.character);

    for (let i = 0; i < providers.length; i++) {
      const provider = providers[i];
      if (provider.match.test(linePrefix)) {
        return provider.items;
      }
    }
    return [];
  }
}
