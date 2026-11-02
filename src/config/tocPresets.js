export const TOC_PRESETS = {
  october: ['10月数据', '投放内容与引用明细', '词条数据明细'],
  'october-only': ['10月数据'],
  monthly: ['核心数据与竞品分析', '投放内容与引用明细', '各AI平台模型变更情况', '词条数据明细'],
};

export function deckChapters(allChapters) {
  if (typeof window === 'undefined') return allChapters;
  const preset = TOC_PRESETS[new URLSearchParams(window.location.search).get('toc')];
  if (!preset) return allChapters;
  return preset.map((title) => ({ title }));
}
