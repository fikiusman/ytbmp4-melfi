const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

// Konfigurasi RapidAPI
const RAPIDAPI_HOST = "youtube-video-fast-downloader-24-7.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY; // wajib isi di Railway

if (!RAPIDAPI_KEY) {
  console.error("❌ RAPIDAPI_KEY belum di-set di Railway!");
}

// Header default
const headers = {
  "X-RapidAPI-Host": RAPIDAPI_HOST,
  "X-RapidAPI-Key": RAPIDAPI_KEY,
};

// Helper proxy untuk request ke RapidAPI
async function proxy(res, url) {
  try {
    const r = await fetch(url, { headers });
    const text = await r.text();

    // coba parse JSON, kalau gagal berarti text biasa
    try {
      const json = JSON.parse(text);
      res.json(json);
    } catch {
      res.type(r.headers.get("content-type") || "application/json");
      res.send(text);
    }
  } catch (err) {
    console.error("❌ Error proxy:", err.message);
    res.status(500).json({ error: err.message });
  }
}

// Endpoint: ambil info video
app.get("/api/get-video-info/:id", (req, res) => {
  const { id } = req.params;
  const url = `https://${RAPIDAPI_HOST}/get-video-info/${id}`;
  proxy(res, url);
});

// Endpoint: download video
app.get("/api/download-video/:id", (req, res) => {
  const { id } = req.params;
  const { quality } = req.query;
  const url = `https://${RAPIDAPI_HOST}/download_video/${id}${
    quality ? `?quality=${quality}` : ""
  }`;
  proxy(res, url);
});

// Endpoint: download short
app.get("/api/download-short/:id", (req, res) => {
  const { id } = req.params;
  const { quality } = req.query;
  const url = `https://${RAPIDAPI_HOST}/download_short/${id}${
    quality ? `?quality=${quality}` : ""
  }`;
  proxy(res, url);
});

// Health check
app.get("/", (req, res) => res.send("✅ Melfi MP4 backend aktif 🚀"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
