import React from 'react';
import { tempBranding } from '../config/tempBranding';
import { deckChapters } from '../config/tocPresets';

export default function Page_ProposalChapterCover({
    bgImage,
    title,
    subtitle,
    brandLabel,
    chapterIndex = 0,
    chapters = [],
}) {
    const shown = deckChapters(chapters);
    const norm = (value) => String(value || '').replace(/\n/g, '');
    const activeIndex = shown === chapters
        ? chapterIndex
        : Math.max(0, shown.findIndex((ch) => norm(ch.title) === norm(title)));
    const chapterNum = String(activeIndex + 1).padStart(2, '0');

    return (
        <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-slate-50 via-zinc-100 to-white">

            {/* ── 背景图 ── */}
            {bgImage && (
                <div
                    className="absolute inset-0 bg-cover bg-center z-0 opacity-15 mix-blend-multiply"
                    style={{ backgroundImage: `url(${bgImage})` }}
                />
            )}

            {/* 临时包装开启时，右上角留给思美 logo，这条品牌线先拿掉 */}
            {!tempBranding.enabled && (
                <div
                    className="absolute flex items-center gap-[16px]"
                    style={{ top: '38px', right: '93px' }}
                >
                    <div className="h-[1px] bg-zinc-800/40" style={{ width: '200px' }} />
                    <span
                        className="text-zinc-900 font-semibold"
                        style={{ fontSize: '26px', letterSpacing: '0.3em', fontFamily: "'Montserrat', sans-serif" }}
                    >
                        {brandLabel}
                    </span>
                </div>
            )}

            {/* ── 左侧中偏上：章节大标题 ── */}
            {title && (
                <h1
                    className="absolute text-zinc-900 font-black"
                    style={{
                        fontFamily: "'AlimamaShuHeiTi', sans-serif",
                        fontSize: '182px',
                        lineHeight: '1.1',
                        letterSpacing: '0.02em',
                        top: '350px',
                        left: '66px',
                        maxWidth: '1400px',
                        whiteSpace: 'pre-line',
                    }}
                >
                    {title}
                </h1>
            )}

            {/* ── 左下角：章节列表 ── */}
            <div
                className={`absolute flex flex-col ${shown.length > 4 ? 'gap-[6px]' : 'gap-[10px]'}`}
                style={{ bottom: '90px', left: '96px' }}
            >
                {shown.map((ch, i) => {
                    const isActive = i === activeIndex;
                    const num = String(i + 1).padStart(2, '0');
                    return (
                        <div
                            key={i}
                            className="flex items-center gap-[4px]"
                            style={{ 
                                fontSize: shown.length > 4 ? '20px' : '32px', 
                                lineHeight: '1.4' 
                            }}
                        >
                            <span
                                style={{
                                    color: isActive ? 'rgb(0, 76, 229)' : 'rgba(24,24,27,0.72)',
                                    fontWeight: isActive ? '600' : '500',
                                    letterSpacing: '0.02em',
                                }}
                            >
                                {num}.
                            </span>
                            <span
                                style={{
                                    color: isActive ? 'rgb(0, 76, 229)' : 'rgba(24,24,27,0.72)',
                                    fontWeight: isActive ? '600' : '500',
                                    letterSpacing: '0.02em',
                                    marginLeft: '2px',
                                }}
                            >
                                {ch.title.replace('\n', '')}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* ── 右下角：大章节编号 + 英文标签 ── */}
            <div
                className="absolute flex flex-col items-end"
                style={{ right: '45px', bottom: '74px' }}
            >
                <span
                    className="text-[#004CE5]/[0.25] leading-none"
                    style={{
                        fontFamily: "'Roboto', 'AlimamaShuHeiTi', sans-serif",
                        fontSize: '428px',
                        lineHeight: '0.85',
                        letterSpacing: '-0.02em',
                        fontWeight: 400,
                    }}
                >
                    {chapterNum}
                </span>
                {subtitle && (
                    <span
                        className="text-zinc-700 uppercase"
                        style={{
                            fontSize: '34px',
                            marginTop: '42px',
                            fontFamily: "'MiSans', sans-serif",
                            letterSpacing: 0,
                            fontWeight: 500,
                            marginRight: '79px',
                        }}
                    >
                        {subtitle}
                    </span>
                )}
            </div>
        </div>
    );
}
