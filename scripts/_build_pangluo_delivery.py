# -*- coding: utf-8 -*-
"""
投放明细构建脚本：
从庞洛邮轮投放文章统计_1124.xlsx 生成 pangluoDelivery.json
"""
import json
from datetime import datetime, date
from pathlib import Path
import openpyxl

ROOT = Path(__file__).resolve().parent.parent
XLSX = Path(r"e:\02GEO\4.结果汇报\11.25\11月投放文章\11月投放文章\庞洛邮轮-优化词(中位数)_投放文章统计_1124.xlsx")

DOMAIN_NAMES = {
    "meipian.cn": "美篇",
    "zhihu.com": "知乎",
    "mp.weixin.qq.com": "微信公众号",
    "k.sina.com.cn": "新浪新闻",
    "toutiao.com": "今日头条",
    "douyin.com": "抖音",
    "v.douyin.com": "抖音",
    "sohu.com": "搜狐",
    "baijiahao.baidu.com": "百家号",
}

def as_date(value):
    if isinstance(value, (datetime, date)):
        return value.strftime("%Y-%m-%d")
    return str(value or "").strip()[:10]

def main():
    wb = openpyxl.load_workbook(XLSX, data_only=True)
    overview = wb["数据概览"]
    detail = wb["文章引用明细"]

    def cell(row, col):
        return overview.cell(row, col).value

    # Parse detail sheet
    rows = []
    for record in detail.iter_rows(min_row=2, values_only=True):
        if record[0] in (None, ""):
            continue
        try:
            int(record[0])
        except (TypeError, ValueError):
            continue
        rows.append(record)

    delivery_articles = int(cell(14, 2))
    cited_articles = int(cell(14, 5))
    delivery_citations = int(cell(10, 2))
    total_conversations = int(cell(6, 2))
    total_citation_records = int(cell(6, 5))

    print(f"Delivery articles: {delivery_articles}, Detail rows: {len(rows)}")
    print(f"Cited articles: {cited_articles}")
    print(f"Delivery citations: {delivery_citations}")

    cited_rows = [r for r in rows if str(r[10]).strip() == "是"]
    print(f"Cited rows count: {len(cited_rows)}")

    def total(idx):
        return sum(int(r[idx] or 0) for r in rows)

    platform_totals = {
        "total": total(5),
        "deepseek": total(6),
        "doubao": total(7),
        "yuanbao": total(8),
        "qwen": total(9),
    }
    print("Platform totals:", platform_totals)

    # Top 10 articles
    top10 = []
    for r in rows[:10]:
        top10.append({
            "rank": int(r[0]),
            "title": str(r[1] or ""),
            "platform": str(r[2] or ""),
            "domain": str(r[3] or ""),
            "date": as_date(r[4]),
            "total": int(r[5] or 0),
            "deepseek": int(r[6] or 0),
            "doubao": int(r[7] or 0),
            "yuanbao": int(r[8] or 0),
            "qwen": int(r[9] or 0),
            "isCited": str(r[10] or "否"),
            "url": str(r[11] or ""),
        })

    # Domain / channel stats
    grouped = {}
    for r in rows:
        channel_name = str(r[2] or DOMAIN_NAMES.get(str(r[3]), str(r[3])))
        acc = grouped.setdefault(channel_name, {"channel": channel_name, "articles": 0, "cited": 0, "citations": 0})
        acc["articles"] += 1
        if str(r[10]).strip() == "是":
            acc["cited"] += 1
        acc["citations"] += int(r[5] or 0)

    domain_stats = sorted(
        grouped.values(),
        key=lambda d: (d["citations"], d["cited"], d["articles"]),
        reverse=True,
    )

    out = {
        "source": XLSX.name,
        "generated_at": "2026-11-24",
        "overview": {
            "delivery_articles": delivery_articles,
            "cited_articles": cited_articles,
            "cited_rate": round(cited_articles / delivery_articles * 100, 1) if delivery_articles else 0,
            "delivery_citations": delivery_citations,
            "total_conversations": total_conversations,
            "total_citation_records": total_citation_records,
        },
        "platform_totals": platform_totals,
        "top10": top10,
        "domain_stats": domain_stats,
    }

    out_path = ROOT / "src" / "data" / "pangluoDelivery.json"
    out_path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Saved to {out_path}")

if __name__ == "__main__":
    main()
