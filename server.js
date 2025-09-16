// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const RAPID_HOST = "youtube-video-fast-downloader-24-7.p.rapidapi.com";
const RAPID_KEY = "f96b9e6ba0mshdda6ccf6b9794e0p1f90e5jsn6ef74c7af6b1";

// 🔹 ambil detail video
app.get("/api/get-video-info/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const r = await fetch(`https://${RAPID_HOST}/get-video-info/${id}`, {
      headers: {
        "x-rapidapi-host": RAPID_HOST,
        "x-rapidapi-key": RAPID_KEY,
      },
    });
    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 download video dengan judul sesuai
app.get("/api/download-video/:id", async (req, res) => {
  const { id } = req.params;
  const quality = req.query.quality || "18"; // default MP4 360p biar playable

  try {
    // ambil info dulu buat dapet judul
    const infoRes = await fetch(`https://${RAPID_HOST}/get-video-info/${id}`, {
      headers: {
        "x-rapidapi-host": RAPID_HOST,
        "x-rapidapi-key": RAPID_KEY,
      },
    });
    const info = await infoRes.json();
    const title = (info.title || "video").replace(/[^\w\s-]/g, "").replace(/\s+/g, "_");

    // ambil link download
    const dlRes = await fetch(`https://${RAPID_HOST}/download_video/${id}?quality=${quality}`, {
      headers: {
        "x-rapidapi-host": RAPID_HOST,
        "x-rapidapi-key": RAPID_KEY,
      },
    });
    const dlJson = await dlRes.json();
    const url = dlJson.url || dlJson.downloadUrl || dlJson.result?.url;

    if (!url) return res.status(400).json({ error: "Download URL not found" });

    // stream video ke user dengan nama sesuai judul
    const fileRes = await fetch(url);
    res.setHeader("Content-Disposition", `attachment; filename="${title}.mp4"`);
    res.setHeader("Content-Type", "video/mp4");

    fileRes.body.pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 download shorts
app.get("/api/download-short/:id", async (req, res) => {
  const { id } = req.params;
  const quality = req.query.quality || "18";

  try {
    const infoRes = await fetch(`https://${RAPID_HOST}/get-video-info/${id}`, {
      headers: {
        "x-rapidapi-host": RAPID_HOST,
        "x-rapidapi-key": RAPID_KEY,
      },
    });
    const info = await infoRes.json();
    const title = (info.title || "short").replace(/[^\w\s-]/g, "").replace(/\s+/g, "_");

    const dlRes = await fetch(`https://${RAPID_HOST}/download_short/${id}?quality=${quality}`, {
      headers: {
        "x-rapidapi-host": RAPID_HOST,
        "x-rapidapi-key": RAPID_KEY,
      },
    });
    const dlJson = await dlRes.json();
    const url = dlJson.url || dlJson.downloadUrl || dlJson.result?.url;

    if (!url) return res.status(400).json({ error: "Download URL not found" });

    const fileRes = await fetch(url);
    res.setHeader("Content-Disposition", `attachment; filename="${title}.mp4"`);
    res.setHeader("Content-Type", "video/mp4");

    fileRes.body.pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
