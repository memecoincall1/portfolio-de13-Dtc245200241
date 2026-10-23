import { useState } from 'react';
import { ArrowLeft, BookOpen, Code2, Compass, Expand, Folder, Globe, Info, Minimize, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { articlesList } from '@/lib/hoan-content';

const SERIF = "'EB Garamond', 'Playfair Display', 'Noto Serif', 'Times New Roman', serif";
const SANS = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

export function BlogsPage() {
  return (
    <main className="w-full bg-[#FFFFFF]" style={{ fontFamily: SANS }}>
      <div className="mx-auto flex w-full max-w-2xl flex-col px-6 pt-24 pb-16 text-left sm:px-8 md:pt-32">
        <p
          className="text-xs uppercase"
          style={{ fontFamily: MONO, letterSpacing: '0.18em', color: '#888888' }}
        >
          00 / Ghi chú bản thảo
        </p>
        <h1
          className="mt-5 text-2xl leading-[1.6] md:text-3xl"
          style={{ fontFamily: SERIF, color: '#111111', fontWeight: 500 }}
        >
          Những suy nghĩ đầu tiên vẫn đang được viết dở. Quay lại sau nhé!
          <span aria-hidden="true" className="blogs-caret" style={{ fontFamily: MONO }}>
            |
          </span>
        </h1>
      </div>
      <style>{`.blogs-caret{display:inline-block;margin-left:2px;animation:blogs-blink 1.1s steps(1) infinite;color:#111}@keyframes blogs-blink{0%,55%{opacity:1}56%,100%{opacity:0}}@media (prefers-reduced-motion:reduce){.blogs-caret{animation:none}}`}</style>
    </main>
  );
}