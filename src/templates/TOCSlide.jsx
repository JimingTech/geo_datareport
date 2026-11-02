import React from 'react';
import { parsedConfig } from '../config/parseConfig';
import { tempBranding } from '../config/tempBranding';
import { deckChapters } from '../config/tocPresets';

export default function TOCSlide({ bgImage, title, menuText, brandLabel, serviceGuide }) {
  const chapters = deckChapters(parsedConfig.chapters);
  const debug = false;
  const dbg = debug ? 'bg-red-500/40' : '';

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden bg-gradient-to-br from-slate-50 via-zinc-100 to-white">
      {bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center z-0 opacity-10 mix-blend-multiply"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}

      {/* 临时包装开启时，右上角留给思美 logo，这条品牌线先拿掉 */}
      {!tempBranding.enabled && (
        <div className={`absolute z-10 flex items-center gap-[16px] ${dbg}`} style={{ top: '38px', right: '93px' }}>
          <div className="h-[1px] bg-zinc-800/40" style={{ width: '200px' }} />
          <span
            className="text-zinc-900 font-semibold"
            style={{ fontSize: '26px', letterSpacing: '0.3em', fontFamily: "'Montserrat', sans-serif" }}
          >
            {brandLabel}
          </span>
        </div>
      )}

      {/* Left: title */}
      <div className={`absolute z-10 ${dbg}`} style={{ top: '233px', left: '130px' }}>
        <h1
          className="text-zinc-900 font-black"
          style={{ fontSize: '78px', letterSpacing: '0.05em', fontFamily: "'AlimamaShuHeiTi', sans-serif" }}
        >
          {title}
        </h1>
      </div>

      {/* Left: chapter list */}
      <div 
        className={`absolute z-10 flex flex-col gap-[16px] ${dbg}`} 
        style={{ 
          bottom: '225px', 
          left: '132px',
          width: 'auto'
        }}
      >
        {chapters.map((chapter, i) => (
          <div key={i} className="flex items-baseline" style={{ lineHeight: '1.4' }}>
            <span
              className="text-[#004CE5] shrink-0 font-light"
              style={{ 
                fontSize: '42px', 
                fontFamily: "'MiSans', sans-serif",
                width: '85px',
                minWidth: '85px',
                display: 'inline-block'
              }}
            >
              {String(i + 1).padStart(2, '0')}.
            </span>
            <span
              className="text-zinc-900 font-semibold tracking-wide"
              style={{ 
                fontSize: '36px', 
                fontFamily: "'MiSans', sans-serif" 
              }}
            >
              {chapter.title.replace('\n', '')}
            </span>
          </div>
        ))}
      </div>

      {/* Right: MENU */}
      <div className={`absolute z-10 flex flex-col items-end ${dbg}`} style={{ right: '114px', top: '76%', transform: 'translateY(-50%)' }}>
        <span
          className="text-[#004CE5]/[0.25] font-black leading-none select-none"
          style={{ fontSize: '261px', letterSpacing: '0', fontFamily: "'Roboto', sans-serif" }}
        >
          {menuText}
        </span>
        <span
          className="text-zinc-700 font-semibold"
          style={{ fontSize: '32px', letterSpacing: '0', marginTop: '42px', marginRight: '10px' }}
        >
          {serviceGuide}
        </span>
      </div>
    </div>
  );
}
