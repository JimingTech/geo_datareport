import React from 'react';
import report from '../data/jingdongReport.json';

const { compare, scope, rivals, october } = report;

export default function Page_NextStepSuggestions() {
  return (
    <div className="w-full h-full flex flex-col px-12 sm:px-16 pt-[22px] pb-8 text-zinc-800 font-sans bg-white overflow-hidden">
      <div className="flex items-center shrink-0 mb-4">
        <div className="w-2 h-10 bg-[#004CE5] rounded-full shadow-[0_0_15px_rgba(0,76,229,0.25)]" />
        <h1 className="text-4xl font-black text-zinc-900 tracking-wider ml-4">下一步优化建议</h1>
      </div>
      <div className="rounded-2xl border border-zinc-200 bg-slate-50/50 p-8 flex-1 flex flex-col justify-evenly">
        <p className="text-2xl font-bold text-zinc-800">
          1. 持续巩固 DeepSeek（提及率 {october.platforms[0]?.mention_rate}%）与豆包（提及率 {october.platforms[1]?.mention_rate}%）双平台高水位，稳定保持日均提及率在 70% 以上。
        </p>
        <p className="text-2xl font-bold text-zinc-800">
          2. 针对 {scope.entries} 个监测词条中剩余 {scope.entries - october.covered_entries} 个细分专家/医生问法定向补充语料，实现词条 100% 覆盖。
        </p>
        <p className="text-2xl font-bold text-zinc-800">
          3. 围绕「价格透明、无隐形消费、北京线下自营门诊、售后保障」核心心智，持续扩大对美团、大众点评等竞品的 Top1 首推领先优势。
        </p>
      </div>
    </div>
  );
}
