#!/usr/bin/env python3
"""
site-harvester — Reform prep agent for Arkkhe.

Takes a URL, scores whether the site is worth rebuilding, downloads every asset,
and extracts the business information (contact, phone, socials, hours, copy)
and builds a folder ready to open in your coding agent.

Usage:
    python harvest.py https://exemplo.com
    python harvest.py https://exemplo.com --crawl --out ./output
    python harvest.py --batch urls.txt

Output (per site):
    output/<dominio>/
        raw/                original HTML of every page
        assets/images|css|js|fonts/
        business.json       structured business data
        report.json         score de elegibilidade + sinais
        REBUILD_BRIEF.md     briefing pronto pro Antigravity/Claude
"""

import argparse
import datetime
import json
import os
import re
import sys
import time
import subprocess
from collections import Counter
from urllib.parse import urljoin, urlparse, urldefrag

# --- auto-installs dependencies on first run (zero setup) ---
# If pip is unavailable (some managed Python installs), a raw traceback would be
# the first thing a buyer sees. Print the fix instead and exit cleanly.
try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("First run: installing dependencies (requests, beautifulsoup4, lxml)...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "--quiet",
                               "requests", "beautifulsoup4", "lxml"])
        import requests
        from bs4 import BeautifulSoup
    except Exception:
        print("")
        print("  Could not install the dependencies automatically.")
        print("  Run the setup script once and you are done:")
        print("")
        print("    Windows     setup.bat")
        print("    Mac/Linux   chmod +x setup.sh && ./setup.sh")
        print("")
        print("  Or install them by hand:")
        print("    pip install requests beautifulsoup4 lxml")
        print("")
        sys.exit(1)

CURRENT_YEAR = datetime.date.today().year
UA = "Mozilla/5.0 (compatible; HarvesterByArkkhe/1.0; +https://arkkhe.com)"
TIMEOUT = 20
POLITE_DELAY = 1.0  # seconds between requests to the same site

# Inner pages that usually hold useful contact info and copy
USEFUL_PAGE_HINTS = ["about", "sobre", "contact", "contato", "menu", "services",
                     "servicos", "hours", "location", "team", "quem-somos"]

SOCIAL_DOMAINS = {
    "facebook.com": "facebook", "instagram.com": "instagram", "twitter.com": "twitter",
    "x.com": "twitter", "linkedin.com": "linkedin", "youtube.com": "youtube",
    "tiktok.com": "tiktok", "yelp.com": "yelp", "pinterest.com": "pinterest",
    "wa.me": "whatsapp", "api.whatsapp.com": "whatsapp",
}

PHONE_RE = re.compile(r"(\+?\d[\d\-\.\(\)\s]{7,}\d)")
EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")
COPYRIGHT_YEAR_RE = re.compile(r"(?:©|&copy;|copyright)\s*.*?((?:19|20)\d{2})", re.I)
HEX_COLOR_RE = re.compile(r"#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b")
FONT_FAMILY_RE = re.compile(r"font-family\s*:\s*([^;}{]+)", re.I)


# ----------------------------------------------------------------------------
# Rede
# ----------------------------------------------------------------------------
def make_session():
    s = requests.Session()
    s.headers.update({"User-Agent": UA, "Accept-Language": "en-US,en;q=0.9"})
    return s


def fetch(session, url, binary=False):
    try:
        r = session.get(url, timeout=TIMEOUT, allow_redirects=True)
        r.raise_for_status()
        return r
    except Exception as e:
        print(f"    [!] failed to fetch {url}: {e}")
        return None


# ----------------------------------------------------------------------------
# Business data extraction
# ----------------------------------------------------------------------------
def extract_jsonld(soup):
    out = []
    for tag in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(tag.string or "{}")
        except Exception:
            continue
        out.extend(data if isinstance(data, list) else [data])
    return out


