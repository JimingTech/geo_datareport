# -*- coding: utf-8 -*-
"""组装创维电视 11 月报告。10月=2026-10-29，11月=2026-11-25。不改投放明细。"""
import json
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parent.parent
ENV = {}
for line in Path(r"e:\6.cursor\reports\report_gujinggong\.env").read_text(encoding="utf-8").splitlines():
    t = line.strip()
    if not t or t.startswith("#") or "=" not in t:
        continue
    k, v = t.split("=", 1)
    ENV[k.strip()] = v.strip().strip('"').strip("'")

PROJECT_ID = 380
BEFORE = "2026-10-29"
OCTOBER = "2026-11-25"
DISPLAY = "创维电视"
BASE = ENV["GEO_API_BASE"].rstrip("/")

s = requests.Session()
login = s.post(f"{BASE}/login", json={"username": ENV["GEO_USER"], "password": ENV["GEO_PASS"]}, timeout=60).json()
if not login.get("ok"):
    raise SystemExit("login failed")


def get(path, **params):
    r = s.get(f"{BASE}{path}", params=params, timeout=90)
    j = r.json()
    if not j.get("ok"):
        raise SystemExit(f"{path} {j.get('error')}")
    return j["data"]


def num(v):
    if v is None or v == "":
        return None
    return float(v) if "." in str(v) else int(v) if str(v).isdigit() else float(v)


def clean_num(v):
    n = num(v)
    if n is None:
        return None
    if float(n).is_integer():
        return int(n)
    return round(float(n), 1)


def page_all(path, **params):
    rows, page = [], 1
    while page <= 20:
        data = get(path, page=page, page_size=100, **params)
        batch = data.get("list") or []
        rows.extend(batch)
        total_pages = data.get("total_pages") or 1
        if page >= total_pages or not batch:
            return rows, data.get("total")
        page += 1
    return rows, len(rows)


platforms = get("/api/platforms", project_id=PROJECT_ID)
plat_map = {p["id"]: p for p in platforms}


def with_self(rows, n):
    head = list(rows[:n])
    me = next((b for b in rows if b.get("is_target") or b.get("is_self")), None)
    if me and me not in head:
        head.append(me)
    return head


def snapshot(day):
    stats = get("/api/conversations/stats", project_id=PROJECT_ID, start_date=day, end_date=day)
    influence = get("/api/competitors/influence", project_id=PROJECT_ID, start_date=day, end_date=day)
    entries, total = page_all(
        "/api/entries",
        project_id=PROJECT_ID,
        start_date=day,
        end_date=day,
        sort_by="mention_rate",
        sort_order="desc",
    )
    mention = page_all(
        "/api/competitors/mention-rate",
        project_id=PROJECT_ID,
        start_date=day,
        end_date=day,
    )[0]
    top1 = get(
        "/api/competitors/top-mention-rate",
        project_id=PROJECT_ID,
        start_date=day,
        end_date=day,
        top_type="top1",
        page_size=100,
    )
    top3 = get(
        "/api/competitors/top-mention-rate",
        project_id=PROJECT_ID,
        start_date=day,
        end_date=day,
        top_type="top3",
        page_size=100,
    )
    citations = get("/api/citations/stats", project_id=PROJECT_ID, start_date=day, end_date=day)
    me = next((b for b in (influence.get("list") or []) if b.get("is_target")), {})
    top1_list = top1.get("list") or []
    top3_list = top3.get("list") or []
    self_top1 = next((b for b in top1_list if b.get("is_self") or b.get("is_target")), None)
    self_top3 = next((b for b in top3_list if b.get("is_self") or b.get("is_target")), None)
    self_mention = next((b for b in mention if b.get("is_target") or b.get("is_self")), None)

    def pname(p):
        return plat_map.get(p.get("platform_id"), {}).get("name") or p.get("platform_name") or f"平台{p.get('platform_id')}"

    def brand_name(b):
        if b.get("is_target") or b.get("is_self"):
            return DISPLAY
        return b.get("display_name") or b.get("product_name") or b.get("brand_name") or "-"

    def pack_rank(rows, rate_key):
        out = []
        for i, b in enumerate(rows):
            rate = b.get(rate_key)
            if rate is None:
                rate = b.get("selected_top_mention_rate")
            out.append({
                "name": brand_name(b),
                "value": None if rate is None else clean_num(rate),
                "is_target": bool(b.get("is_target") or b.get("is_self")),
                "rank": b.get("rank") or i + 1,
            })
        return out

    covered = [e for e in entries if (num(e.get("mention_rate")) or 0) > 0]
    return {
        "day": day,
        "mention_rate": clean_num(stats.get("brand_mention_rate")),
        "top1_mention_rate": clean_num(self_top1.get("selected_top_mention_rate")) if self_top1 else 0,
        "top3_mention_rate": clean_num(self_top3.get("selected_top_mention_rate")) if self_top3 else 0,
        "top1_rank": (self_top1 or {}).get("rank"),
        "top3_rank": (self_top3 or {}).get("rank"),
        "mention_rank": (self_mention or {}).get("rank"),
        "influence_score": clean_num(me.get("influence_score")),
        "influence_rank": me.get("rank"),
        "conversations": influence.get("total_conversations"),
        "entries_total": total or len(entries),
        "covered_entries": len(covered),
        "platforms": [
            {"name": pname(p), "mention_rate": clean_num(p.get("brand_mention_rate"))}
            for p in (stats.get("platform_stats") or [])
        ],
        "mention_board": pack_rank(with_self(mention, 15), "mention_rate"),
        "top1_board": pack_rank(with_self(top1_list, 15), "selected_top_mention_rate"),
        "influence_board": pack_rank(with_self(influence.get("list") or [], 15), "influence_score"),
        "entries": [
            {
                "name": e.get("entry_name"),
                "mention_rate": clean_num(e.get("mention_rate")),
                "top1_mention_rate": clean_num(e.get("top1_mention_rate")),
            }
            for e in entries
        ],
        "citations": {
            "citation_rate": clean_num(citations.get("citation_rate")),
            "total_citations": citations.get("total_citations"),
            "platform_stats": (citations.get("platform_stats") or [])[:8],
        },
    }


