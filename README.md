# PhysicalAI Project Page

> A static, dependency-free project page template inspired by academic project pages.
> Warm editorial typography, project cards, a detail page with a real↔sim comparison slider, dark mode, and GitHub Pages deployment.

---

## 0. Positioning

The home page and `/capabilities/` are written for a **full-stack embodied AI** profile:

- **Deep:** simulation, evaluation, real2sim.
- **Working:** data engine, VLA/RSI, deployment.
- **Informed:** industry, supply chain, unit economics.

Change the depth table in `capabilities/index.html` and the stack cards on the home page to match your own profile. The flagship project is SIM-EVAL; Real2Sim and the expert skill show the same loop from two other angles.

---

## 1. Preview locally

```bash
cd site
python -m http.server 8000
# open http://127.0.0.1:8000/
```

No build step. Everything is plain HTML/CSS/JS.

---

## 2. Deploy to GitHub Pages

### Option A — personal site (recommended, cleanest URL)

1. Create a public repo named `<your-username>.github.io` (for example `ShouzheLi.github.io`).
2. Copy the **contents** of this `site/` folder to the repo root.
3. Push to `main`.
4. GitHub → Settings → Pages → Build and deployment → **Deploy from a branch** → `main` / `(root)`.
5. Open `https://<your-username>.github.io/`.

### Option B — project repo, `docs/` folder

1. Copy the contents of `site/` into `docs/` in an existing repo.
2. Push to `main`.
3. Settings → Pages → **Deploy from a branch** → `main` / `/docs`.
4. Open `https://<your-username>.github.io/<repo>/`.

The template uses **relative paths**, so it works at both the domain root and a repo subpath.

### Option C — GitHub Actions

- If the site content is copied to the **repository root**, the included `.github/workflows/pages.yml` already deploys it (`path: .`).
- If you keep the `site/` folder as a **subfolder**, copy `PAGES_WORKFLOW.yml` to `.github/workflows/pages.yml` in the repo root (its `path: site` matches that layout).
- Choose either branch-based deployment or Actions, not both.

> `.nojekyll` is included so GitHub Pages does not run Jekyll over the folder.

### Custom domain

Settings → Pages → Custom domain. Add a `CNAME` file with your domain if you want it versioned.

---

## 3. Customize

| What | Where |
|---|---|
| Name, role, bio | `index.html` (hero + about) |
| Email / GitHub / links | `index.html`, project pages, footer |
| Colors, fonts, spacing | `assets/css/style.css` (`:root` variables) |
| Bilingual copy | `assets/js/i18n.js` (EN/ZH dictionaries) |
| Home project cards | `index.html` (`#work`) |
| Capabilities page | `capabilities/index.html` (six-layer stack + depth table) |
| Projects list | `projects/index.html` |
| Project detail | `projects/sim-eval-stack/index.html` (full example), `projects/real2sim/index.html` (sample), `projects/embodied-ai-expert/index.html` (skill/agent example) |
| New project | Copy `projects/_template/` → rename → edit `index.html` |
| 404 page | `404.html` |
| Social preview source | `og.html` → `assets/img/og-cover.png` |
| Hero visual | `assets/img/hero-sim.svg` (replace with a 1200×760 PNG or SVG) |
| Project thumbnails | `assets/img/project-*.svg` (replace with 1600×1000 images) |
| Real↔sim comparison | `assets/img/compare-real.svg`, `compare-sim.svg` (same dimensions and pose) |
| Demo video | `assets/video/demo.mp4` + `demo-poster.jpg` |
| Social preview | `og:image` tags (use a 1200×630 PNG; some platforms do not render SVG) |

### Add a project in 4 steps

1. `cp -r projects/_template projects/my-project`
2. Edit `projects/my-project/index.html`: title, lede, meta, abstract, stats, sections, BibTeX.
3. Replace the hero image and comparison images; add your video.
4. Add a card in `projects/index.html` (and optionally `index.html`), with `data-tags` for filtering.

### Bilingual content (EN / 中文)

The header toggle switches the site between English and Chinese. The initial language follows `localStorage` (`pa-lang`), then the browser's `navigator.languages`; `?lang=zh` or `?lang=en` overrides it once and stores the choice.

