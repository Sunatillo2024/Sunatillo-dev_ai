# Sunatillo-dev_ai — Backend Engineer Portfolio

Static portfolio deployed on GitHub Pages as a **project site**:

`https://sunatillo2024.github.io/Sunatillo-dev_ai/`

## How paths work

The site is served from the `/Sunatillo-dev_ai/` subpath, never from the domain root, so no
internal URL is hard-coded to `/`.

- `index.html` and `projects/<slug>/index.html` reference CSS, JS and the favicon with
  **document-relative** paths (`assets/…`, `../../assets/…`), which resolve correctly under any
  prefix, including a local server at `/`.
- `assets/app.js` derives the site base from its own module URL
  (`new URL("../", import.meta.url)`) and builds every internal link and image with `siteUrl()`.
  Image paths in `project-data.js` are stored relative to the site root
  (`assets/images/projects/<slug>.png`) and resolved through the same helper; external `http(s)`,
  `data:` and `mailto:` URLs are passed through untouched.
- Routing uses one real HTML file per project (`projects/<slug>/index.html`), so direct links and
  refreshes are handled by GitHub Pages itself. `404.html` resolves the deploy base at runtime and
  forwards unknown URLs to `?path=<original url>`, which `app.js` maps back to the right case study.

## Adding a project

1. Add the entry to `assets/project-data.js` (with a unique `slug`) and its translations to
   `assets/i18n.js` for `ru`, `uz` and `en`.
2. Add the cover image to `assets/images/projects/<slug>.png`.
3. Copy any existing `projects/<slug>/index.html` to `projects/<new-slug>/index.html` — the file is
   the same for every project; the case study is selected from the URL.

## Local development

ES modules need HTTP, so serve the repository instead of opening the file directly:

```bash
python3 -m http.server 8000
# http://localhost:8000/
```

## Deployment

1. Push this repository's `main` branch to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment → Source**, select **Deploy from a branch** → `main` → `/ (root)`.
4. Wait for the deployment to finish and open the site URL above.
