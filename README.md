# Shouzhe Li · embodied AI capability archive

Static site. No framework, no build step at deploy time. The content model lives in `content/`; the pages under `evidence/` and `radar/` are generated from it.

## Structure

```
index.html               Home: hero, 3x3 capability grid, latest evidence, latest radar, gaps, method
capabilities/index.html  Full 9-layer x 4-dimension matrix, ratings, gaps, upgrade rules
evidence/index.html      Generated from content/evidence/*.md
radar/index.html         Generated from content/radar/*.md
projects/                Three case pages: problem, approach, evidence, boundary
content/facts.json       Single source for every number shown on the site
content/ratings.json     The 9x4 frame: level, evidence ids, review date, gap plan
content/evidence/*.md    One file per evidence entry
content/radar/*.md       One file per radar signal
scripts/build_pages.py   Regenerates the two list pages and the home blocks
scripts/check_site.py    Read-only checks: links, fields, facts expiry, radar freshness, i18n parity, chrome
assets/                  CSS, JS, fonts, images
```

## Build and check

```bash
python scripts/build_pages.py
python scripts/check_site.py
```

`build_pages.py` is idempotent: running it twice changes nothing. It only touches `evidence/index.html`, `radar/index.html`, and the marked blocks in `index.html` (`<!-- @STATS -->`, `<!-- @LATEST_EVIDENCE -->`, `<!-- @LATEST_RADAR -->`). Hand edits outside those blocks are safe.

Preview:

```bash
python -m http.server 8000
# http://127.0.0.1:8000/
```

Links are root-absolute because the site is served from the domain root. Preview through a local server, not `file://`.

## Add an evidence entry (about 10 minutes)

1. Copy an existing file in `content/evidence/` and rename it `E-YYYY-MM-DD-NN.md`.
2. Fill every field:

```
id: E-YYYY-MM-DD-NN
layer: L07
dimension: eval
status: measured        # measured | documented | method | gap
date: YYYY-MM-DD
title_en / title_zh
summary_en / summary_zh
question / method / result
condition / boundary / source
```

3. `status: measured` requires both `condition` and `boundary`; the checker enforces it.
4. Run `python scripts/build_pages.py && python scripts/check_site.py`.
5. Commit.

## Add a radar signal (about 5 minutes)

Copy a file in `content/radar/`, rename to `R-YYYY-MM-DD-NN.md`, and fill `date`, `title_en`, `title_zh`, `fact`, `judgment`, `confidence`, `affects_layer`, `action`. Every signal must end with an action; the checker warns when the newest signal is older than 21 days.

## Change a rating

Ratings live in `content/ratings.json`. Upgrades follow the gates shown on `/capabilities/`:

- 0 → 1: one `documented` or `method` entry
- 1 → 2: two entries, at least one `documented`, with a boundary
- 2 → 3: three entries, at least one `measured`, no open counterexample

Downgrades are not deletions: mark the cell `review-due` and keep the history.

## Numbers

Every number shown on the site belongs in `content/facts.json` with `date`, `condition`, `source` and `expires`. The checker fails when a fact is past its expiry. Never hand-write a number into a page without adding it there.

## Language

Content is dual-DOM: `<span class="t-en">…</span><span class="t-zh">…</span>`. CSS hides the inactive language, so both are readable with JavaScript disabled. `assets/js/i18n.js` only stores the choice and flips `data-lang`.

Generated entries carry bilingual titles and summaries; the detailed fields (question, method, result, condition, boundary, source) are English.

## Visual system

Base `#f4f4f4`, ink `#1a1a1a`, accent `#1e3569`; display 64px/1.02/-0.02em; section titles 38px; container 1352px. Fonts: Geist Sans and Geist Mono (OFL) self-hosted from `assets/fonts/`.

## Deploy

Push to `main`; the Pages workflow in `.github/workflows` deploys the repository root. Nothing is generated during deploy — commit the generated HTML.

## Backup

The pre-redesign version is preserved on branch `backup/pre-redesign-2026-11-10` and tag `pre-redesign-2026-11-10`.

## Pending

- Real hero video (8s loop, <4MB). Until then the hero uses `assets/img/hero-poster.svg` with a labelled slot.
- A real contact address; the current page points to GitHub only.
