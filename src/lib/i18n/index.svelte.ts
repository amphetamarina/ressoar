import { settings, type Lang } from "../stores/settings.svelte";
import { pt, type Dictionary } from "./pt";
import { en } from "./en";

const dictionaries: Record<Lang, Dictionary> = { pt, en };

/** Active dictionary; reactive because it reads settings.lang. */
export function t(): Dictionary {
  return dictionaries[settings.lang];
}

export function toggleLang(): void {
  settings.lang = settings.lang === "pt" ? "en" : "pt";
}

export function locale(): string {
  return settings.lang === "pt" ? "pt-BR" : "en-US";
}
