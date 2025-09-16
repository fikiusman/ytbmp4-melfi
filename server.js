import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const RAPIDAPI_HOST = "youtube-video-fast-downloader-24-7.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY; // simpan di Railway Variables

// ✅ Ambil info lengkap video (judul, author, formats, dll)
app.get("/api/get-video-info/:id", async (req, res) => {
  try {
    const videoId = req.params.id;

    const r = await fetch(
      `https://${RAPIDAPI_HOST}/get_video_details_and_quality/${videoId}`,
      {
        headers: {
          "x-rapidapi-host": RAPIDAPI_HOST,
          "x-rapidapi-key": RAPIDAPI_KEY,
        },
      }
    );

    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Endpoint untuk ambil link download by quality
app.get("/api/download-video/:id", async (req, res) => {
  try {
    const videoId = req.params.id;
    const quality = req.query.quality || "360p";

    const r = await fetch(
      `https://${RAPIDAPI_HOST}/download_video/${videoId}?quality=${quality}`,
      {
        headers: {
          "x-rapidapi-host": RAPIDAPI_HOST,
          "x-rapidapi-key": RAPIDAPI_KEY,
        },
      }
    );

    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
