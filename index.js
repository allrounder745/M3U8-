const express = require("express");
const axios = require("axios");
const app = express();

app.get("/stream", async (req, res) => {
  const originalUrl = req.query.url;
  if (!originalUrl) return res.status(400).send("No M3U8 URL provided");

  try {
    const response = await axios.get(originalUrl);
    const baseUrl = originalUrl.substring(0, originalUrl.lastIndexOf("/") + 1);

    // Rewrite all relative lines
    const rewritten = response.data
      .split("\n")
      .map(line => {
        if (
          line.trim().length > 0 &&
          !line.startsWith("#") &&
          !line.startsWith("http")
        ) {
          return baseUrl + line;
        }
        return line;
      })
      .join("\n");

    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.send(rewritten);
  } catch (e) {
    res.status(500).send("Error fetching or rewriting M3U8");
  }
});

app.get("/", (req, res) => {
  res.send("✅ M3U8 Restream Server is Running!");
});

app.listen(process.env.PORT || 3000);
