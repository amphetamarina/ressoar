export const STORAGE_KEY = "ressoar:settings";

const MIGRATED_KEY = "ressoar:migrated";

/** One-time cleanup of data written by the previous Ressoar (sessions, anchors, history). */
export function migrateLegacyStorage(): void {
  try {
    if (localStorage.getItem(MIGRATED_KEY)) return;
    if (!localStorage.getItem(STORAGE_KEY)) {
      const legacyLang = localStorage.getItem("ressoar:lang");
      if (legacyLang === "en" || legacyLang === "pt") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, lang: legacyLang }));
      }
    }
    for (const key of Object.keys(localStorage)) {
      if (key === "ressoar:lang" || key === "ressoar:fullness-target" || key.startsWith("ressoar:done:")) {
        localStorage.removeItem(key);
      }
    }
    localStorage.setItem(MIGRATED_KEY, "1");
  } catch {
    // Storage unavailable; nothing to migrate.
  }
  try {
    indexedDB?.deleteDatabase("ressoar-voice");
  } catch {
    // Ignore: the old database may not exist.
  }
}
