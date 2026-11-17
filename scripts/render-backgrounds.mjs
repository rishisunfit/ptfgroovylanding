import { spawn } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HTML = path.join(ROOT, "scripts", "shader-plate.html");
const OUT_DIR = path.join(ROOT, "renders");
const CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const VARIANTS = ["warm", "mono", "twilight", "coffee", "royal"];
const SECONDS = 8;
const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;
const PORT = 9333;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.nextId = 0;
    this.pending = new Map();
    ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (!message.id || !this.pending.has(message.id)) return;
      const { resolve, reject } = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    });
  }

  send(method, params = {}) {
    const id = ++this.nextId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
}

async function openSocket(url) {
  const ws = new WebSocket(url);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });
  return new Cdp(ws);
}

async function connectBrowser() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (response.ok) {
        const info = await response.json();
        return openSocket(info.webSocketDebuggerUrl);
      }
    } catch {
      // Chrome is still starting.
    }
    await sleep(100);
  }
  throw new Error("Chrome did not open a debugging port");
}

async function pageSocket() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const list = await fetch(`http://127.0.0.1:${PORT}/json/list`).then((res) =>
      res.json(),
    );
    const page = list.find((target) => target.type === "page");
    if (page?.webSocketDebuggerUrl) return openSocket(page.webSocketDebuggerUrl);
    await sleep(100);
  }
  throw new Error("Chrome did not open a page");
}

function encodeVariant(variant) {
  const output = path.join(OUT_DIR, `background-${variant}.mp4`);
  const ffmpeg = spawn(
    "ffmpeg",
    [
      "-y",
      "-loglevel",
      "error",
      "-f",
      "image2pipe",
      "-vcodec",
      "mjpeg",
      "-framerate",
      String(FPS),
      "-i",
      "pipe:0",
      "-an",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-crf",
      "17",
      "-preset",
      "fast",
      "-movflags",
      "+faststart",
      output,
    ],
    { stdio: ["pipe", "inherit", "inherit"] },
  );

  const done = new Promise((resolve, reject) => {
    ffmpeg.on("error", reject);
    ffmpeg.on("close", (code) => {
      if (code === 0) resolve(output);
      else reject(new Error(`ffmpeg exited ${code} for ${variant}`));
    });
  });

  return { ffmpeg, done, output };
}

async function evaluate(page, expression) {
  const result = await page.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || "page script failed");
  }
  return result.result?.value;
}

const userData = path.join(tmpdir(), `shader-render-${process.pid}`);
await rm(userData, { recursive: true, force: true });
await mkdir(OUT_DIR, { recursive: true });

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${userData}`,
    `--window-size=${WIDTH},${HEIGHT}`,
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--force-color-profile=srgb",
    "--allow-file-access-from-files",
    "--disable-background-timer-throttling",
    "about:blank",
  ],
  { stdio: "ignore" },
);

try {
  await connectBrowser();
  const page = await pageSocket();
  await page.send("Page.enable");
  await page.send("Runtime.enable");
  await page.send("Emulation.setDeviceMetricsOverride", {
    width: WIDTH,
    height: HEIGHT,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await page.send("Page.navigate", { url: pathToFileURL(HTML).href });
  await sleep(400);

  const status = await evaluate(page, "window.shaderStatus || 'missing'");
  if (status !== "ok") throw new Error(`WebGL status: ${status}`);

  const frames = SECONDS * FPS;
  for (const variant of VARIANTS) {
    await evaluate(page, `window.setVariant(${JSON.stringify(variant)})`);
    const { ffmpeg, done } = encodeVariant(variant);
    console.log(`rendering ${variant} (${frames} frames)`);

    for (let frame = 0; frame < frames; frame += 1) {
      await evaluate(page, `window.draw(${frame / FPS})`);
      const shot = await page.send("Page.captureScreenshot", {
        format: "jpeg",
        quality: 92,
        fromSurface: true,
        clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT, scale: 1 },
      });
      if (!ffmpeg.stdin.write(Buffer.from(shot.data, "base64"))) {
        await new Promise((resolve) => ffmpeg.stdin.once("drain", resolve));
      }
      if (frame > 0 && frame % FPS === 0) {
        console.log(`  ${variant} ${frame / FPS}s`);
      }
    }

    ffmpeg.stdin.end();
    const output = await done;
    console.log(`wrote ${output}`);
  }
} finally {
  chrome.kill("SIGKILL");
  await rm(userData, { recursive: true, force: true });
}
