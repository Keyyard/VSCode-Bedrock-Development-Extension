import * as vscode from "vscode-languageserver-textdocument";
import * as mcbe from "bc-minecraft-bedrock-project";
import { Database } from "../../Database/Database";
import { MCProject } from "bc-minecraft-project";

export interface TextDocument extends vscode.TextDocument, mcbe.TextDocument {
  /**Returns the text at the given text line
   * @param lineIndex The index of the line to retrieve
   */
  getLine(lineIndex: number): string;

  /**
   *
   */
  getConfiguration(): MCProject;
}

export namespace TextDocument {
  /**
   *
   * @param doc
   * @returns
   */
  export function wrap(doc: vscode.TextDocument): TextDocument {
    let out = doc as InternalTextDocument;
    out.__projectcache = null;

    out.getLine = function getLine(lineIndex: number): string {
      return out.getText({ start: { line: lineIndex, character: 0 }, end: { line: lineIndex, character: Number.MAX_VALUE } });
    };

    out.getConfiguration = function getConfiguration(): MCProject {
      if (out.__projectcache) return out.__projectcache;

      return (out.__projectcache = Database.WorkspaceData.GetForDoc(out.uri));
    };

    return out;
  }

  export function create(uri: vscode.DocumentUri, languageId: string, version: number, content: string): TextDocument {
    return wrap(vscode.TextDocument.create(uri, languageId, version, content));
  }
}

interface InternalTextDocument extends TextDocument {
  /**A hidden field that helps with storing the cache */
  __projectcache: MCProject | null | undefined;
}