- **Home page:** fully translated. All strings live in `assets/js/i18n.js`.
- **Subpages:** the shared navigation, footer, toggle, and 404 page are translated. Page bodies remain English for now and show a small “Chinese version in progress” notice.
- **Translate a subpage:** add `data-i18n="key"` to plain text, `data-i18n-html="key"` when the value contains inline markup such as `<em>`, and `data-i18n-attr="alt:key"` / `data-i18n-attr="aria-label:key"` for attributes. Add the key to both dictionaries in `assets/js/i18n.js`.
- **Remove the notice:** when a page is fully translated, set `<body data-i18n-complete="true" ...>`.
- **Chinese line breaking:** wrap short terms that must not split with `<span class="keep">…</span>` (for example `仿真`). Avoid `white-space: nowrap` on long sentences.

### Media guidelines

- **Images**: WebP/AVIF or optimized JPG/PNG; hero ~1200–1600 px wide; thumbnails 1600×1000 (16:10); comparison images identical dimensions.
- **Video**: H.264 MP4, 1080p, `preload="none"`, poster JPG; keep under ~10–20 MB. For longer demos, host on YouTube/Bilibili and embed.
- **GitHub Pages limits**: 1 GB site size, ~100 GB/month soft bandwidth. Do not commit large raw videos; compress or host externally.
- **Alt text**: every image needs a descriptive `alt`; it is part of the page, not decoration.
- **Reduced motion**: the template respects `prefers-reduced-motion`.

---

## 4. File map

```
site/
├── index.html                    # home: hero, stats, selected work, focus, about, contact
├── projects/
│   ├── index.html                # project list + filters
│   ├── sim-eval-stack/
│   │   └── index.html            # full project detail example
│   ├── real2sim/
│   │   └── index.html            # second project example
│   ├── embodied-ai-expert/
│   │   └── index.html            # skill + agent project example
│   └── _template/
│       └── index.html            # copy this for a new project
├── capabilities/
│   └── index.html                # six-layer capability stack + depth map
├── assets/
│   ├── css/style.css             # design system + components
│   ├── js/main.js                # theme, nav, reveal, slider, carousel, copy, lightbox
│   ├── js/i18n.js                # EN/ZH dictionaries + language toggle and persistence
│   ├── img/                      # SVG visuals, og-cover.png, favicon
│   └── video/                    # demo.mp4 + demo-poster.jpg
├── .github/workflows/pages.yml   # ready-to-use Actions deploy (root layout)
├── PAGES_WORKFLOW.yml            # Actions deploy for the `site/` subfolder layout
├── 404.html                      # GitHub Pages 404
├── og.html                       # source for the 1200×630 social preview
├── .nojekyll
└── README.md
```

---

## 5. What is intentionally included

- **No framework**: no React/Vite/Tailwind build; GitHub Pages can serve it directly.
- **No external fonts/CDNs**: system font stacks keep it fast and offline-friendly.
- **Accessibility**: skip link, focus styles, `aria` labels, alt text, reduced-motion support.
- **SEO**: title, description, Open Graph, Twitter card, semantic headings.
- **Real↔sim slider**: a small JS `input[type=range]` updates a CSS variable; no library.
- **Reading progress** on detail pages; **theme toggle** and **EN/中文 toggle** persist in `localStorage`.
- **Project filters** on the listing page; cards are static HTML with `data-tags`.

---

## 6. Design attribution

The layout is original, inspired by the structure of academic project pages (including the reference page you shared: a warm editorial palette, project cards, and a detail page with evidence). No text, images, or code were copied from that page. Replace all placeholder content and assets with your own.

---

## 7. Quick checklist before publishing

- [ ] Replace name, email, GitHub, and bio.
- [ ] Replace the hero image and project thumbnails.
- [ ] Replace the demo video and poster.
- [ ] Update the depth map and stack cards to match your real profile.
- [ ] Add real project text and results; remove “sample/placeholder” notes.
- [ ] Update `og:image` to a 1200×630 PNG (the included `assets/img/og-cover.png` is a placeholder you can regenerate from `og.html`).
- [ ] Test at mobile width (≤390 px) and dark mode.
- [ ] Check every external link.
- [ ] Run `python -m http.server` and click through all pages.
- [ ] Confirm the repo is the visibility you want before pushing.
