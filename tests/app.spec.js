import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function openExample(page) {
  await page.locator("#btn-example").click();
  await expect(page.locator(".session-head h2")).toHaveText("Exemplo: Glissando");
}

async function waitForMedia(page) {
  await page.waitForFunction(() => document.querySelector(".drill-video")?.srcObject?.getTracks().length > 0);
}

async function expectNoAxeViolations(page) {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("home, localization, sample session, and checklist persistence", async ({ page }) => {
  await expect(page.getByText("Treinos de feminização vocal", { exact: false })).toBeVisible();
  await expect(page.locator("#home-link")).toHaveAttribute("href", "/");

  await page.locator("#lang-toggle").click();
  await expect(page.getByRole("button", { name: "Load Session" })).toBeVisible();
  await page.getByRole("button", { name: "Open example (Glissando)" }).click();
  await expect(page.locator(".progress")).toHaveText("0/1 done");

  await page.locator('.step input[type="checkbox"]').check();
  await expect(page.locator(".progress")).toHaveText("1/1 done");
  await page.getByRole("link", { name: "Ressoar" }).click();
  await page.getByRole("button", { name: "Open example (Glissando)" }).click();
  await expect(page.locator(".progress")).toHaveText("1/1 done");
});

test("recordings cancel on close and download once on stop", async ({ baseURL, context, page }) => {
  await context.grantPermissions(["camera", "microphone"], { origin: baseURL });
  const downloads = [];
  page.on("download", (download) => downloads.push(download.suggestedFilename()));

  await openExample(page);
  await page.locator(".drill-start").click();
  await waitForMedia(page);
  await page.locator(".drill-go").click();
  await page.waitForTimeout(300);
  await page.locator(".drill-close").click();
  await page.waitForTimeout(500);

  expect(downloads).toEqual([]);
  expect(await page.evaluate(() => localStorage.getItem("ressoar:done:example-glissando"))).toBeNull();

  await page.locator(".drill-start").click();
  await waitForMedia(page);
  await page.locator(".drill-go").click();
  await page.waitForTimeout(300);
  const downloadPromise = page.waitForEvent("download");
  await page.locator(".drill-stop").click();
  const download = await downloadPromise;

  await expect(page.locator(".drill-download")).toBeVisible();
  expect(download.suggestedFilename()).toMatch(/\.webm$|\.mp4$/);
  expect(downloads).toHaveLength(1);
  expect(await page.evaluate(() => localStorage.getItem("ressoar:done:example-glissando"))).toBe('["step:0:0"]');
});

test("pitch tracking remains accurate at a throttled sample rate", async ({ page }) => {
  await page.evaluate(() => {
    window.__analysisCalls = 0;
    const original = AnalyserNode.prototype.getFloatTimeDomainData;
    AnalyserNode.prototype.getFloatTimeDomainData = function getFloatTimeDomainData(buffer) {
      window.__analysisCalls += 1;
      return original.call(this, buffer);
    };
    navigator.mediaDevices.getUserMedia = async () => {
      const sourceContext = new AudioContext();
      const oscillator = sourceContext.createOscillator();
      const destination = sourceContext.createMediaStreamDestination();
      oscillator.frequency.value = 220;
      oscillator.connect(destination);
      oscillator.start();
      window.__pitchSource = { sourceContext, oscillator };
      return destination.stream;
    };
  });

  await openExample(page);
  await page.locator(".drill-start").click();
  await waitForMedia(page);
  await page.locator(".drill-go").click();
  await expect(page.locator(".drill-hz")).not.toHaveText("—");
  await page.waitForTimeout(1_000);

  await expect(page.locator(".drill-hz")).toHaveText("220 Hz");
  await expect(page.locator(".drill-note")).toHaveText("A3 · Lá3");
  const calls = await page.evaluate(() => window.__analysisCalls);
  expect(calls).toBeGreaterThanOrEqual(15);
  expect(calls).toBeLessThanOrEqual(25);
});

test("primary views have accessible semantics and modal focus behavior", async ({ baseURL, context, page }) => {
  await context.grantPermissions(["camera", "microphone"], { origin: baseURL });
  await expectNoAxeViolations(page);

  await page.locator("#btn-create").click();
  await expectNoAxeViolations(page);
  await page.locator("#home-link").click();
  await openExample(page);
  await expectNoAxeViolations(page);

  await page.locator(".drill-start").focus();
  await page.locator(".drill-start").click();
  await waitForMedia(page);
  await expect(page.locator(".drill")).toHaveAttribute("role", "dialog");
  await expect(page.locator(".drill")).toHaveAttribute("aria-modal", "true");
  await expect(page.locator(".drill-go")).toBeFocused();
  await expectNoAxeViolations(page);

  await page.keyboard.press("Tab");
  await expect(page.locator(".drill-close")).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.locator(".drill-go")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("#drill-overlay")).toBeHidden();
  await expect(page.locator(".drill-start")).toBeFocused();
});

