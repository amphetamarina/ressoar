import type { Lang } from "../stores/settings.svelte";
import { pt } from "./pt";
import { en } from "./en";

export type SentenceTag = "vowels" | "nasals" | "fricatives" | "plosives" | "liquids" | "questions" | "mixed";
export type Sentence = { text: string; tag: SentenceTag };

export function sentencesFor(lang: Lang): Sentence[] {
  return lang === "pt" ? pt : en;
}
