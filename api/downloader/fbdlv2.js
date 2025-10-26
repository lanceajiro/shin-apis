const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");

const meta = {
  name: "Facebook Downloader V2",
  desc: "Extract downloadable links and metadata from a Facebook video URL using saveas.co",
  method: "get",
  category: "downloader",
  guide: {
    url: "Direct Facebook video URL to extract download links from",
  },
  params: ["url"],
};

async function asu(url) {
  try {
    const payload = qs.stringify({ fb_url: url });
    const res = await axios.post(
      "https://saveas.co/smart_download.php",
      payload,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0",
        },
        timeout: 15000,
      }
    );

    const $ = cheerio.load(res.data);
    const thumb = $(".box img").attr("src") || null;
    const title = $(".box .info h2").text().trim() || null;
    const desc =
      $(".box .info p").first().text().replace("Description:", "").trim() ||
      null;
    const duration =
      $(".box .info p").last().text().replace("Duration:", "").trim() || null;
    const sd = $("#sdLink").attr("href") || null;
    const hd = $("#hdLink").attr("href") || null;

    return { title, desc, duration, thumb, sd, hd };
  } catch (e) {
    return { status: "error", message: e.message || String(e) };
  }
}

async function onStart({ req, res }) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      error: "Missing required parameter: url",
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const result = await asu(url);

    if (result?.status === "error") {
      return res.status(500).json({
        error: result.message || "Failed to extract data",
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(200).json({
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message || "Internal server error",
      timestamp: new Date().toISOString(),
    });
  }
}

module.exports = { meta, onStart };
