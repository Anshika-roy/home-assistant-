const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "tracks.json");

const SUPPORTED_DEVICES = ["phone", "laptop", "watch"];

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    // create file if missing
    await fs.access(DATA_FILE).catch(async () => {
      await fs.writeFile(DATA_FILE, JSON.stringify([]), { encoding: "utf8" });
    });
  } catch (err) {
    console.error("Failed to ensure data file:", err);
    throw err;
  }
}

async function readAll() {
  try {
    const raw = await fs.readFile(DATA_FILE, { encoding: "utf8" });
    return JSON.parse(raw || "[]");
  } catch (err) {
    console.error("readAll error:", err);
    return [];
  }
}

// atomic write: write to temp then rename
async function writeAll(data) {
  const tmp = DATA_FILE + ".tmp";
  const str = JSON.stringify(data, null, 2);
  await fs.writeFile(tmp, str, { encoding: "utf8" });
  await fs.rename(tmp, DATA_FILE);
}

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function validateTrackBody(body) {
  if (!body || typeof body !== "object") return "body must be a JSON object";
  const { deviceType, deviceId, payload, timestamp } = body;
  if (!deviceType || typeof deviceType !== "string") return "deviceType is required";
  if (!SUPPORTED_DEVICES.includes(deviceType)) return `deviceType must be one of: ${SUPPORTED_DEVICES.join(", ")}`;
  if (deviceId && typeof deviceId !== "string") return "deviceId must be a string when provided";
  if (!payload || typeof payload !== "object") return "payload (object) is required";
  if (timestamp && isNaN(Date.parse(timestamp))) return "timestamp must be an ISO date string if provided";
  return null;
}

app.post("/track", async (req, res) => {
  try {
    const err = validateTrackBody(req.body);
    if (err) return res.status(400).json({ success: false, error: err });

    await ensureDataFile();

    const stored = await readAll();

    const entry = {
      id: makeId(),
      deviceType: req.body.deviceType,
      deviceId: req.body.deviceId || null,
      payload: req.body.payload,
      receivedAt: new Date().toISOString(),
      timestamp: req.body.timestamp ? new Date(req.body.timestamp).toISOString() : null
    };

    stored.push(entry);
    await writeAll(stored);

    console.log("Stored track:", entry.id, entry.deviceType, entry.deviceId || "-");

    return res.status(201).json({ success: true, id: entry.id });
  } catch (err) {
    console.error("/track error:", err);
    return res.status(500).json({ success: false, error: "internal_server_error" });
  }
});

app.get("/data", async (req, res) => {
  try {
    await ensureDataFile();
    let all = await readAll();

    // optional filters
    const { deviceType, limit } = req.query;
    if (deviceType) {
      all = all.filter((d) => d.deviceType === deviceType);
    }
    const lim = parseInt(limit, 10);
    if (!isNaN(lim) && lim > 0) all = all.slice(-lim);

    return res.json(all);
  } catch (err) {
    console.error("/data error:", err);
    return res.status(500).json({ success: false, error: "internal_server_error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});