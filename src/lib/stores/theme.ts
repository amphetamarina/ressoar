import { settings } from "./settings.svelte";

/** Applies the selected theme to <html data-theme> and keeps it in sync with the system preference. */
export function applyTheme(): void {
  const root = document.documentElement;
  if (settings.theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", settings.theme);
}

export function isDark(): boolean {
  if (settings.theme !== "system") return settings.theme === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
