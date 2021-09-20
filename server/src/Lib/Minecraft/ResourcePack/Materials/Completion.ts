import { Identifiable } from "bc-minecraft-bedrock-types/lib/src/Types/Identifiable";
import { SimpleContext } from "../../../Code/SimpleContext";
import { CompletionBuilder } from "../../../Completion/Builder";
import { Database } from "../../../Database/include";
import { Kinds } from "../../General/Kinds";

export function ProvideCompletion(context: SimpleContext<CompletionBuilder>): void {
  const generateDoc = (item: Identifiable) => `The material: ${item.id}`;

  context.receiver.Generate(Database.ProjectData.ResourcePacks.materials, generateDoc, Kinds.Completion.Materials);
}
