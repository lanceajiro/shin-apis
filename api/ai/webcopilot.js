const axios = require("axios");

const meta = {
  name: 'WebPilot',
  path: '/webpilot?q=',
  method: 'get',
  category: 'AI'
};

class WebPilotAPI {
  constructor() {
    this.url = "https://api.webpilotai.com/rupee/v1/search";
    this.config = {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: "Bearer null",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
        Referer: "https://www.webpilot.ai/search?lang=en-US&threadId=1bc910c4-4e48-4461-8dbc-937c67996dce"
      }
    };
  }

  async fetchData(prompt) {
    const data = { q: prompt, threadId: "" };
    const response = await axios.post(this.url, data, this.config);
    return this.parseRes(response.data);
  }

  parseRes(output) {
    return output
      .split("\n")
      .filter(line => line.startsWith("data:"))
      .map(line => {
        try {
          return JSON.parse(line.slice(5)).data.content || "";
        } catch {
          return "";
        }
      })
      .join("");
  }
}

async function onStart({ req, res }) {
  try {
    const prompt = req.query.q;
    if (!prompt) return res.status(400).json({ error: "Missing query parameter 'q'" });

    const wp = new WebPilotAPI();
    const result = await wp.fetchData(prompt);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { meta, onStart, WebPilotAPI };