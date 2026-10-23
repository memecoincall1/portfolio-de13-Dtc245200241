import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { aboutNotes } from '@/lib/hoan-content';

const SERIF = "'EB Garamond', 'Playfair Display', 'Noto Serif', 'Times New Roman', serif";
const SANS = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

export function AboutPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <main className="w-full bg-[#FFFFFF]" style={{ fontFamily: SANS }}>
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-10 px-6 pt-20 pb-10 text-left sm:px-8 md:grid-cols-12 md:gap-12 md:pt-32 md:pb-14 lg:gap-16 lg:pb-20">
        {/* ── Cột trái: cụm tiêu đề ── */}
        <div className="md:col-span-5">
          <div className="md:sticky md:top-10">
            <div className="mt-20 block md:mt-32" style={{ marginTop: '100px' }}>
              <p className="mb-2 font-mono text-xs uppercase tracking-wider text-gray-400">
                Một vài lưu ý
              </p>
              <h1 className="my-3 font-serif text-3xl font-normal text-black md:text-5xl">
                Mình là Hoan Duong.
              </h1>
              <p className="mt-2 font-mono text-xs text-gray-400">
                chọn một mục để đọc <span aria-hidden="true">→</span>
              </p>
            </div>
          </div>
        </div>

        {/* ── Cột phải: Accordion list ── */}
        <div className="mt-20 md:col-span-7 md:mt-32" style={{ marginTop: '100px' }}>
          <div className="border-t border-gray-200">
          {aboutNotes.map((note, index) => {
            const isOpen = openIndex === index;
            return (
              <section key={note.id} className="border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={`about-panel-${note.id}`}
                  id={`about-button-${note.id}`}
                  className="flex w-full cursor-pointer items-center justify-between gap-6 bg-transparent py-6 text-left outline-none focus-visible:ring-1 focus-visible:ring-[#111111] focus-visible:ring-offset-2 md:py-8"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <span className="flex min-w-0 flex-col gap-1.5">
                    <span className="text-xs" style={{ fontFamily: MONO, color: '#999999' }}>
                      {note.no} / {note.headerTitle}
                    </span>
                    <span
                      className="block text-2xl leading-[1.2] lowercase lg:text-[1.85rem]"
                      style={{ fontFamily: SERIF, color: '#1a1a1a', fontWeight: 500 }}
                    >
                      {note.subHeading}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 shrink-0 items-center justify-center text-2xl leading-none font-light"
                    style={{ fontFamily: MONO, color: '#111111' }}
                  >
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                <div
                  id={`about-panel-${note.id}`}
                  role="region"
                  aria-labelledby={`about-button-${note.id}`}
                  className="grid transition-[grid-template-rows,opacity] duration-500 ease-in-out motion-reduce:transition-none"
                  style={{
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="pt-2 pb-7 sm:pb-8">
                      <p
                        className="max-w-[62ch] text-[15px] font-normal"
                        style={{ lineHeight: 1.7, color: '#333333' }}
                      >
                        {note.body}
                      </p>
                      <p
                        className="mt-6 text-[11px]"
                        style={{ fontFamily: MONO, letterSpacing: '0.08em', color: '#999999' }}
                      >
                        {note.tag}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* ── Footer link cột phải ── */}
        <div className="mt-8 sm:mt-10">
          <Link
            to="/contact"
            className="group inline-flex items-center gap-1 font-normal underline decoration-[#d4d4d4] underline-offset-4"
            style={{ fontSize: '1.1rem', color: '#111111' }}
          >
            <span className="transition-opacity duration-200 group-hover:opacity-70">
              Hãy cùng viết chương tiếp theo
            </span>
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </Link>
        </div>
        </div>
      </div>
    </main>
  );
}

