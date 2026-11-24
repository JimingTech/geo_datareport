# -*- coding: utf-8 -*-
"""
组装庞洛邮轮 11 月报告。
优化前=2026-10-19，11月=2026-11-25。
项目 7947（庞洛邮轮-优化词）。
"""
import json
from datetime import datetime, date
from pathlib import Path
import requests

ROOT = Path(__file__).resolve().parent.parent
PROJECT_ID = 7947
PROJECT_NAME = "庞洛邮轮-优化词"
BEFORE = "2026-10-19"
CURRENT = "2026-11-25"
DISPLAY = "庞洛邮轮"
BASE = "https://api.geotopone.com"

s = requests.Session()
login = s.post(f"{BASE}/login", json={"username": "jiming", "password": "jiming123"}, timeout=60).json()
if not login.get("ok"):
    raise SystemExit("Login failed")

def get(path, **params):
    r = s.get(f"{BASE}{path}", params=params, timeout=120)
    j = r.json()
    if not j.get("ok"):
        raise SystemExit(f"{path} {j.get('error')}")
    return j["data"]

def num(v):
    if v is None or v == "":
        return None
    return float(v)

def clean_num(v):
    n = num(v)
    if n is None:
        return None
    if float(n).is_integer():
        return int(n)
    return round(float(n), 1)

def page_all(path, **params):
    rows, page = [], 1
    total = None
    while page <= 30:
        data = get(path, page=page, page_size=100, **params)
        batch = data.get("list") or []
        rows.extend(batch)
        total = data.get("total", total)
        total_pages = data.get("total_pages") or 1
        if page >= total_pages or not batch:
            return rows, total if total is not None else len(rows)
        page += 1
    return rows, len(rows)

projects = get("/api/projects")
project = next((p for p in projects if p.get("id") == PROJECT_ID), None)
if not project or project.get("project_name") != PROJECT_NAME:
    raise SystemExit(f"项目不匹配: {project}")

dates = sorted((get(f"/api/projects/{PROJECT_ID}/data-dates").get("dates") or []))
print("project", project["id"], project["project_name"], project.get("target_product"))
print("has_before", BEFORE in dates, "has_current", CURRENT in dates)

platforms = get("/api/platforms", project_id=PROJECT_ID)
plat_map = {p["id"]: p for p in platforms}
print("platforms", [(p["id"], p["name"]) for p in platforms])

def with_self(rows, n):
    head = list(rows[:n])
    me = next((b for b in rows if b.get("is_target") or b.get("is_self")), None)
    if me and me not in head:
        head.append(me)
    return head

def snapshot(day, entry_ids):
    scope = {"entry_ids": entry_ids}
    stats = get("/api/conversations/stats", project_id=PROJECT_ID, start_date=day, end_date=day, **scope)
    influence = get("/api/competitors/influence", project_id=PROJECT_ID, start_date=day, end_date=day, **scope)
    entries, total = page_all(
        "/api/entries",
        project_id=PROJECT_ID,
        start_date=day,
        end_date=day,
        sort_by="mention_rate",
        sort_order="desc",
        **scope,
    )
    mention = page_all(
        "/api/competitors/mention-rate",
        project_id=PROJECT_ID,
        start_date=day,
        end_date=day,
        **scope,
    )[0]
    top1 = get(
        "/api/competitors/top-mention-rate",
        project_id=PROJECT_ID,
        start_date=day,
        end_date=day,
        top_type="top1",
        page_size=100,
        **scope,
    )
    top3 = get(
        "/api/competitors/top-mention-rate",
        project_id=PROJECT_ID,
        start_date=day,
        end_date=day,
        top_type="top3",
        page_size=100,
        **scope,
    )
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
        "stats_top1": clean_num(stats.get("top1_mention_rate")),
        "stats_top3": clean_num(stats.get("top3_mention_rate")),
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
        "mention_board": pack_rank(with_self(mention, 8), "mention_rate"),
        "top1_board": pack_rank(with_self(top1_list, 8), "selected_top_mention_rate"),
        "top3_board": pack_rank(with_self(top3_list, 8), "selected_top_mention_rate"),
        "influence_board": pack_rank(with_self(influence.get("list") or [], 8), "influence_score"),
        "entries": [
            {
                "name": e.get("entry_name"),
                "mention_rate": clean_num(e.get("mention_rate")),
                "top1_mention_rate": clean_num(e.get("top1_mention_rate")),
            }
            for e in entries
        ],
    }

def fmt_rate(v):
    if v is None or v == "":
        return "--"
    return f"{float(v):.1f}%"

