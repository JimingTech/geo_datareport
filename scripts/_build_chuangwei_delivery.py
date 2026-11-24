# -*- coding: utf-8 -*-
"""把《创维-优化词(中位数)_投放文章统计_1124.xlsx》写成投放明细数据。"""
import json
from datetime import datetime, date
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parents[1]
XLSX = Path(
    r"e:\02GEO\4.结果汇报\11.25\11月投放文章\11月投放文章"
    r"\创维-优化词(中位数)_投放文章统计_1124.xlsx"
)
OUT = ROOT / "src" / "data" / "chuangweiDelivery.json"

DOMAIN_NAMES = {
    "mp.weixin.qq.com": "微信公众号",
    "post.smzdm.com": "什么值得买",
    "smzdm.com": "什么值得买",
    "hebei.ifeng.com": "凤凰网",
    "ishare.ifeng.com": "凤凰网",
    "ifeng.com": "凤凰网",
    "sz.ifeng.com": "凤凰网",
    "hainan.ifeng.com": "凤凰网",
    "sohu.com": "搜狐",
    "3g.k.sohu.com": "搜狐",
    "focus.cn": "搜狐",
    "v.douyin.com": "抖音",
    "douyin.com": "抖音",
    "toutiao.com": "今日头条",
    "pad.zol.com.cn": "中关村在线",
    "news.zol.com.cn": "中关村在线",
    "xa.zol.com.cn": "中关村在线",
    "jd.zol.com.cn": "中关村在线",
    "price.zol.com.cn": "中关村在线",
    "xinwen.pconline.com.cn": "太平洋电脑网",
    "super.sina.cn": "新浪",
    "k.sina.com.cn": "新浪",
    "sina.cn": "新浪",
    "sina.com.cn": "新浪",
    "zhihu.com": "知乎",
    "view.inews.qq.com": "腾讯新闻",
    "news.qq.com": "腾讯新闻",
    "ithome.com": "IT之家",
    "baijiahao.baidu.com": "百家号",
    "news.cngold.org": "金投网",
    "weibo.com": "微博",
    "163.com": "网易",
    "itbear.com.cn": "ITBEAR",
    "software.it168.com": "IT168",
    "bjnews.com.cn": "新京报",
    "news.yesky.com": "天极网",
    "jianghu.taobao.com": "淘宝江湖",
    "cet.com.cn": "中国经济时报",
    "chinaz.com": "站长之家",
    "tidenews.com.cn": "潮新闻",
    "cheari.com": "家电院",
    "digitalhome.cheaa.com": "中国家电网",
    "douban.com": "豆瓣",
    "example.com": "其他",
}


def as_date(value):
    if isinstance(value, datetime):
        return value.strftime("%Y-%m-%d")
    if isinstance(value, date):
        return value.strftime("%Y-%m-%d")
    text = str(value or "").strip()
    return text[:10]


def main():
    wb = openpyxl.load_workbook(XLSX, data_only=True)
    overview = wb["数据概览"]
    detail = wb["文章引用明细"]
    channels = wb["平台与渠道分析"]

    def cell(row, col):
        return overview.cell(row, col).value

    rows = []
    for record in detail.iter_rows(min_row=2, values_only=True):
        if record[0] in (None, ""):
            continue
        try:
            rank = int(record[0])
        except (TypeError, ValueError):
            continue
        rows.append(record)

    delivery_articles = int(cell(14, 2))
    cited_articles = int(cell(14, 5))
    delivery_citations = int(cell(10, 2))
    if len(rows) != delivery_articles:
        raise SystemExit(f"明细 {len(rows)} 行，概览投放文章总数 {delivery_articles}")

    cited_rows = [r for r in rows if r[10] == "是"]
    if len(cited_rows) != cited_articles:
        raise SystemExit(f"被引 {len(cited_rows)} 行，概览被引用文章数 {cited_articles}")

    def total(idx):
        return sum(int(r[idx] or 0) for r in rows)

    platform_totals = {
        "total": total(5),
        "deepseek": total(6),
        "doubao": total(7),
        "yuanbao": total(8),
        "qwen": total(9),
    }
    if platform_totals["total"] != delivery_citations:
        raise SystemExit(
            f"明细引用合计 {platform_totals['total']}，概览投放文章引用次数 {delivery_citations}"
        )

    top10 = [
        {
            "rank": int(r[0]),
            "title": r[1],
            "platform": r[2],
            "domain": r[3],
            "date": as_date(r[4]),
            "total": int(r[5] or 0),
            "deepseek": int(r[6] or 0),
            "doubao": int(r[7] or 0),
            "yuanbao": int(r[8] or 0),
            "qwen": int(r[9] or 0),
            "isCited": r[10],
        }
        for r in rows[:10]
    ]

    grouped = {}
    for r in rows:
        name = DOMAIN_NAMES.get(r[3], r[3])
        acc = grouped.setdefault(name, {"channel": name, "articles": 0, "cited": 0, "citations": 0})
        acc["articles"] += 1
        if r[10] == "是":
            acc["cited"] += 1
        acc["citations"] += int(r[5] or 0)
    domain_stats = sorted(grouped.values(), key=lambda a: (a["citations"], a["articles"]), reverse=True)

    top_channels = []
    for record in channels.iter_rows(min_row=2, values_only=True):
        if not record[0] or record[0] == "发布平台":
            continue
        top_channels.append(
            {
                "channel": record[0],
                "articles": int(record[1] or 0),
                "cited": int(record[2] or 0),
                "citedRate": float(record[3] or 0),
                "citations": int(record[4] or 0),
            }
        )
    top_channels.sort(key=lambda a: (a["citations"], a["articles"]), reverse=True)

    payload = {
        "source": XLSX.name,
        "generated_at": "2026-11-24",
        "overview": {
            "delivery_articles": delivery_articles,
            "cited_articles": cited_articles,
            "cited_rate": round(cited_articles / delivery_articles * 100, 1),
            "unique_titles": len({r[1] for r in rows}),
            "unique_cited_titles": len({r[1] for r in cited_rows}),
            "delivery_citations": delivery_citations,
            "total_conversations": int(cell(6, 2)),
            "total_citation_records": int(cell(6, 5)),
        },
        "platform_totals": platform_totals,
        "top10": top10,
        "top_channels": top_channels,
        "domain_stats": domain_stats,
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    by_articles = sorted(domain_stats, key=lambda a: (a["articles"], a["citations"]), reverse=True)
    by_cited = sorted(
        [a for a in domain_stats if a["cited"] > 0],
        key=lambda a: (a["cited"], a["citations"]),
        reverse=True,
    )
    print(json.dumps({
        "articles": delivery_articles,
        "cited": cited_articles,
        "rate": payload["overview"]["cited_rate"],
        "titles": payload["overview"]["unique_titles"],
        "platforms": platform_totals,
        "channels": [f"{a['channel']} {a['articles']}" for a in by_articles[:8]],
        "cited_channels": [f"{a['channel']} {a['cited']}" for a in by_cited[:5]],
        "top1": top10[0]["title"],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