def _walk_jsonld_for_business(items):
    """Look for the LocalBusiness/Organization/Restaurant block and return useful fields."""
    interesting = ("LocalBusiness", "Organization", "Restaurant", "Store",
                   "ProfessionalService", "HomeAndConstructionBusiness",
                   "AutoRepair", "FoodEstablishment", "Dentist")
    found = {}
    stack = list(items)
    while stack:
        node = stack.pop()
        if not isinstance(node, dict):
            continue
        t = node.get("@type", "")
        types = t if isinstance(t, list) else [t]
        if any(any(i in str(x) for i in interesting) for x in types):
            found.setdefault("name", node.get("name"))
            found.setdefault("phone", node.get("telephone"))
            found.setdefault("email", node.get("email"))
            found.setdefault("url", node.get("url"))
            addr = node.get("address")
            if isinstance(addr, dict):
                parts = [addr.get("streetAddress"), addr.get("addressLocality"),
                         addr.get("addressRegion"), addr.get("postalCode"),
                         addr.get("addressCountry")]
                found.setdefault("address", ", ".join(p for p in parts if p))
            elif isinstance(addr, str):
                found.setdefault("address", addr)
            hours = node.get("openingHours") or node.get("openingHoursSpecification")
            if hours:
                found.setdefault("hours", hours)
            sameas = node.get("sameAs")
            if sameas:
                found.setdefault("sameAs", sameas if isinstance(sameas, list) else [sameas])
        # aprofunda em valores aninhados
        for v in node.values():
            if isinstance(v, dict):
                stack.append(v)
            elif isinstance(v, list):
                stack.extend(x for x in v if isinstance(x, dict))
    return {k: v for k, v in found.items() if v}


def extract_business_info(soup, base_url, page_text):
    info = {"name": None, "phones": [], "emails": [], "address": None,
            "hours": None, "social": {}, "logo": None, "description": None}

    # 1) JSON-LD (most reliable source)
    jsonld = _walk_jsonld_for_business(extract_jsonld(soup))
    if jsonld.get("name"):
        info["name"] = jsonld["name"]
    if jsonld.get("phone"):
        info["phones"].append(jsonld["phone"])
    if jsonld.get("email"):
        info["emails"].append(jsonld["email"])
    if jsonld.get("address"):
        info["address"] = jsonld["address"]
    if jsonld.get("hours"):
        info["hours"] = jsonld["hours"]
    for s in jsonld.get("sameAs", []):
        _classify_social(s, info["social"])

    # 2) Meta tags
    def meta(prop, attr="property"):
        tag = soup.find("meta", {attr: prop})
        return tag.get("content") if tag and tag.get("content") else None
    if not info["name"]:
        info["name"] = meta("og:site_name") or meta("og:title") or (
            soup.title.string.strip() if soup.title and soup.title.string else None)
    info["description"] = meta("og:description") or meta("description", "name")
    og_image = meta("og:image")

    # 3) tel: / mailto: links
    for a in soup.find_all("a", href=True):
        href = a["href"].strip()
        if href.lower().startswith("tel:"):
            info["phones"].append(href[4:])
        elif href.lower().startswith("mailto:"):
            info["emails"].append(href[7:].split("?")[0])
        else:
            _classify_social(href, info["social"], base_url)

    # 4) Regex no texto como fallback
    for m in PHONE_RE.findall(page_text):
        cleaned = m.strip()
        if 8 <= len(re.sub(r"\D", "", cleaned)) <= 15:
            info["phones"].append(cleaned)
    info["emails"].extend(EMAIL_RE.findall(page_text))

    # 5) Logo
    info["logo"] = _find_logo(soup, base_url) or og_image

    # dedupe e limpeza
    info["phones"] = _dedupe_phones(info["phones"])
    info["emails"] = sorted(set(e.lower() for e in info["emails"]
                                if not e.lower().endswith((".png", ".jpg", ".gif"))))
    return info


def _classify_social(url, bucket, base_url=None):
    try:
        netloc = urlparse(url).netloc.lower().replace("www.", "")
    except Exception:
        return
    for dom, name in SOCIAL_DOMAINS.items():
        if netloc.endswith(dom):
            bucket.setdefault(name, url)
            return


def _find_logo(soup, base_url):
    candidates = soup.find_all("img")
    for img in candidates:
        blob = " ".join(str(img.get(a, "")) for a in ("src", "alt", "class", "id")).lower()
        if "logo" in blob and img.get("src"):
            return urljoin(base_url, img["src"])
    return None


