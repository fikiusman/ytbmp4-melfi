const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

const RAPIDAPI_HOST = "youtube-video-fast-downloader-24-7.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY; // set di Railway

if (!RAPIDAPI_KEY) {
  console.error("❌ RAPIDAPI_KEY belum di-set di Railway");
}

const headers = {
  "x-rapidapi-host": RAPIDAPI_HOST,
  "x-rapidapi-key": RAPIDAPI_KEY,
};

// proxy helper
async function proxy(res, url) {
  try {
    const r = await fetch(url, { headers });
    const data = await r.text();
    res.type(r.headers.get("content-type") || "application/json");
    res.send(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get video info
app.get("/api/get-video-info/:id", (req, res) => {
  const { id } = req.params;
  proxy(res, `https://${RAPIDAPI_HOST}/get-video-info/${id}`);
});

// Download video
app.get("/api/download-video/:id", (req, res) => {
  const { id } = req.params;
  const { quality } = req.query;
  proxy(
    res,
    `https://${RAPIDAPI_HOST}/download_video/${id}${
      quality ? `?quality=${quality}` : ""
    }`
  );
});

// Download short
app.get("/api/download-short/:id", (req, res) => {
  const { id } = req.params;
  const { quality } = req.query;
  proxy(
    res,
    `https://${RAPIDAPI_HOST}/download_short/${id}${
      quality ? `?quality=${quality}` : ""
    }`
  );
});

// health
app.get("/", (req, res) => res.send("Melfi MP4 backend aktif 🚀"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
