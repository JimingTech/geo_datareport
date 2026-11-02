# -*- coding: utf-8 -*-
"""
从「XXX_投放文章统计_1029.xlsx」生成 src/data/delivery_excel_1029.json。

Excel 结构与 0921 相同：
  · 数据概览      —— 投放文章总数 / 被引用文章数 / 投放文章引用次数
  · 文章引用明细  —— 每篇文章一行，末尾有一行【汇总】（排名列为空），必须剔除后再聚合
  · 平台与渠道分析 —— 每个发布平台的文章数 / 被引用文章数 / 引用次数

页面只展示引用次数 Top10 的文章；汇总行用全量口径（与 Excel 的【汇总】行一致）。
页面月份写「10月」，不写 10 月 29 日。
"""
import io
import json
import re
import sys
from pathlib import Path

import openpyxl

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE = Path(r'e:\02GEO\3.GEO数据监测系统\投放文章统计-1029\投放文章统计-1029')
FILES = {
    'smart': '慕思智能床_投放文章统计_1029.xlsx',
    'ai': '慕思AI床垫_投放文章统计_1029.xlsx',
    'mattress': '慕思床垫_投放文章统计_1029.xlsx',
}

MODEL_COLS = {
    'deepseek': 'DeepSeek 引用次数',
    'doubao': '豆包 引用次数',
    'yuanbao': '元宝 引用次数',
    'wenxin': '文心 引用次数',
    'tongyi': '通义千问 引用次数',
    'kimi': 'kimi 引用次数',
}

TOP_N = 10


def num(v):
    if v is None or v == '':
        return 0
    try:
        return int(float(v))
    except (TypeError, ValueError):
        return 0


def fmt_date(v):
    s = str(v).strip()
    return s[:10] if s else ''


out = {}

for key, filename in FILES.items():
    wb = openpyxl.load_workbook(BASE / filename, data_only=True)

    ws = wb['文章引用明细']
    header = [c.value for c in ws[1]]
    idx = {h: i for i, h in enumerate(header) if h}
    missing = [col for col in ['排名', '文章标题', '发布平台', '发布时间', '总引用次数', '是否被引用', *MODEL_COLS.values()] if col not in idx]
    if missing:
        raise SystemExit(f'{key} 缺少列：{missing}；实际表头：{header}')

    rows = [r for r in ws.iter_rows(min_row=2, values_only=True) if any(c not in (None, '') for c in r)]

    def is_article(r, index=idx):
        try:
            int(str(r[index['排名']]).strip())
            return True
        except (TypeError, ValueError):
            return False

    articles = [r for r in rows if is_article(r)]

    delivery_articles = len(articles)
    cited_articles = sum(1 for r in articles if str(r[idx['是否被引用']]).strip() == '是')
    platform_totals = {k: sum(num(r[idx[col]]) for r in articles) for k, col in MODEL_COLS.items()}
    total_citations = sum(num(r[idx['总引用次数']]) for r in articles)

    wso = wb['数据概览']
    assert num(wso.cell(row=14, column=2).value) == delivery_articles, f'{key} 文章总数不一致'
    assert num(wso.cell(row=14, column=5).value) == cited_articles, f'{key} 被引用文章数不一致'
    assert num(wso.cell(row=10, column=2).value) == total_citations, f'{key} 引用次数不一致'
    assert sum(platform_totals.values()) == total_citations, f'{key} 分模型求和不等于总数'

    top10 = []
    for i, r in enumerate(sorted(articles, key=lambda x: -num(x[idx['总引用次数']]))[:TOP_N], start=1):
        item = {
            'rank': i,
            'title': str(r[idx['文章标题']]).strip(),
            'platform': str(r[idx['发布平台']]).strip(),
            'date': fmt_date(r[idx['发布时间']]),
            'total': num(r[idx['总引用次数']]),
            'isCited': str(r[idx['是否被引用']]).strip(),
        }
        for k, col in MODEL_COLS.items():
            item[k] = num(r[idx[col]])
        top10.append(item)

    ws2 = wb['平台与渠道分析']
    prows = [r for r in ws2.iter_rows(min_row=2, values_only=True) if r[0] not in (None, '')]

    merged = {}
    for r in prows:
        base = re.split(r'[（(]', str(r[0]).strip())[0].strip()
        if not base:
            continue
        acc = merged.setdefault(base, {'articles': 0, 'citations': 0})
        acc['articles'] += num(r[1])
        acc['citations'] += num(r[4])

    by_articles = [n for n, _ in sorted(merged.items(), key=lambda kv: -kv[1]['articles'])[:6]]
    by_citations = [n for n, _ in sorted(merged.items(), key=lambda kv: -kv[1]['citations'])[:3]]

    out[key] = {
        'overview': {
            'delivery_citations': total_citations,
            'citation_rate': round(cited_articles / delivery_articles * 100, 1),
            'delivery_articles': delivery_articles,
            'cited_articles': cited_articles,
        },
        'platform_totals': {'total': total_citations, **platform_totals},
        'top10': top10,
        'channels': {
            'by_articles': by_articles,
            'by_citations': by_citations,
        },
    }

    print(f'{key}: 投放 {delivery_articles} 篇 / 被引 {cited_articles} 篇 '
          f'({out[key]["overview"]["citation_rate"]}%) / 引用 {total_citations} 次')
    print(f'  分模型 {platform_totals}')
    print(f'  投放量前六渠道 {by_articles}')
    print(f'  引用量前三渠道 {by_citations}')
    print(f'  Top1 {top10[0]["total"]} 次 · {top10[0]["title"][:40]}')

dest = Path('src/data/delivery_excel_1029.json')
dest.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding='utf-8')
print(f'\n已写入 {dest}')
print('合计文章', sum(v['overview']['delivery_articles'] for v in out.values()),
      '合计引用', sum(v['overview']['delivery_citations'] for v in out.values()))
