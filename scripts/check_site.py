#!/usr/bin/env python3
"""Read-only checks for the capability archive.

Usage: python scripts/check_site.py
Exit code 0 when clean, 1 when there are errors, 2 when only warnings.
"""
import hashlib
import json
import re
import sys
from datetime import date
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
CONTENT = BASE / "content"
ERRORS = []
WARNINGS = []

REQUIRED = [
    "id", "layer", "dimension", "status", "date", "title_en", "title_zh",
    "summary_en", "summary_zh", "question", "method", "result",
    "condition", "boundary", "source",
]


def pages():
    return [p for p in BASE.rglob("*.html")
            if "content" not in p.parts and p.name != "og.html"]


def check_links():
    for page in pages():
        text = page.read_text(encoding="utf-8")
        for match in re.finditer(r'(?:href|src)="([^"]+)"', text):
            url = match.group(1)
            if url.startswith(("http://", "https://", "mailto:", "#", "data:")):
                continue
            target = url.split("#")[0].split("?")[0]
            if not target:
                continue
            path = (BASE / target.lstrip("/")) if target.startswith("/") else (page.parent / target)
            if not path.exists():
                ERRORS.append(f"{page.relative_to(BASE)}: broken link {url}")


def check_placeholders():
    banned = ["example.com", "[project title]", "placeholder", "正在整理", "in progress"]
    for page in pages():
        text = page.read_text(encoding="utf-8").lower()
        for word in banned:
            if word in text:
                ERRORS.append(f"{page.relative_to(BASE)}: contains banned text '{word}'")


def check_evidence():
    folder = CONTENT / "evidence"
    if not folder.is_dir():
        ERRORS.append("missing content/evidence")
        return
    for path in sorted(folder.glob("*.md")):
        data = {}
        for line in path.read_text(encoding="utf-8").splitlines():
            if ":" in line and not line.lstrip().startswith("#"):
                key, value = line.split(":", 1)
                data[key.strip()] = value.strip()
        for key in REQUIRED:
            if not data.get(key):
                ERRORS.append(f"{path.name}: missing field {key}")
        if data.get("status") not in {"measured", "documented", "method", "gap"}:
            ERRORS.append(f"{path.name}: bad status {data.get('status')}")
        if data.get("status") == "measured":
            for key in ("condition", "boundary"):
                if data.get(key) in ("", "-", "n/a"):
                    ERRORS.append(f"{path.name}: measured entry needs {key}")


def check_facts():
    facts = json.loads((CONTENT / "facts.json").read_text(encoding="utf-8"))["facts"]
    today = date.today()
    for key, item in facts.items():
        try:
            expires = date.fromisoformat(item["expires"])
        except (KeyError, ValueError):
            ERRORS.append(f"facts.json: {key} has no valid expires date")
            continue
        if expires < today:
            ERRORS.append(f"facts.json: {key} expired on {expires}")


def check_radar_freshness():
    folder = CONTENT / "radar"
    dates = []
    for path in sorted(folder.glob("*.md")):
        for line in path.read_text(encoding="utf-8").splitlines():
            if line.startswith("date:"):
                dates.append(line.split(":", 1)[1].strip())
                break
    if not dates:
        WARNINGS.append("radar: no entries")
        return
    newest = max(dates)
    age = (date.today() - date.fromisoformat(newest)).days
    if age > 21:
        WARNINGS.append(f"radar: last update {newest} ({age} days ago)")


def check_bilingual():
    for page in pages():
        text = page.read_text(encoding="utf-8")
        en = len(re.findall(r'class="t-en"', text))
        zh = len(re.findall(r'class="t-zh"', text))
        if en != zh:
            ERRORS.append(f"{page.relative_to(BASE)}: t-en={en} t-zh={zh} mismatch")


def check_chrome():
    hashes = {}
    for page in pages():
        text = page.read_text(encoding="utf-8")
        match = re.search(r'<header class="site-header">.*?</header>', text, re.S)
        if not match:
            ERRORS.append(f"{page.relative_to(BASE)}: missing header")
            continue
        block = re.sub(r'\saria-current="page"', "", match.group(0))
        block = re.sub(r"\s+", " ", block)
        digest = hashlib.sha256(block.encode("utf-8")).hexdigest()
        hashes.setdefault(digest, []).append(str(page.relative_to(BASE)))
    if len(hashes) > 1:
        ERRORS.append("header blocks differ: " + "; ".join(", ".join(v) for v in hashes.values()))


def main():
    check_links()
    check_placeholders()
    check_evidence()
    check_facts()
    check_radar_freshness()
    check_bilingual()
    check_chrome()
    for warning in WARNINGS:
        print("WARN", warning)
    for error in ERRORS:
        print("FAIL", error)
    if ERRORS:
        print(f"\n{len(ERRORS)} error(s), {len(WARNINGS)} warning(s)")
        return 1
    print(f"OK: {len(pages())} pages, no errors, {len(WARNINGS)} warning(s)")
    return 2 if WARNINGS else 0


if __name__ == "__main__":
    sys.exit(main())