test("session validation, stable IDs, and legacy progress migration", async ({ page }) => {
  await page.locator("#btn-create").click();
  await page.locator("#start-draft").click();
  await expect(page.locator(".create-error")).toContainText("Cada passo");

  await page.locator(".session-title-input").fill("Mesmo título");
  await page.locator(".step-label-input").fill("Primeiro passo");
  await page.locator("#start-draft").click();
  await page.locator(".step input").check();
  const firstProgressKey = await page.evaluate(() => Object.keys(localStorage).find((key) => key.startsWith("ressoar:done:")));

  await page.locator("#home-link").click();
  await page.locator("#btn-create").click();
  await page.locator(".session-title-input").fill("Mesmo título");
  await page.locator(".step-label-input").fill("Outro passo");
  await page.locator("#start-draft").click();
  await expect(page.locator(".progress")).toHaveText("0/1 feitos");
  await page.locator(".step input").check();
  const progressKeys = await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith("ressoar:done:")));
  expect(progressKeys).toHaveLength(2);
  expect(progressKeys).toContain(firstProgressKey);

  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem("ressoar:done:Exemplo: Glissando", '["step:0:0","step:9:9"]');
  });
  await page.locator("#home-link").click();
  await openExample(page);
  await expect(page.locator(".progress")).toHaveText("1/1 feitos");
  expect(await page.evaluate(() => localStorage.getItem("ressoar:done:example-glissando"))).toBe('["step:0:0"]');
  expect(await page.evaluate(() => localStorage.getItem("ressoar:done:Exemplo: Glissando"))).toBeNull();
});

test("downloaded sessions include an ID and invalid imports are rejected", async ({ page }) => {
  await page.locator("#btn-create").click();
  await page.locator(".session-title-input").fill("Sessão válida");
  await page.locator(".ex-title-input").fill("Aquecimento");
  await page.locator(".step-label-input").fill("Som leve");
  await page.locator(".step-duration-input").fill("10");

  const downloadPromise = page.waitForEvent("download");
  await page.locator("#download-draft").click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  const session = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  expect(session.id).toMatch(/^[a-zA-Z0-9][a-zA-Z0-9._:-]+$/);
  expect(session.exercises[0].steps[0]).toEqual({ label: "Som leve", duration: 10 });

  await page.locator("#home-link").click();
  const dialogPromise = page.waitForEvent("dialog");
  await page.locator("#file-input").setInputFiles({
    name: "invalid.ressoar.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify({
      title: "Inválida",
      exercises: [{ title: "Exercício", steps: [{ label: "Passo", duration: -1 }] }],
    })),
  });
  const dialog = await dialogPromise;
  expect(dialog.message()).toContain("número inteiro positivo");
  await dialog.dismiss();
});

test("mobile editor avoids overflow and floating-control overlap", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#btn-create").click();
  await page.locator(".step-label-input").fill("Faça um som leve e confortável.");

  const layout = await page.evaluate(() => {
    const github = document.querySelector(".github-link").getBoundingClientRect();
    const remove = document.querySelector(".remove-exercise").getBoundingClientRect();
    const overlaps = !(
      github.right <= remove.left ||
      github.left >= remove.right ||
      github.bottom <= remove.top ||
      github.top >= remove.bottom
    );
    return {
      bodyWidth: document.body.scrollWidth,
      viewportWidth: innerWidth,
      githubPosition: getComputedStyle(document.querySelector(".github-link")).position,
      overlaps,
    };
  });

  expect(layout.bodyWidth).toBe(layout.viewportWidth);
  expect(layout.githubPosition).toBe("static");
  expect(layout.overlaps).toBe(false);
});
