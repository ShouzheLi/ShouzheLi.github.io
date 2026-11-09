#!/usr/bin/env python3
"""Build evidence/radar list pages and refresh home page blocks.

Usage: python scripts/build_pages.py
Idempotent. Every filesystem access is resolved and confined to the site root.
"""
import json
import re
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
CONTENT = BASE / "content"

NAV = [
    ("home", "/index.html", "Home", "首页"),
    ("capabilities", "/capabilities/index.html", "Capabilities", "能力"),
    ("projects", "/projects/index.html", "Projects", "项目"),
    ("record", "/record/index.html", "Record", "记录"),
    ("radar", "/radar/index.html", "Radar", "雷达"),
]

HEADER = """<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="/index.html">
      <span class="brand-mark">SL</span>
      <span class="brand-text">Shouzhe Li<small><span class="t-en">EMBODIED AI · FULL STACK</span><span class="t-zh">具身智能 · 全栈</span></small></span>
    </a>
    <nav class="nav" aria-label="Primary">
{links}
    </nav>
    <div class="header-actions">
      <div class="lang-toggle" role="group" aria-label="Switch language">
        <button type="button" data-lang-option="en" aria-pressed="true" lang="en">EN</button>
        <button type="button" data-lang-option="zh" aria-pressed="false" lang="zh-CN">中文</button>
      </div>
      <button class="icon-btn theme-toggle" type="button" aria-label="Toggle color theme">
        <svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
        <svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/></svg>
      </button>
      <button class="icon-btn menu-btn" type="button" aria-label="Menu" aria-expanded="false">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
    </div>
  </div>
</header>"""

FOOTER = """<footer class="site-footer">
  <div class="wrap footer-inner">
    <div class="footer-brand">
      <span class="brand-mark" aria-hidden="true">SL</span>
      <span>&copy; <span data-year>2026</span> Shouzhe Li.</span>
    </div>
    <div class="footer-links">
      <a href="/capabilities/index.html"><span class="t-en">Capabilities</span><span class="t-zh">能力</span></a>
      <a href="/projects/index.html"><span class="t-en">Projects</span><span class="t-zh">项目</span></a>
      <a href="/record/index.html"><span class="t-en">Record</span><span class="t-zh">记录</span></a>
      <a href="/radar/index.html"><span class="t-en">Radar</span><span class="t-zh">雷达</span></a>
      <a href="https://github.com/ShouzheLi" target="_blank" rel="noopener">GitHub</a>
    </div>
  </div>
</footer>"""


def resolve(path):
    real = Path(path).resolve()
    if BASE not in real.parents and real != BASE:
        raise SystemExit("refusing to access a path outside the site root")
    return real


def read_text(path):
    return resolve(path).read_text(encoding="utf-8")


def write_if_changed(path, text):
    real = resolve(path)
    if real.exists() and real.read_text(encoding="utf-8") == text:
        return False
    real.write_text(text, encoding="utf-8", newline="\n")
    return True


def header(active):
    links = []
    for pid, href, en, zh in NAV:
        current = ' aria-current="page"' if pid == active else ""
        links.append(f'      <a href="{href}"{current}><span class="t-en">{en}</span><span class="t-zh">{zh}</span></a>')
    return HEADER.format(links="\n".join(links))


def dual(en, zh, tag="span"):
    return f'<{tag} class="t-en">{en}</{tag}><{tag} class="t-zh">{zh}</{tag}>'


def parse_entry(path):
    data = {}
    for line in read_text(path).splitlines():
        if not line.strip() or line.lstrip().startswith("#") or ":" not in line:
            continue
        key, value = line.split(":", 1)
        data[key.strip()] = value.strip()
    return data


def load(folder_name, prefix):
    entries = []
    folder = resolve(CONTENT / folder_name)
    if not folder.is_dir():
        return entries
    for path in sorted(folder.iterdir()):
        if path.suffix != ".md" or not path.is_file():
            continue
        entry = parse_entry(path)
        if entry.get("id", "").startswith(prefix):
            entries.append(entry)
    entries.sort(key=lambda e: (e.get("date", ""), e.get("id", "")), reverse=True)
    return entries


def load_json(name):
    if Path(name).name != name:
        raise SystemExit("invalid content file name")
    return json.loads(read_text(CONTENT / name))


def badge(status):
    return f'<span class="badge badge--{status}">{status.upper()}</span>'


