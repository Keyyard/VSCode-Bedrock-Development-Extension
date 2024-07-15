import { Diagnostic } from "vscode-languageserver";
import { CodeActionBuilder } from "../../../code-action/builder";
import { Definition } from "../../../code-action/types/Definition";

export function OnCodeAction(builder: CodeActionBuilder, diag: Diagnostic) {
  switch (diag.code) {
    case "minecraft.objective.missing":
      return Definition(builder, diag, "objective");
  }
}
