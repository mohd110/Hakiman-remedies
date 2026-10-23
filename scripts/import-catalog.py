"""Build src/data/products.json from saved thehakiman.com product pages.

Usage:  python -I scripts/import-catalog.py <dir-with-raw-html>

Every field is read from the page HTML. Nothing is invented: if a block is
absent on the source page the field is left empty / null.
"""
import html
import json
import re
import sys
from pathlib import Path

SOURCE = "https://thehakiman.com/"
OUT = Path(__file__).resolve().parent.parent / "src" / "data" / "products.json"


def clean(s):
    s = html.unescape(s or "")
    # The source double-encodes ampersands (e.g. "&amp;amp;amp;"); collapse to "&".
    while "&amp;" in s:
        s = html.unescape(s)
    s = re.sub(r"<[^>]+>", " ", s)
    return re.sub(r"[ \t]+", " ", s).strip()


def paragraphs(block):
    # Key Benefits is stored separately; feature bullets pasted into the copy are kept in `features`.
    block = re.sub(r"(?is)<h4>Key Benefits</h4>\s*<p>.*?</p>", "", block)
    block = re.sub(r"(Key Features:\s*)?(\n\s*•[^\n]*)+\s*$", "", block.rstrip())
    block = re.sub(r"(?i)</p>|<br\s*/?>", "\n\n", block)
    parts = [clean(p) for p in re.split(r"\n\s*\n", block)]
    return [p for p in parts if p]


def first(pattern, s, flags=re.S):
    m = re.search(pattern, s, flags)
    return m.group(1) if m else None


def money(s):
    return float(s.replace("₹", "").replace(",", "")) if s else None


def tab(page, name):
    return first(rf'<div id="tab-{name}" class="product-tab-content"[^>]*>(.*?)</div>', page)


def parse(path):
    page = path.read_text(encoding="utf-8", errors="replace")
    handle = re.sub(r"^product\.php_slug_", "", path.stem)
    slug = handle

    gallery = re.findall(r"swapMainImage\('([^']+)'", page)
    title = clean(first(r'<h1 class="p-title">(.*?)</h1>', page))

    bullets = [clean(b) for b in re.findall(r'<div class="bullet-item">.*?<span>(.*?)</span>', page, re.S)]
    bullets = [re.sub(r"^•\s*", "", b) for b in bullets if b and b != "Key Features:"]

    desc_block = tab(page, "desc") or ""
    key_benefits = first(r"<h4>Key Benefits</h4>\s*<p>(.*?)</p>", desc_block)
    ing_block = tab(page, "ing")
    usage_block = tab(page, "usage")

    highlights = []
    for t, d, img in re.findall(
        r'<h2 class="ec-title">(.*?)</h2>.*?<p class="ec-desc">(.*?)</p>.*?<img src="([^"]+)"', page, re.S
    ):
        highlights.append({"title": clean(t), "text": clean(d), "image": "/" + img})

    old = first(r'<span class="p-price-old">(.*?)</span>', page)
    new = first(r'<span class="p-price">(.*?)</span>', page)
    sku = clean(first(r"<strong>SKU:</strong>(.*?)</div>", page))
    category = clean(first(r'<span class="p-category desktop-category">(.*?)</span>', page))
    info_card = first(r'<div class="product-info-card">(.*?)<div class="p-reviews">', page) or ""
    badge = first(r'hk-tag-badge[^"]*">.*?</i>\s*(.*?)</span>', info_card)
    source_id = first(r'data-wishlist-id="(\d+)"', page)
    max_qty = first(r'id="product_qty"[^>]*max="(\d+)"', page)

    return {
        "id": f"hk-{source_id}",
        "sourceId": int(source_id) if source_id else None,
        "handle": slug,
        "title": title,
        "description": paragraphs(desc_block),
        "keyBenefits": clean(key_benefits) if key_benefits else None,
        "features": bullets,
        "price": money(new),
        "compareAtPrice": money(old),
        "currency": "INR",
        "images": ["/" + g for g in gallery],
        "highlights": highlights,
        "category": category,
        "badge": clean(badge) if badge else None,
        "sku": sku,
        "brand": "The Hakiman",
        "variants": [
            {"id": f"hk-{source_id}-default", "title": "Default", "price": money(new), "compareAtPrice": money(old), "sku": sku}
        ],
        "ingredients": clean(first(r"<p>(.*?)</p>", ing_block)) if ing_block else None,
        "usageInstructions": clean(first(r"<p[^>]*>(.*?)</p>", usage_block)) if usage_block else None,
        "precautions": None,
        "faqs": [],
        "reviews": [],
        "sourceUrl": f"{SOURCE}product.php?slug={slug}",
        "sourceMaxOrderQty": int(max_qty) if max_qty else None,
        "availability": "in_stock" if max_qty and int(max_qty) > 0 else "unknown",
        "isDemo": False,
    }


def main():
    raw = Path(sys.argv[1])
    products = [parse(p) for p in sorted(raw.glob("product.php_slug_*.html"))]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(products, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {len(products)} products -> {OUT}")


if __name__ == "__main__":
    main()
