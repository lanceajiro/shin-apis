# Shin API UI — README.md

> Interactive REST API documentation + sandbox UI for simple, file-based API endpoints.
> **Live demo:** [https://shin-apis.onrender.com/](https://shin-apis.onrender.com/)

Shin API UI is a lightweight interface for documenting and exposing small REST endpoints as individual `.js` files under an `api/` folder. It’s inspired by and built on top of Rynn’s simple API UI approach [https://github.com/rynn-k/Rynn-UI](https://github.com/rynn-k/Rynn-UI) — special thanks to rynn-k for the original project.

# Table of contents

* About
* Features
* Quick start
* `settings.js` — configuration (example + field reference)
* Adding a new API (file format / template)
* Example: `lyrics` (full example file)
* How to call / test an endpoint (live example)
* Response format conventions
* Deploying
* Contributing & credits
* License

# About

Shin API UI provides a readable web interface and a small REST server that serves API files placed in the `api/` folder. Each API file exports a `meta` object (for the UI) and an `onStart` function that handles incoming requests. The UI reads `settings.js` at runtime to build the documentation page and header.

# Features

* Drop-in API files (each file is a self-contained endpoint)
* Simple `meta` object used by the UI to describe the endpoint
* Standardized JSON response patterns (success, 400, 404, 500)
* Customizable `settings.js` for branding, links, and notifications
* Ready to deploy to Vercel / Render / any Node host
* Live demo available: [https://shin-apis.onrender.com/](https://shin-apis.onrender.com/)

# Quick start

1. Clone the repo:

```bash
git clone https://github.com/ajirodesu/Shin-API-UI.git
cd Shin-API-UI
```

2. Install dependencies:

```bash
npm install
```

3. Edit `settings.js` to configure the UI (see the settings section below).

4. Add your API files into the `api/` folder (see templates below).

5. Start the server locally:

```bash
npm start
# or
node index.js
```

# `settings.js` — configuration

Example `settings.js` (the one you provided):

```js
module.exports = {
    name: 'Shin APIs',
    description: 'This interactive interface allows you to explore and test our comprehensive collection of API endpoints in real-time.',
    icon: '/docs/image/icon.png',
    author: 'ShinDesu',
    telegram: 'https://t.me/+AQO22J2q6KBlNWM1',
    notification: [ 
        {
            title: 'New API Added',
            message: 'Blue Achieve and Loli API have been added to the documentation.',
        },
        {
            title: 'System Update',
            message: 'The API documentation system has been updated to version 0.0.2'
        }
    ]
};
```

**Field reference**

* `name` — Display name for the UI.
* `description` — Short description shown in header/home.
* `icon` — Path or URL to an icon used in the UI.
* `author` — Your name / project owner.
* `telegram` — Contact / support link (optional).
* `notification` — Array of notification objects `{ title, message }` shown in UI (optional).

# Adding a new API

Each endpoint file goes in the `api/` directory and must export:

* `meta` — endpoint metadata used by the UI (name, desc, method, category, guide, params).
* `onStart` — async function `onStart({ req, res })` that receives the Node/Express `req` and `res`.

**Minimal empty template** (safe scaffold — the "API format is empty" as requested):

```js
// api/template.js
const meta = {
  name: '',         // e.g. 'myapi'
  desc: '',         // short description
  method: 'get',
  category: 'general',
  guide: {},        // { paramName: 'description' }
  params: []        // ['param1', 'param2']
};

async function onStart({ req, res }) {
  // TODO: implement your endpoint logic
  // Example: return 501 not implemented for template
  return res.status(501).json({
    error: 'Not implemented'
  });
}

module.exports = { meta, onStart };
```

Copy the template, rename it to your endpoint (e.g. `myapi.js`) and implement `meta` + `onStart`.

# Example: `lyrics.js` (updated — no timestamps, no `powered_by`)

This is the example endpoint you gave — modified so responses do **not** include `timestamp` or `powered_by`.

```js
// api/lyrics.js
const meta = {
  name: 'lyrics',
  desc: 'retrieves lyrics for a specified song and artist',
  method: 'get',
  category: 'search',
  guide: {
    artist: 'The artist of the song',
    song: 'The title of the song',
  },
  params: ['artist', 'song']
};

async function onStart({ req, res }) {
  const { artist, song } = req.query;

  if (!artist || !song) {
    return res.status(400).json({
      error: 'Missing required parameters: artist and song'
    });
  }

  try {
    const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(song)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.lyrics) {
      return res.json({
        lyrics: data.lyrics
      });
    } else {
      return res.status(404).json({
        error: 'Lyrics not found'
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
}

module.exports = { meta, onStart };
```

# How to call / test an endpoint (live example)

**Local pattern**

```
GET http://localhost:<PORT>/<category>/<endpoint>?param1=value1&param2=value2
```

**Live example (public):**

```
GET https://shin-apis.onrender.com/search/lyrics?artist=Adele&song=Hello
```

**curl example (live):**

```bash
curl "https://shin-apis.onrender.com/api/lyrics?artist=Adele&song=Hello"
```

**Example responses (note: no timestamps/powered_by):**

* **Success (200)**

```json
{
  "lyrics": "Hello, it's me..."
}
```

* **Bad request (400)** (missing required params)

```json
{
  "error": "Missing required parameters: artist and song"
}
```

* **Not found (404)**

```json
{
  "error": "Lyrics not found"
}
```

* **Server error (500)**

```json
{
  "error": "Internal server error"
}
```

# Response format conventions & best practices

* Use proper HTTP codes (200, 400, 404, 500).
* Keep JSON payloads concise and consistent — avoid including timestamps or internal attribution (unless you want them).
* Clearly document required/optional params in `meta.guide`.
* For endpoints that call slow external services, consider caching and/or rate-limiting.

# Deploying

* The repo is compatible with Vercel, Render, and other Node hosts.
* For the public demo, see: [https://shin-apis.onrender.com/](https://shin-apis.onrender.com/)
* On hosts like Render or Vercel, simply connect the GitHub repo and follow their deployment flow. Ensure the entry script (e.g. `index.js`) and `start` script in `package.json` are correct.

# Contributing & credits

This project is based on Rynn’s REST API UI design — **special thanks to [https://github.com/rynn-k](https://github.com/rynn-k)** for the original project that served as the base. The repository `Shin-API-UI` is an adaptation and extension by `ajirodesu`.

If you want to contribute:

1. Fork the repo.
2. Add your API file(s) to `/api`.
3. Open a pull request with a short description of the endpoint(s) you added.

# License

This project is MIT licensed (see the `LICENSE` file in the repo).

---