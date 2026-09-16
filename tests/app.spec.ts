import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

declare global {
  interface Window {
    __micAttempts: number;
    __fakeOscillator?: OscillatorNode;
    __oscillatorStarts: number;
  }
}

/** Replaces getUserMedia with a synthetic tone so pitch tests are deterministic. */
async function fakeMicrophone(page: Page, hz: number, denyFirst = false) {
  await page.addInitScript(
    ({ hz, denyFirst }) => {
      window.__micAttempts = 0;
      navigator.mediaDevices.getUserMedia = async () => {
        window.__micAttempts += 1;
        if (denyFirst && window.__micAttempts === 1) {
          const error = new Error("denied");
          error.name = "NotAllowedError";
          throw error;
        }
        const ctx = new AudioContext();
        const oscillator = ctx.createOscillator();
        oscillator.frequency.value = hz;
        const destination = ctx.createMediaStreamDestination();
        oscillator.connect(destination);
        oscillator.start();
        window.__fakeOscillator = oscillator;
        return destination.stream;
      };
    },
    { hz, denyFirst },
  );
}

async function countOscillatorStarts(page: Page) {
  await page.addInitScript(() => {
    window.__oscillatorStarts = 0;
    const original = OscillatorNode.prototype.start;
    OscillatorNode.prototype.start = function (this: OscillatorNode, when?: number) {
      window.__oscillatorStarts += 1;
      return original.call(this, when);
    };
  });
}

async function openFresh(page: Page, hash = "#/pitch") {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.goto(`/${hash}`);
}

async function enableMic(page: Page) {
  await page.getByRole("button", { name: /Ativar microfone|Enable microphone/ }).click();
}