def _dedupe_phones(phones):
    seen, out = set(), []
    for p in phones:
        digits = re.sub(r"\D", "", p)
        if not (8 <= len(digits) <= 15):
            continue
        key = digits[-10:]  # ignore the country code so the same number is not counted twice
        if key not in seen:
            seen.add(key)
            out.append(p.strip())
    return out


# ----------------------------------------------------------------------------
# Technology detection + eligibility
# ----------------------------------------------------------------------------
def detect_tech(html, headers):
    tech = []
    h = html.lower()
    checks = {
        "WordPress": ["wp-content", "wp-includes"],
        "Wix": ["wix.com", "_wix", "wixstatic"],
        "Squarespace": ["squarespace", "static1.squarespace"],
        "Shopify": ["cdn.shopify", "shopify"],
        "Webflow": ["webflow"],
        "GoDaddy Builder": ["godaddy", "websitebuilder"],
        "React": ["react", "__next", "_next/static"],
        "Bootstrap": ["bootstrap"],
        "jQuery": ["jquery"],
    }
    for name, sigs in checks.items():
        if any(s in h for s in sigs):
            tech.append(name)
    # jQuery version
    m = re.search(r"jquery[.\-]?(\d+\.\d+(?:\.\d+)?)", h)
    if m:
        tech.append(f"jQuery {m.group(1)}")
    server = headers.get("Server")
    if server:
        tech.append(f"Server: {server}")
    return tech


def score_eligibility(soup, html, headers, url, tech):
    score, signals = 0, []
    h = html.lower()

    # mobile-friendly?
    if not soup.find("meta", {"name": "viewport"}):
        score += 30
        signals.append("No <meta viewport> - probably not responsive (strong signal)")

    # HTTPS?
    if urlparse(url).scheme != "https":
        score += 15
        signals.append("No HTTPS")

    # ano de copyright
    m = COPYRIGHT_YEAR_RE.search(html)
    if m:
        yr = int(m.group(1))
        age = CURRENT_YEAR - yr
        if age >= 2:
            add = min(age * 3, 30)
            score += add
            signals.append(f"Copyright from {yr} ({age} years old)")

    # Flash / tecnologia morta
    if ".swf" in h or "<object" in h or "shockwave" in h:
        score += 25
        signals.append("Flash / <object> detected (dead technology)")

    # tags legadas
    legacy = [t for t in ("marquee", "font", "center", "frameset", "blink") if f"<{t}" in h]
    if legacy:
        score += 10
        signals.append(f"Legacy HTML tags: {', '.join(legacy)}")

    # layout por tabela
    tables = len(soup.find_all("table"))
    has_modern_css = "display:flex" in h or "display: flex" in h or "grid-template" in h
    if tables >= 3 and not has_modern_css:
        score += 15
        signals.append(f"{tables} <table> and no flex/grid - table layout (2000s)")

    # jQuery antigo
    mj = re.search(r"jquery[.\-]?(\d+)\.(\d+)", h)
    if mj and (int(mj.group(1)) < 1 or (int(mj.group(1)) == 1 and int(mj.group(2)) < 9)):
        score += 15
        signals.append(f"jQuery {mj.group(1)}.{mj.group(2)} (very old)")

    # meta social ausente
    if not soup.find("meta", {"property": "og:title"}):
        score += 5
        signals.append("No Open Graph tags (poor SEO/social)")

    # modern builder -> probably fine already, lowers the score
    modern_builders = {"Wix", "Squarespace", "Shopify", "Webflow", "React"}
    hit = modern_builders.intersection(set(tech))
    if hit and soup.find("meta", {"name": "viewport"}):
        score -= 30
        signals.append(f"Modern builder/stack ({', '.join(hit)}) + responsive -> probably does NOT need a rebuild")

    score = max(0, min(score, 100))
    if score >= 50:
        verdict = "GOOD TARGET"
    elif score >= 25:
        verdict = "MAYBE"
    else:
        verdict = "SKIP"
    return {"score": score, "verdict": verdict, "signals": signals, "tech": tech}


