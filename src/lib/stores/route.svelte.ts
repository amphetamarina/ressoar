export const TABS = ["pitch", "spectrogram", "sentences", "tones", "settings"] as const;
export type Tab = (typeof TABS)[number];

function fromHash(): Tab {
  const name = location.hash.replace(/^#\/?/, "").split(/[/?]/)[0];
  return (TABS as readonly string[]).includes(name) ? (name as Tab) : "pitch";
}

const state = $state({ current: fromHash() });

if (typeof window !== "undefined") {
  window.addEventListener("hashchange", () => {
    state.current = fromHash();
  });
}

export const route = {
  get current(): Tab {
    return state.current;
  },
  href(tab: Tab): string {
    return `#/${tab}`;
  },
  go(tab: Tab): void {
    location.hash = `/${tab}`;
  },
};
