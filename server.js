const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

const RAPIDAPI_HOST = "youtube-video-fast-downloader-24-7.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "f96b9e6ba0mshdda6ccf6b9794e0p1f90e5jsn6ef74c7af6b1"; // pakai ENV di Railway

if (!RAPIDAPI_KEY) {
  console.error("❌ RAPIDAPI_KEY belum di-set di Railway");
}

const headers = {
  "x-rapidapi-host": RAPIDAPI_HOST,
  "x-rapidapi-key": RAPIDAPI_KEY,
};

// 🔹 Helper fetch ke RapidAPI
async function proxy(res, url) {
  try {
    const r = await fetch(url, { headers });
    const contentType = r.headers.get("content-type") || "";
    const text = await r.text();

    // Kalau JSON, parse → kirim JSON
    if (contentType.includes("application/json")) {
      res.json(JSON.parse(text));
    } else {
      // Kalau bukan JSON (misal URL langsung), kirim raw text
      res.send(text);
    }
  } catch (err) {
    console.error("❌ Proxy error:", err.message);
    res.status(500).json({ error: err.message });
  }
}

// 🔹 Get video detail (title, qualities, dll)
app.get("/api/get-video-info/:id", (req, res) => {
  const { id } = req.params;
  proxy(res, `https://${RAPIDAPI_HOST}/get-video-info/${id}`);
});

// 🔹 Get video download link
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

// 🔹 Get short download link
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

// 🔹 Health check
app.get("/", (req, res) => res.send("🚀 Melfi MP4 backend aktif dengan RapidAPI terbaru"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
