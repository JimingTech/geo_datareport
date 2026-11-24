# -*- coding: utf-8 -*-
"""给核心数据 / 竞品分析补三组词条：全部、自定义分组「除壁纸、超薄以外」、自定义分组「大词」。"""
import json
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "src" / "data" / "chuangweiOctoberReport.json"

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
EX_GROUP = "除壁纸、超薄以外"
BIG_GROUP = "大词"
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
        if page >= (data.get("total_pages") or 1) or not batch:
            return rows, data.get("total")
        page += 1
    return rows, len(rows)


platforms = get("/api/platforms", project_id=PROJECT_ID)
plat_map = {p["id"]: p for p in platforms}
custom = get("/api/entry-custom-groups", project_id=PROJECT_ID)["groups"]
cmap = {g["name"]: g for g in custom}
all_entries, _ = page_all(
    "/api/entries",
    project_id=PROJECT_ID,
    start_date=OCTOBER,
    end_date=OCTOBER,
    sort_by="mention_rate",
    sort_order="desc",
)
all_ids = [str(e.get("entry_id") or e.get("id")) for e in all_entries]
name_to_id = {e.get("entry_name"): str(e.get("entry_id") or e.get("id")) for e in all_entries}
ex_ids = [str(i) for i in cmap[EX_GROUP]["entry_ids"]]
if BIG_GROUP in cmap:
    big_ids = [str(i) for i in cmap[BIG_GROUP]["entry_ids"]]
    big_source = f"自定义分组「{BIG_GROUP}」"
else:
    # 客户项目「创维-优化词」上这组已经不在。词条名单以内部项目 534 的同名分组为准，
    # 再按词条名对回 380，提及率仍只查 380，不用中位数口径。
    internal = get("/api/entry-custom-groups", project_id=534)["groups"]
    src = next(g for g in internal if g.get("name") == BIG_GROUP)
    src_entries, _ = page_all(
        "/api/entries",
        project_id=534,
        start_date=OCTOBER,
        end_date=OCTOBER,
        sort_by="mention_rate",
        sort_order="desc",
    )
    src_names = {str(e.get("entry_id") or e.get("id")): e.get("entry_name") for e in src_entries}
    big_ids = []
    missing = []
    for raw_id in src["entry_ids"]:
        name = src_names.get(str(raw_id))
        mapped = name_to_id.get(name)
        if mapped:
            big_ids.append(mapped)
        else:
            missing.append(name or str(raw_id))
    if missing:
        raise SystemExit(f"大词对不上: {missing}")
    big_source = f"词条名对应「{BIG_GROUP}」（客户项目分组已不在，名单来自同名分组，统计仍用创维-优化词）"

print("all", len(all_ids), EX_GROUP, len(ex_ids), BIG_GROUP, len(big_ids))


def with_self(rows, n):
    head = list(rows[:n])
    me = next((b for b in rows if b.get("is_target") or b.get("is_self")), None)
    if me and me not in head:
        head.append(me)
    return head


def snapshot(day, entry_ids=None):
    extra = {}
    if entry_ids:
        extra["entry_ids"] = ",".join(entry_ids)
    stats = get("/api/conversations/stats", project_id=PROJECT_ID, start_date=day, end_date=day, **extra)
    influence = get("/api/competitors/influence", project_id=PROJECT_ID, start_date=day, end_date=day, **extra)
    mention = page_all(
        "/api/competitors/mention-rate",
        project_id=PROJECT_ID,
        start_date=day,
        end_date=day,
        **extra,
    )[0]
    top1 = get(
        "/api/competitors/top-mention-rate",
        project_id=PROJECT_ID,
        start_date=day,
        end_date=day,
        top_type="top1",
        page_size=100,
        **extra,
    )
    top3 = get(
        "/api/competitors/top-mention-rate",
        project_id=PROJECT_ID,
        start_date=day,
        end_date=day,
        top_type="top3",
        page_size=100,
        **extra,
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

    return {
        "mention_rate": clean_num(stats.get("brand_mention_rate")),
        "top1_mention_rate": clean_num(self_top1.get("selected_top_mention_rate")) if self_top1 else 0,
        "top3_mention_rate": clean_num(self_top3.get("selected_top_mention_rate")) if self_top3 else 0,
        "top1_rank": (self_top1 or {}).get("rank"),
        "top3_rank": (self_top3 or {}).get("rank"),
        "mention_rank": (self_mention or {}).get("rank"),
        "influence_score": clean_num(me.get("influence_score")),
        "influence_rank": me.get("rank"),
        "conversations": influence.get("total_conversations"),
        "entries": len(entry_ids) if entry_ids else (influence.get("total_entries") or len(all_ids)),
        "platforms": [
            {"name": pname(p), "mention_rate": clean_num(p.get("brand_mention_rate"))}
            for p in (stats.get("platform_stats") or [])
        ],
        "mention_board": pack_rank(with_self(mention, 15), "mention_rate"),
        "top1_board": pack_rank(with_self(top1_list, 15), "selected_top_mention_rate"),
        "influence_board": pack_rank(with_self(influence.get("list") or [], 15), "influence_score"),
    }


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


def pack_product(name, source, entry_ids):
    before = snapshot(BEFORE, entry_ids)
    october = snapshot(OCTOBER, entry_ids)
    slim = (
        "mention_rate", "top1_mention_rate", "top3_mention_rate",
        "top1_rank", "top3_rank", "mention_rank",
        "influence_score", "influence_rank", "conversations", "entries", "platforms",
    )
    return {
        "name": name,
        "source": source,
        "entry_count": len(entry_ids) if entry_ids else len(all_ids),
        "before": {k: before[k] for k in slim},
        "september": {k: october[k] for k in slim},
        "compare": {
            "mention_rate": top_four_plus_self(october["mention_board"], lambda b: pct(b["value"])),
            "top1": top_four_plus_self(october["top1_board"], lambda b: pct(b["value"])),
            "influence": top_four_plus_self(october["influence_board"], lambda b: f"NO. {b['rank']}"),
        },
    }


products = {
    "all": pack_product("创维电视（全部词条）", "全部词条", None),
    "ex_form": pack_product(
        "创维电视（除壁纸、超薄以外）",
        f"自定义分组「{EX_GROUP}」",
        ex_ids,
    ),
    "big": pack_product(
        "创维电视（大词）",
        big_source,
        big_ids,
    ),
}

report = json.loads(REPORT.read_text(encoding="utf-8"))
report["products"] = products
report["meta"]["product_rows"] = [
    {"key": "all", "name": products["all"]["name"]},
    {"key": "ex_form", "name": products["ex_form"]["name"]},
    {"key": "big", "name": products["big"]["name"]},
]
REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

summary = {}
for key, p in products.items():
    summary[key] = {
        "name": p["name"],
        "source": p["source"],
        "entries": p["entry_count"],
        "before": {k: p["before"][k] for k in (
            "mention_rate", "top1_mention_rate", "top3_mention_rate",
            "top1_rank", "top3_rank", "influence_rank",
        )},
        "october": {k: p["september"][k] for k in (
            "mention_rate", "top1_mention_rate", "top3_mention_rate",
            "top1_rank", "top3_rank", "influence_rank",
        )},
        "before_plats": p["before"]["platforms"],
        "october_plats": p["september"]["platforms"],
        "compare": p["compare"],
    }
print(json.dumps(summary, ensure_ascii=False, indent=2))