# ----------------------------------------------------------------------------
# Assets + estilo
# ----------------------------------------------------------------------------
def collect_asset_urls(soup, base_url):
    urls = {"images": set(), "css": set(), "js": set(), "fonts": set()}
    for img in soup.find_all("img", src=True):
        urls["images"].add(urljoin(base_url, img["src"]))
    for src in soup.find_all("img", attrs={"data-src": True}):  # lazy load
        urls["images"].add(urljoin(base_url, src["data-src"]))
    for link in soup.find_all("link", href=True):
        rel = " ".join(link.get("rel", [])).lower()
        href = urljoin(base_url, link["href"])
        if "stylesheet" in rel:
            urls["css"].add(href)
        elif "icon" in rel:
            urls["images"].add(href)
    for s in soup.find_all("script", src=True):
        urls["js"].add(urljoin(base_url, s["src"]))
    return urls


def parse_css_for_assets_and_style(css_text, css_base):
    assets = {"images": set(), "fonts": set()}
    for m in re.finditer(r"url\(\s*['\"]?([^'\")]+)['\"]?\s*\)", css_text):
        u = m.group(1).strip()
        if u.startswith("data:"):
            continue
        full = urljoin(css_base, u)
        if re.search(r"\.(woff2?|ttf|otf|eot)(\?|$)", full, re.I):
            assets["fonts"].add(full)
        elif re.search(r"\.(png|jpe?g|gif|svg|webp|ico)(\?|$)", full, re.I):
            assets["images"].add(full)
    colors = [("#" + c) if len(c) == 6 else ("#" + "".join(ch * 2 for ch in c))
              for c in HEX_COLOR_RE.findall(css_text)]
    fonts = []
    for m in FONT_FAMILY_RE.findall(css_text):
        fonts.extend(f.strip().strip("'\"") for f in m.split(",")[:2])
    return assets, colors, fonts


def safe_filename(url):
    path = urlparse(url).path
    name = os.path.basename(path) or "index"
    name = re.sub(r"[^\w\-.]", "_", name)
    return name[:120] or "asset"


def download_assets(session, urls_by_type, dest_root):
    saved = {}
    for kind, urls in urls_by_type.items():
        folder = os.path.join(dest_root, "assets", kind)
        os.makedirs(folder, exist_ok=True)
        saved[kind] = []
        for u in sorted(urls):
            r = fetch(session, u, binary=True)
            if not r:
                continue
            fname = safe_filename(u)
            # avoid a filename collision
            path = os.path.join(folder, fname)
            i = 1
            while os.path.exists(path):
                base, ext = os.path.splitext(fname)
                path = os.path.join(folder, f"{base}_{i}{ext}")
                i += 1
            try:
                with open(path, "wb") as f:
                    f.write(r.content)
                saved[kind].append({"url": u, "file": os.path.relpath(path, dest_root),
                                    "bytes": len(r.content)})
            except Exception as e:
                print(f"    [!] could not save {u}: {e}")
            time.sleep(0.2)
    return saved


# ----------------------------------------------------------------------------
# Text / structure extraction
# ----------------------------------------------------------------------------
def extract_structure(soup):
    for t in soup(["script", "style", "noscript"]):
        t.extract()
    headings = {h: [x.get_text(" ", strip=True) for x in soup.find_all(h)][:15]
                for h in ("h1", "h2", "h3")}
    nav_items = []
    for nav in soup.find_all("nav"):
        nav_items.extend(a.get_text(" ", strip=True) for a in nav.find_all("a")
                         if a.get_text(strip=True))
    body_text = soup.get_text("\n", strip=True)
    body_text = re.sub(r"\n{3,}", "\n\n", body_text)
    return {"headings": headings, "nav": list(dict.fromkeys(nav_items))[:20],
            "text": body_text[:8000]}


