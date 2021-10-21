import { CodeAction, CodeActionParams, Command, Diagnostic } from "vscode-languageserver";
import { Minecraft } from "../include";
import { CodeActionBuilder } from "./Builder";
import { Attributes } from "./Types/Definition";

/**
 *
 * @param params
 * @returns
 */
export async function OnCodeActionAsync(params: CodeActionParams): Promise<(Command | CodeAction)[] | undefined | null> {
  return new Promise<(Command | CodeAction)[] | undefined | null>((resolve, reject) => {
    resolve(OnCodeAction(params));
  });
}

/**
 *
 * @param params
 * @returns
 */
export async function OnCodeActionResolveAsync(params: CodeAction): Promise<CodeAction> {
  return new Promise<CodeAction>((resolve, reject) => {
    resolve(params);
  });
}

/**
 *
 * @param params
 * @returns
 */
export function OnCodeAction(params: CodeActionParams): (Command | CodeAction)[] {
  const builder = new CodeActionBuilder(params);
  params.context.diagnostics.forEach((d) => FindAction(builder, d));
  return builder.out;
}

/**
 *
 * @param builder
 * @param diag
 */
function FindAction(builder: CodeActionBuilder, diag: Diagnostic): void {
  var code = diag.code ?? "";

  if (typeof code === "number") {
  } else {
    const index = code.indexOf(".");
    const maincode = index > -1 ? code.slice(0, index) : code;

    switch (maincode) {
      case "behaviorpack":
        Minecraft.BehaviorPack.OnCodeAction(builder, diag);
        return Attributes(builder, diag);

      case "resourcepack":
        Minecraft.ResourcePack.OnCodeAction(builder, diag);
        return Attributes(builder, diag);

      case "minecraft":
        Minecraft.OnCodeAction(builder, diag);
        return Attributes(builder, diag);
    }
  }
}
