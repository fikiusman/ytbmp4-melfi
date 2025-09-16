const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

const RAPIDAPI_HOST = "youtube-video-fast-downloader-24-7.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY; // isi di Railway (variable env)

if (!RAPIDAPI_KEY) {
  console.error("❌ RAPIDAPI_KEY belum di-set di Railway");
}

const headers = {
  "x-rapidapi-host": RAPIDAPI_HOST,
  "x-rapidapi-key": RAPIDAPI_KEY,
};

// helper proxy
async function proxy(res, url) {
  try {
    const r = await fetch(url, { headers });
    const text = await r.text();

    try {
      const json = JSON.parse(text);
      res.json(json);
    } catch {
      res.send(text); // fallback kalau bukan JSON
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// API routes
app.get("/api/get-video-info/:id", (req, res) => {
  const { id } = req.params;
  proxy(res, `https://${RAPIDAPI_HOST}/get-video-info/${id}`);
});

app.get("/api/download-video/:id", (req, res) => {
  const { id } = req.params;
  const { quality } = req.query;
  proxy(
    res,
    `https://${RAPIDAPI_HOST}/download_video/${id}${quality ? `?quality=${quality}` : ""}`
  );
});

app.get("/api/download-short/:id", (req, res) => {
  const { id } = req.params;
  const { quality } = req.query;
  proxy(
    res,
    `https://${RAPIDAPI_HOST}/download_short/${id}${quality ? `?quality=${quality}` : ""}`
  );
});

// health check
app.get("/", (req, res) => res.send("✅ Melfi MP4 backend aktif 🚀"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