def evidence_card(entry, index, layers):
    layer = layers.get(entry.get("layer", ""), {})
    label = f'{entry.get("layer","")} {layer.get("name_en","")}'
    tags = f'{entry.get("layer","")} {entry.get("dimension","")} {entry.get("status","")}'
    return f"""        <article class="entry reveal" id="{entry.get('id','')}" data-tags="{tags}">
          <div class="entry-no">{index:02d}</div>
          <div class="entry-main">
            <div class="entry-meta">{badge(entry.get("status","method"))}<span>{entry.get("date","")}</span><span>{label} · {entry.get("dimension","")}</span></div>
            <h3 class="entry-title">{dual(entry.get("title_en",""), entry.get("title_zh",""))}</h3>
            <p class="entry-sum">{dual(entry.get("summary_en",""), entry.get("summary_zh",""))}</p>
            <dl class="entry-fields">
              <dt>Condition</dt><dd>{entry.get("condition","")}</dd>
              <dt>Boundary</dt><dd>{entry.get("boundary","")}</dd>
              <dt>Source</dt><dd><code>{entry.get("source","")}</code></dd>
            </dl>
            <details class="entry-detail">
              <summary><span class="t-en">Method and result</span><span class="t-zh">做法与结果</span></summary>
              <p><strong>Q</strong> {entry.get("question","")}</p>
              <p><strong>M</strong> {entry.get("method","")}</p>
              <p><strong>R</strong> {entry.get("result","")}</p>
            </details>
          </div>
        </article>"""


def radar_card(entry, index, layers):
    layer = layers.get(entry.get("affects_layer", ""), {})
    label = f'{entry.get("affects_layer","")} {layer.get("name_en","")}'
    return f"""        <article class="entry reveal" id="{entry.get('id','')}" data-tags="{entry.get("affects_layer","")} {entry.get("confidence","")}">
          <div class="entry-no">{index:02d}</div>
          <div class="entry-main">
            <div class="entry-meta"><span class="badge badge--conf">{entry.get("confidence","")}</span><span>{entry.get("date","")}</span><span>{label}</span></div>
            <h3 class="entry-title">{dual(entry.get("title_en",""), entry.get("title_zh",""))}</h3>
            <p class="entry-sum"><strong class="k">Fact</strong> {entry.get("fact","")}</p>
            <p class="entry-sum"><strong class="k">Judgment</strong> {entry.get("judgment","")}</p>
            <p class="entry-action"><strong class="k">Action</strong> {entry.get("action","")}</p>
          </div>
        </article>"""


def shell(title, active, body, desc):
    return f"""<!DOCTYPE html>
<html lang="en" data-theme="light" data-lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <meta name="color-scheme" content="light dark">
  <link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg">
  <link rel="stylesheet" href="/assets/css/style.css">
  <noscript><style>.reveal{{opacity:1;transform:none}}</style></noscript>
</head>
<body data-page="{active}">
  <a class="skip-link" href="#main">Skip to content</a>
  {header(active)}
  <main id="main">
{body}
  </main>
  {FOOTER}
  <script src="/assets/js/i18n.js"></script>
  <script src="/assets/js/main.js"></script>
</body>
</html>
"""


def build_lists():
    ratings = load_json("ratings.json")
    layers = {layer["id"]: layer for layer in ratings["layers"]}
    evidence = load("evidence", "E-")
    radar = load("radar", "R-")
    changed = []

    filters = ['<button class="filter is-active" type="button" data-filter="all">All</button>']
    for layer in ratings["layers"]:
        filters.append(f'<button class="filter" type="button" data-filter="{layer["id"]}">'
                       f'{layer["id"]} {dual(layer["name_en"], layer["name_zh"])}</button>')
    filter_html = "\n          ".join(filters)

    ev_cards = "\n".join(evidence_card(e, i + 1, layers) for i, e in enumerate(evidence))
    ev_body = f"""    <section class="list-hero">
      <div class="wrap">
        <p class="eyebrow">{dual("Record", "记录")}</p>
        <h1 class="display">{dual("Records with a status, a condition and a boundary.", "带状态、条件与边界的记录。")}</h1>
        <p class="lede">{dual(f"{len(evidence)} entries. Measured means a number with a condition; method means a procedure, not a result.", f"共 {len(evidence)} 条。实测 = 有数字且有条件；方法 = 是流程，不是结果。")}</p>
        <div class="filters" role="group" aria-label="Filter by layer">
          {filter_html}
        </div>
      </div>
    </section>
    <section class="section section-flush"><div class="wrap"><div class="entry-list">
{ev_cards}
    </div></div></section>"""
    changed.append(write_if_changed(BASE / "record" / "index.html",
                                    shell("Record · Shouzhe Li", "record", ev_body,
                                          "Dated evidence entries behind every capability claim.")))

    rd_cards = "\n".join(radar_card(e, i + 1, layers) for i, e in enumerate(radar))
    last = radar[0]["date"] if radar else "-"
    rd_body = f"""    <section class="list-hero">
      <div class="wrap">
        <p class="eyebrow">{dual("Radar", "雷达")}</p>
        <h1 class="display">{dual("What changed, what I think, and what I will do about it.", "发生了什么、我怎么判断、准备怎么做。")}</h1>
        <p class="lede">{dual(f"{len(radar)} signals · last update {last}. Only new tools, material updates and changed judgments.", f"{len(radar)} 条信号 · 最后更新 {last}。只记新工具、实质更新与判断变化。")}</p>
        <div class="filters" role="group" aria-label="Filter by layer">
          {filter_html}
        </div>
      </div>
    </section>
    <section class="section section-flush"><div class="wrap"><div class="entry-list">
{rd_cards}
    </div></div></section>"""
    changed.append(write_if_changed(BASE / "radar" / "index.html",
                                    shell("Radar · Shouzhe Li", "radar", rd_body,
                                          "Weekly signals with judgment, confidence and an action.")))
    return evidence, radar, changed