# ----------------------------------------------------------------------------
# Per-site orchestration
# ----------------------------------------------------------------------------
def find_internal_pages(soup, base_url, limit=4):
    host = urlparse(base_url).netloc
    picks = []
    for a in soup.find_all("a", href=True):
        href = urldefrag(urljoin(base_url, a["href"]))[0]
        if urlparse(href).netloc != host:
            continue
        low = href.lower()
        if any(hint in low for hint in USEFUL_PAGE_HINTS) and href not in picks:
            picks.append(href)
        if len(picks) >= limit:
            break
    return picks


def harvest(url, out_root, crawl=False):
    session = make_session()
    domain = urlparse(url).netloc.replace("www.", "") or "site"
    dest = os.path.join(out_root, domain)
    os.makedirs(os.path.join(dest, "raw"), exist_ok=True)

    print(f"\n=== {url} ===")
    r = fetch(session, url)
    if not r:
        print("    aborted (site unreachable)")
        return None
    final_url = r.url
    html = r.text
    soup = BeautifulSoup(html, "lxml")
    with open(os.path.join(dest, "raw", "index.html"), "w", encoding="utf-8") as f:
        f.write(html)

    page_text = BeautifulSoup(html, "lxml").get_text(" ", strip=True)
    info = extract_business_info(soup, final_url, page_text)
    tech = detect_tech(html, r.headers)
    report = score_eligibility(soup, html, r.headers, final_url, tech)
    structure = extract_structure(BeautifulSoup(html, "lxml"))

    print(f"    Verdict: {report['verdict']} (score {report['score']})")
    print(f"    Business: {info['name']}  |  phone: {info['phones']}  |  {len(info['social'])} socials")

    # coleta de assets
    asset_urls = collect_asset_urls(soup, final_url)

    # optional: useful inner pages (contact/about/menu)
    extra_text = ""
    if crawl:
        for p in find_internal_pages(soup, final_url):
            time.sleep(POLITE_DELAY)
            rp = fetch(session, p)
            if not rp:
                continue
            psoup = BeautifulSoup(rp.text, "lxml")
            with open(os.path.join(dest, "raw", safe_filename(p) + ".html"),
                      "w", encoding="utf-8") as f:
                f.write(rp.text)
            # enrich contact details from the inner pages
            sub = extract_business_info(psoup, rp.url, psoup.get_text(" ", strip=True))
            info["phones"] = _dedupe_phones(info["phones"] + sub["phones"])
            info["emails"] = sorted(set(info["emails"] + sub["emails"]))
            info["social"].update({k: v for k, v in sub["social"].items()
                                   if k not in info["social"]})
            if not info["address"]:
                info["address"] = sub["address"]
            for k, s in collect_asset_urls(psoup, rp.url).items():
                asset_urls[k] |= s
            extra_text += "\n\n" + psoup.get_text("\n", strip=True)[:3000]

    # baixa e parseia CSS (assets embutidos + paleta + fontes)
    colors, fonts = [], []
    for css_url in list(asset_urls["css"]):
        time.sleep(0.2)
        rc = fetch(session, css_url)
        if not rc:
            continue
        css_assets, c, fnt = parse_css_for_assets_and_style(rc.text, rc.url)
        asset_urls["images"] |= css_assets["images"]
        asset_urls["fonts"] |= css_assets["fonts"]
        colors += c
        fonts += fnt

    palette = [c for c, _ in Counter(colors).most_common(8)]
    font_list = [f for f, _ in Counter(fonts).most_common(6) if f]
    info["palette"] = palette
    info["fonts"] = font_list

    saved = download_assets(session, asset_urls, dest)
    total = sum(len(v) for v in saved.values())
    print(f"    Assets downloaded: {total} "
          f"(img {len(saved.get('images', []))}, css {len(saved.get('css', []))}, "
          f"js {len(saved.get('js', []))}, fonts {len(saved.get('fonts', []))})")

    # grava tudo
    with open(os.path.join(dest, "business.json"), "w", encoding="utf-8") as f:
        json.dump(info, f, ensure_ascii=False, indent=2)
    with open(os.path.join(dest, "report.json"), "w", encoding="utf-8") as f:
        json.dump({**report, "url": final_url, "assets_saved": total},
                  f, ensure_ascii=False, indent=2)
    write_brief(dest, final_url, info, report, structure, saved)
    print(f"    Folder ready: {dest}")
    return {"domain": domain, "verdict": report["verdict"], "score": report["score"],
            "name": info["name"], "phones": info["phones"], "path": dest}


