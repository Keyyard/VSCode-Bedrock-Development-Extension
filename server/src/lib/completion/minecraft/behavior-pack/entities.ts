import { Identifiable } from "bc-minecraft-bedrock-types/lib/src/types/identifiable";
import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { SimpleContext } from "../../../Code/SimpleContext";
import { CompletionBuilder } from "../../builder/builder";
import { Database } from "../../../Database/Database";
import { IsEducationEnabled } from "../../../Project/Attributes";
import { Kinds } from "../../../Minecraft/General/Kinds";
import { JsonPathCompletion } from "../../builder/json-path";

import * as Animations from "./animations";
import * as AnimationControllers from "./animation-controllers";
import * as LootTables from "./loot-tables";
import * as Item from "./items";
import * as Trading from "./trading";
import * as Sounds from "../resource-pack/sounds";

export function provideCompletion(context: SimpleContext<CompletionBuilder>): void {
  const generateDoc = (item: Identifiable) => `The entity definition: ${item.id}`;

  context.receiver.generate(Database.ProjectData.BehaviorPacks.entities, generateDoc, Kinds.Completion.Entity);

  //Vanilla data
  context.receiver.generate(MinecraftData.vanilla.BehaviorPack.entities, generateDoc, Kinds.Completion.Entity);

  //Education data
  if (IsEducationEnabled(context.doc)) {
    context.receiver.generate(MinecraftData.edu.BehaviorPack.entities, generateDoc, Kinds.Completion.Entity);
  }
}

export function provideJsonCompletion(context: SimpleContext<CompletionBuilder>) {
  return entityJsonCompletion.onCompletion(context);
}

const entityJsonCompletion = new JsonPathCompletion(
  {
    match: "throw_sound",
    onCompletion: Sounds.provideCompletion,
  },
  {
    match: "minecraft:ambient_sound_interval/event_name",
    onCompletion: Sounds.provideCompletion,
  },
  {
    match: "minecraft:loot/table",
    onCompletion: LootTables.provideCompletion,
  },
  {
    match: "minecraft:trade_table/table",
    onCompletion: Trading.provideCompletion,
  },
  {
    match: "item",
    onCompletion: Item.provideCompletion,
  },
  {
    match: (path) => path.includes("minecraft:entity/description/animations/"),
    onCompletion: (c) => {
      Animations.provideCompletion(c);
      AnimationControllers.provideCompletion(c);
    }
  }
);