def fmt_date(v):
    if not v:
        return "--"
    text = str(v)[:10]
    y, m, d = text.split("-")
    return f"{int(y)}/{int(m)}/{int(d)}"

id_rows, id_total = page_all(
    "/api/entries",
    project_id=PROJECT_ID,
    start_date=CURRENT,
    end_date=CURRENT,
)
entry_ids = ",".join(str(e["entry_id"]) for e in id_rows if e.get("entry_id"))
print(f"entry_ids: {len(entry_ids.split(','))} / {id_total}")

before = snapshot(BEFORE, entry_ids)
current = snapshot(CURRENT, entry_ids)

platform_entries = {}
for pl in platforms:
    rows, _ = page_all(
        "/api/entries",
        project_id=PROJECT_ID,
        start_date=CURRENT,
        end_date=CURRENT,
        sort_by="mention_rate",
        sort_order="desc",
        platform_ids=pl["id"],
        entry_ids=entry_ids,
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
    print(f"Platform {pl['id']} ({pl['name']}): {len(rows)} rows")

before_map = {e["name"]: e for e in before["entries"]}
entries = []
for e in current["entries"]:
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

snap_keys = (
    "mention_rate", "top1_mention_rate", "top3_mention_rate",
    "mention_rank", "top1_rank", "top3_rank", "influence_score",
    "influence_rank", "conversations", "covered_entries", "platforms",
)

report = {
    "meta": {
        "project_id": PROJECT_ID,
        "project_name": PROJECT_NAME,
        "product": DISPLAY,
        "brand": DISPLAY,
        "label": "2026年11月",
        "before_date": BEFORE,
        "current_date": CURRENT,
        "september_date": CURRENT,
        "before_label": "优化前",
        "september_label": "11月",
    },
    "scope": {
        "platforms": len(platforms),
        "platform_names": [p["name"] for p in platforms],
        "entries": current["entries_total"],
        "conversations": current["conversations"],
    },
    "before": {k: before[k] for k in snap_keys},
    "september": {k: current[k] for k in snap_keys},
    "compare": {
        "mention_rate": top_four_plus_self(current["mention_board"], lambda b: pct(b["value"])),
        "top1": top_four_plus_self(current["top1_board"], lambda b: pct(b["value"])),
        "influence": top_four_plus_self(current["influence_board"], lambda b: f"NO. {b['rank']}"),
    },
    "entries": entries,
    "platform_entries": platform_entries,
    "platforms": [{"id": p["id"], "name": p["name"]} for p in platforms],
}

out_report_path = ROOT / "src" / "data" / "pangluoNovemberReport.json"
out_report_path.write_text(
    json.dumps(report, ensure_ascii=False, indent=2),
    encoding="utf-8",
)
print(f"Report saved to {out_report_path}")

# Build summary for writing copy
zeros = [e for e in entries if not (e["mention_rate"] or 0)]
gains = sorted(entries, key=lambda e: (e["mention_rate"] or 0) - (e["before_mention_rate"] or 0), reverse=True)
top1_zero = [e for e in entries if (e["mention_rate"] or 0) >= 50 and not (e["top1_mention_rate"] or 0)]
new_cover = [e for e in entries if not (e["before_mention_rate"] or 0) and (e["mention_rate"] or 0) > 0]

def brief(snap):
    return {k: snap[k] for k in snap if k not in ("entries", "mention_board", "top1_board", "top3_board", "influence_board")}

summary = {
    "before": brief(before),
    "current": brief(current),
    "compare": report["compare"],
    "zero_count": len(zeros),
    "zero_names": [e["name"] for e in zeros],
    "new_cover": [
        {"name": e["name"], "now": e["mention_rate"], "top1": e["top1_mention_rate"]}
        for e in sorted(new_cover, key=lambda e: e["mention_rate"] or 0, reverse=True)[:12]
    ],
    "top_gains": [
        {"name": e["name"], "before": e["before_mention_rate"], "now": e["mention_rate"], "top1": e["top1_mention_rate"]}
        for e in gains[:10]
    ],
    "top1_zero_high_mention": [
        {"name": e["name"], "now": e["mention_rate"]}
        for e in sorted(top1_zero, key=lambda e: e["mention_rate"] or 0, reverse=True)[:10]
    ],
}

out_summary_path = ROOT / "scripts" / "_pangluo_summary.json"
out_summary_path.write_text(
    json.dumps(summary, ensure_ascii=False, indent=2),
    encoding="utf-8",
)
print(f"Summary saved to {out_summary_path}")