def write_brief(dest, url, info, report, structure, saved):
    def fmt_list(x):
        return ", ".join(x) if x else "—"
    social = "\n".join(f"- {k}: {v}" for k, v in info["social"].items()) or "- (none found)"
    imgs = "\n".join(f"- `{a['file']}`" for a in saved.get("images", [])[:40]) or "- (none)"
    signals = "\n".join(f"- {s}" for s in report["signals"]) or "- (no strong signals)"
    headings = "\n".join(
        f"**{h.upper()}:** " + " | ".join(v) for h, v in structure["headings"].items() if v
    ) or "(no headings)"
    brief = f"""# REBUILD BRIEF - {info['name'] or url}

> Generated automatically by Harvester. Open this folder in your coding agent and
> use this file as the context to rebuild the site.

## Rebuild verdict
- **{report['verdict']}** — score {report['score']}/100
- Detected stack: {fmt_list(report['tech'])}
- Signals:
{signals}

## Business data (use this on the new page)
- **Name:** {info['name'] or '—'}
- **Phone(s):** {fmt_list(info['phones'])}
- **Email(s):** {fmt_list(info['emails'])}
- **Address:** {info['address'] or '—'}
- **Opening hours:** {info['hours'] or '—'}
- **Description:** {info['description'] or '—'}

### Social links
{social}

## Current visual identity (reference)
- **Palette (most used in CSS):** {fmt_list(info.get('palette'))}
- **Fonts:** {fmt_list(info.get('fonts'))}
- **Logo:** {info.get('logo') or '—'}

## Current structure / navigation
- **Menu:** {fmt_list(structure['nav'])}
{headings}

## Copy / extracted text (preserve SEO and real information)
```
{structure['text'][:4000]}
```

## Inventory of downloaded images
{imgs}

---
### Suggested prompt for your coding agent
> Rebuild the website of **{info['name'] or url}** ({fmt_list([report['tech'][0]] if report['tech'] else [])} legacy)
> as a modern, responsive, fast website. Keep the name, contacts, opening hours and
> copy from this brief. Modernise the visual while keeping the identity where it makes
> sense (current palette: {fmt_list(info.get('palette')[:4] if info.get('palette') else [])}).
> The original assets are in `assets/`. Clean hero, clear contact CTA, services/menu
> section, social proof and map/address.
"""
    with open(os.path.join(dest, "REBUILD_BRIEF.md"), "w", encoding="utf-8") as f:
        f.write(brief)


# ----------------------------------------------------------------------------
# CLI
# ----------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser(description="Harvester by Arkkhe - site rebuild prep")
    ap.add_argument("url", nargs="?", help="the website URL")
    ap.add_argument("--batch", help="a .txt file with one URL per line")
    ap.add_argument("--out", default="./output", help="output folder (default ./output)")
    ap.add_argument("--crawl", action="store_true",
                    help="also crawl useful inner pages (about/contact/menu)")
    args = ap.parse_args()

    urls = []
    if args.batch:
        with open(args.batch) as f:
            urls = [l.strip() for l in f if l.strip() and not l.startswith("#")]
    elif args.url:
        urls = [args.url]
    else:
        ap.error("pass a URL or --batch file.txt")

    os.makedirs(args.out, exist_ok=True)
    results = []
    for u in urls:
        if not u.startswith("http"):
            u = "https://" + u
        try:
            res = harvest(u, args.out, crawl=args.crawl)
            if res:
                results.append(res)
        except Exception as e:
            print(f"    [ERROR] {u}: {e}")
        time.sleep(POLITE_DELAY)

    if len(results) > 1:
        print("\n===== RESUMO =====")
        for r in sorted(results, key=lambda x: -x["score"]):
            print(f"  {r['verdict']:9} score {r['score']:3}  {r['domain']:35} {r['name'] or ''}")
        with open(os.path.join(args.out, "_summary.json"), "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