def fmt_rate(v):
    if v is None or v == "":
        return "--"
    n = float(v)
    return f"{n:.1f}%"


def fmt_date(v):
    if not v:
        return "--"
    text = str(v)[:10]
    y, m, d = text.split("-")
    return f"{int(y)}/{int(m)}/{int(d)}"


before = snapshot(BEFORE)
october = snapshot(OCTOBER)

platform_entries = {}
for pl in platforms:
    rows, _ = page_all(
        "/api/entries",
        project_id=PROJECT_ID,
        start_date=OCTOBER,
        end_date=OCTOBER,
        sort_by="mention_rate",
        sort_order="desc",
        platform_ids=pl["id"],
    )
    platform_entries[str(pl["id"])] = [
        {
            "entry_name": e.get("entry_name"),
            "mention_rate": fmt_rate(e.get("mention_rate")),
            "top1_mention_rate": fmt_rate(e.get("top1_mention_rate")),
            "last_conversation_time": fmt_date(e.get("last_conversation_time")),
            "last_screenshot_url": e.get("last_screenshot_url") or None,
        }
        for e in rows
    ]
    print(f"platform {pl['id']} {pl['name']}: {len(rows)}")

before_map = {e["name"]: e for e in before["entries"]}
entries = []
for e in october["entries"]:
    prev = before_map.get(e["name"]) or {}
    entries.append({
        "name": e["name"],
        "mention_rate": e["mention_rate"],
        "top1_mention_rate": e["top1_mention_rate"],
        "before_mention_rate": prev.get("mention_rate"),
        "before_top1_mention_rate": prev.get("top1_mention_rate"),
    })

def top_four_plus_self(board, value_fmt):
    ordered = sorted(board, key=lambda b: b["rank"] or 999)
    me = next((b for b in ordered if b["is_target"]), None)
    if me and (me["rank"] or 999) <= 5:
        rows = ordered[:5]
        if me not in rows:
            rows = ordered[:4] + [me]
    else:
        leaders = [b for b in ordered if not b["is_target"]][:4]
        rows = leaders + ([me] if me else [])
    return [
        {
            "name": b["name"],
            "value": value_fmt(b),
            "isTarget": b["is_target"],
            "rank": b["rank"],
        }
        for b in rows
    ]


def pct(v):
    return "-" if v is None else f"{v}%"


report = {
    "meta": {
        "project_id": PROJECT_ID,
        "project_name": "创维-优化词",
        "product": DISPLAY,
        "brand": DISPLAY,
        "label": "2026年11月",
        "before_date": BEFORE,
        "september_date": OCTOBER,
        "october_date": OCTOBER,
        "before_label": "10月",
        "september_label": "11月",
    },
    "scope": {
        "platforms": len(platforms),
        "platform_names": [p["name"] for p in platforms],
        "entries": october["entries_total"],
        "conversations": october["conversations"],
    },
    "before": {k: before[k] for k in (
        "mention_rate", "top1_mention_rate", "top3_mention_rate", "influence_score",
        "influence_rank", "conversations", "covered_entries", "platforms",
    )},
    "september": {k: october[k] for k in (
        "mention_rate", "top1_mention_rate", "top3_mention_rate", "influence_score",
        "influence_rank", "conversations", "covered_entries", "platforms",
    )},
    "compare": {
        "mention_rate": top_four_plus_self(october["mention_board"], lambda b: pct(b["value"])),
        "top1": top_four_plus_self(october["top1_board"], lambda b: pct(b["value"])),
        "influence": top_four_plus_self(
            october["influence_board"],
            lambda b: f"NO. {b['rank']}",
        ),
    },
    "entries": entries,
    "platform_entries": platform_entries,
    "platforms": [{"id": p["id"], "name": p["name"]} for p in platforms],
}

out = ROOT / "src" / "data" / "chuangweiOctoberReport.json"
out.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

zeros = [e for e in entries if not (e["mention_rate"] or 0)]
gains = sorted(entries, key=lambda e: (e["mention_rate"] or 0) - (e["before_mention_rate"] or 0), reverse=True)
summary = {
    "before": {k: before[k] for k in before if k != "entries"},
    "october": {k: october[k] for k in october if k != "entries"},
    "compare": report["compare"],
    "zero_count": len(zeros),
    "zero_sample": [e["name"] for e in zeros[:12]],
    "top_gains": [
        {"name": e["name"], "before": e["before_mention_rate"], "now": e["mention_rate"], "top1": e["top1_mention_rate"]}
        for e in gains[:8]
    ],
    "still_low": [
        {"name": e["name"], "now": e["mention_rate"], "top1": e["top1_mention_rate"]}
        for e in sorted(entries, key=lambda e: (e["mention_rate"] or 0, e["top1_mention_rate"] or 0))[:8]
    ],
    "platform_counts": {k: len(v) for k, v in platform_entries.items()},
}
(ROOT / "scripts" / "_chuangwei_summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
print("wrote", out)
print("entries", len(entries), "zeros", len(zeros))
