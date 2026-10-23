"""Build src/data/policies.json from saved thehakiman.com policy pages (verbatim copy).

Usage:  python -I scripts/import-policies.py <dir-with-raw-html>
"""
import html
import json
import re
import sys
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "src" / "data" / "policies.json"
PAGES = {
    "shipping": "shipping-policy.php",
    "refunds": "refund-policy.php",
    "privacy": "privacy-policy.php",
    "terms": "terms-and-conditions.php",
}


def text_lines(raw):
    s = re.sub(r"(?is)<(script|style|noscript|svg)[^>]*>.*?</\1>", "", raw)
    s = re.sub(r"(?i)<br\s*/?>|</(p|div|h\d|li|tr|section|button|a)>", "\n", s)
    s = html.unescape(re.sub(r"<[^>]+>", " ", s))
    return [re.sub(r"\s+", " ", l).strip() for l in s.splitlines() if l.strip()]


def parse(raw, key):
    lines = text_lines(raw)
    start = next(i for i, l in enumerate(lines) if l.startswith("Last Updated:")) - 3
    end = lines.index("Begin your journey toward Natural wellness")
    body = lines[start:end]
    doc = {"key": key, "eyebrow": body[0], "title": body[1], "intro": body[2], "updated": body[3], "sections": []}
    for line in body[4:]:
        if re.match(r"^\d+\.\s", line):
            doc["sections"].append({"heading": line, "paragraphs": []})
        elif doc["sections"]:
            doc["sections"][-1]["paragraphs"].append(re.sub(r"\s+([.,])", r"\1", line))
    return doc


def main():
    raw = Path(sys.argv[1])
    out = {k: parse((raw / f"{f}.html").read_text(encoding="utf-8"), k) for k, f in PAGES.items()}
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {len(out)} policies -> {OUT}")


if __name__ == "__main__":
    main()