def inject_home(evidence, radar):
    changed = []
    home = resolve(BASE / "index.html")
    if not home.is_file():
        return changed
    html = read_text(home)

    def item(entry, index, folder):
        return (f'<li><span class="no">{index + 1:02d}</span>'
                f'<a href="/{folder}/index.html#{entry["id"]}">{dual(entry.get("title_en",""), entry.get("title_zh",""))}</a>'
                f'<span class="when">{entry.get("date","")}</span></li>')

    latest_ev = "\n".join(item(e, i, "record") for i, e in enumerate(evidence[:3]))
    latest_rd = "\n".join(item(e, i, "radar") for i, e in enumerate(radar[:3]))
    rs = load_json("facts.json")["facts"]["render_sensitivity"]
    stats = (
        f'<div class="stat"><strong>{len(evidence)}</strong><span>{dual("records", "条记录", "em")}</span></div>'
        f'<div class="stat"><strong>{len(radar)}</strong><span>{dual("radar signals", "条雷达", "em")}</span></div>'
        f'<div class="stat"><strong>{rs["value"]}{rs["unit"]}</strong><span>{dual("render sensitivity", "渲染口径敏感性", "em")}</span></div>'
        f'<div class="stat"><strong>{max(e.get("date","") for e in evidence + radar)}</strong><span>{dual("last update", "最后更新", "em")}</span></div>'
    )
    html = re.sub(r"<!-- @STATS -->.*?<!-- @/STATS -->", f"<!-- @STATS -->\n{stats}\n<!-- @/STATS -->", html, flags=re.S)
    html = re.sub(r"<!-- @LATEST_EVIDENCE -->.*?<!-- @/LATEST_EVIDENCE -->", f"<!-- @LATEST_EVIDENCE -->\n{latest_ev}\n<!-- @/LATEST_EVIDENCE -->", html, flags=re.S)
    html = re.sub(r"<!-- @LATEST_RADAR -->.*?<!-- @/LATEST_RADAR -->", f"<!-- @LATEST_RADAR -->\n{latest_rd}\n<!-- @/LATEST_RADAR -->", html, flags=re.S)
    changed.append(write_if_changed(home, html))
    return changed


def inject_capabilities(evidence):
    path = BASE / "capabilities" / "index.html"
    if not path.is_file():
        return []
    html = read_text(path)
    if "@CAP_RECORDS" not in html:
        return []

    def item(entry, index):
        return (f'<li><span class="no">{index + 1:02d}</span>'
                f'<a href="/record/index.html#{entry["id"]}">{dual(entry.get("title_en",""), entry.get("title_zh",""))}</a>'
                f'<span class="when">{entry.get("date","")}</span></li>')

    latest = "\n".join(item(e, i) for i, e in enumerate(evidence[:6]))
    html = re.sub(r"<!-- @CAP_RECORDS -->.*?<!-- @/CAP_RECORDS -->",
                  f"<!-- @CAP_RECORDS -->\n{latest}\n<!-- @/CAP_RECORDS -->", html, flags=re.S)
    return [write_if_changed(path, html)]


def main():
    evidence, radar, changed = build_lists()
    changed += inject_home(evidence, radar)
    changed += inject_capabilities(evidence)
    print(f"evidence={len(evidence)} radar={len(radar)}")
    print("changed files:", sum(1 for c in changed if c))
    return 0


if __name__ == "__main__":
    sys.exit(main())