test("tabs use hash routing and mark the current page", async ({ page }) => {
  await openFresh(page);
  const nav = page.locator("nav").first();
  await expect(nav.getByRole("link")).toHaveCount(5);
  await expect(nav.getByRole("link", { name: "Pitch" })).toHaveAttribute("aria-current", "page");

  await nav.getByRole("link", { name: "Frases" }).click();
  await expect(page).toHaveURL(/#\/sentences$/);
  await expect(page.getByRole("heading", { name: "Frases para ler" })).toBeVisible();

  await page.goto("/#/tones");
  await expect(page.getByRole("heading", { name: "Tons de referência" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Tons" })).toHaveAttribute("aria-current", "page");
});

test("a blocked microphone is explained and can be retried", async ({ page }) => {
  await fakeMicrophone(page, 220, true);
  await openFresh(page);
  await enableMic(page);
  const alert = page.getByRole("alert");
  await expect(alert).toContainText("O microfone está bloqueado");
  await expect(alert.getByRole("button", { name: "Tentar novamente" })).toBeFocused();
  await alert.getByRole("button", { name: "Tentar novamente" }).click();
  await expect(alert).toBeHidden();
  await expect(page.locator(".readout .hz").first()).toContainText("220", { timeout: 8_000 });
  expect(await page.evaluate(() => window.__micAttempts)).toBe(2);
});

test("live pitch shows Hz, note name, and band", async ({ page }) => {
  await fakeMicrophone(page, 220);
  await openFresh(page);
  await enableMic(page);
  const readout = page.locator(".readout").first();
  await expect(readout.locator(".hz")).toContainText(/^2(19|20|21)/, { timeout: 8_000 });
  await expect(readout.locator(".note")).toHaveText("Lá3 · A3");
  await expect(readout.locator(".pill")).toHaveText("Feminina");

  await page.evaluate(() => {
    window.__fakeOscillator!.frequency.value = 120;
  });
  await expect(readout.locator(".pill")).toHaveText("Masculina", { timeout: 8_000 });
  await expect(readout.locator(".hz")).toContainText(/^1(19|20|21)/);
});

test("the pitch graph renders with a band legend", async ({ page }) => {
  await openFresh(page);
  const graph = page.getByRole("img", { name: "Gráfico de pitch ao vivo" });
  await expect(graph).toBeVisible();
  const size = await graph.locator("canvas").evaluate((node: HTMLCanvasElement) => [node.width, node.height]);
  expect(size[0]).toBeGreaterThan(100);
  expect(size[1]).toBeGreaterThan(100);
  const legend = page.getByRole("list", { name: "Faixas de pitch" });
  await expect(legend).toContainText("Masculina");
  await expect(legend).toContainText("Andrógina");
  await expect(legend).toContainText("Feminina");
});

test("replay plays the buffered audio and returns to listening", async ({ page }) => {
  await fakeMicrophone(page, 200);
  await openFresh(page);
  await enableMic(page);
  const button = page.locator(".replay button");
  await expect(button).toBeEnabled({ timeout: 10_000 });
  await expect(button).toContainText("Ouvir últimos");
  await button.click();
  await expect(button).toContainText("Parar");
  await expect(button).toContainText("Ouvir últimos", { timeout: 15_000 });
  await expect(page.locator(".readout .hz").first()).toContainText("200", { timeout: 8_000 });
});

test("sentences can be browsed, shuffled, and switched to English", async ({ page }) => {
  await openFresh(page, "#/sentences");
  const counter = page.locator(".sentence .tabular");
  const text = page.locator(".sentence .text");
  await expect(counter).toHaveText(/^1 \/ \d+$/);
  const first = await text.textContent();

  await page.getByRole("button", { name: "Próxima" }).click();
  await expect(counter).toHaveText(/^2 \/ \d+$/);
  await page.getByRole("button", { name: "Anterior" }).click();
  await expect(counter).toHaveText(/^1 \/ \d+$/);
  await page.getByRole("button", { name: "Aleatória" }).click();
  await expect(text).not.toHaveText(first!);

  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(page.getByRole("heading", { name: "Sentences to read" })).toBeVisible();
  await expect(text).not.toHaveText(/[ãçé]/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en-US");
});

test("reference tones play, stop, and step in frequency", async ({ page }) => {
  await countOscillatorStarts(page);
  await openFresh(page, "#/tones");
  const play = page.getByRole("button", { name: /Tocar|Parar/ });
  await expect(page.locator(".tone .hz")).toContainText("196");
  await play.click();
  await expect(play).toContainText("Parar");
  await expect(play).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate(() => window.__oscillatorStarts)).toBeGreaterThanOrEqual(1);
  await page.getByRole("button", { name: "1 Hz acima" }).click();
  await expect(page.locator(".tone .hz")).toContainText("197");
  await page.getByRole("button", { name: "Semitom acima" }).click();
  await expect(page.locator(".tone .hz")).toContainText("208");
  await play.click();
  await expect(play).toContainText("Tocar");
});

test("settings persist, legacy data is migrated, and defaults can be restored", async ({ page }) => {
  // Seed data written by the previous Ressoar before the app boots.
  await page.addInitScript(() => {
    if (sessionStorage.getItem("seeded")) return;
    sessionStorage.setItem("seeded", "1");
    localStorage.clear();
    localStorage.setItem("ressoar:lang", "en");
    localStorage.setItem("ressoar:done:old-session", "[]");
    localStorage.setItem("ressoar:fullness-target", "{}");
  });
  await page.goto("/#/settings");
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith("ressoar:")).sort())).toEqual([
    "ressoar:migrated",
    "ressoar:settings",
  ]);

  await page.getByRole("radio", { name: "30 s" }).click();
  await page.getByRole("radio", { name: "Dark" }).click();
  await page.getByLabel("Minimum (Hz)").fill("100");
  await page.getByLabel("Minimum (Hz)").blur();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.waitForTimeout(300);

  await page.reload();
  await expect(page.getByRole("radio", { name: "30 s" })).toHaveAttribute("aria-checked", "true");
  await expect(page.getByLabel("Minimum (Hz)")).toHaveValue("100");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("ressoar:settings")!));
  expect(stored).toMatchObject({ lang: "en", theme: "dark", replaySeconds: 30, minHz: 100 });

  await page.getByRole("button", { name: "Restore defaults" }).click();
  await expect(page.getByRole("heading", { name: "Ajustes" })).toBeVisible();
  await expect(page.getByRole("radio", { name: "10 s" })).toHaveAttribute("aria-checked", "true");
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
});

test("theme and language toggles work and every tab passes axe", async ({ page }) => {
  await openFresh(page);
  await page.getByRole("button", { name: "Alternar tema" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", /light|dark/);

  for (const tab of ["pitch", "spectrogram", "sentences", "tones", "settings"]) {
    for (const theme of ["light", "dark"]) {
      await page.goto(`/#/${tab}`);
      await page.evaluate((value) => document.documentElement.setAttribute("data-theme", value), theme);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations, `${tab} (${theme}): ${JSON.stringify(results.violations, null, 2)}`).toEqual([]);
    }
  }
});

test("mobile layout keeps the tab bar at the bottom without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openFresh(page);
  const nav = page.locator("nav").last();
  await expect(nav).toBeVisible();
  const box = await nav.boundingBox();
  expect(box!.y + box!.height).toBeGreaterThanOrEqual(840);
  for (const tab of ["pitch", "spectrogram", "sentences", "tones", "settings"]) {
    await page.goto(`/#/${tab}`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, tab).toBeLessThanOrEqual(0);
  }
});
