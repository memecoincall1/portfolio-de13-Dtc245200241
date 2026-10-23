import { projectsList } from "@/lib/hoan-content";
import projectImg from "@/assets/he_thong_truy_vet_tai_san.png";

const SERIF = "'EB Garamond', Georgia, serif";
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

export function ProjectsPage() {
  const project = projectsList[0];

  if (!project) return null;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 sm:px-8 lg:px-10">
      {/* ── Page heading ── */}
      <div className="mb-12 lg:mb-14">
        <span
          className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500"
          style={{ fontFamily: MONO }}
        >
          THỬ NGHIỆM &amp; DỰ ÁN
        </span>
        <h1
          className="mt-3 text-4xl leading-tight tracking-tight text-gray-900 md:text-5xl"
          style={{ fontFamily: SERIF, fontWeight: 400 }}
        >
          Projects &amp; Experiments
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-gray-600">
          Thử nghiệm trực quan hóa đồ thị giao dịch và truy vết dòng tài sản trên mạng lưới
          Ethereum.
        </p>
      </div>

      {/* ── Project entry: frameless, separated by hairline ── */}
      <section className="grid grid-cols-1 items-center gap-8 border-b border-gray-200/60 py-10 lg:grid-cols-12 lg:gap-12">
        {/* ── Left: copy (7 cols) — no frame ── */}
        <div className="flex flex-col lg:col-span-7">
          <div
            className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400"
            style={{ fontFamily: MONO }}
          >
            <span aria-hidden="true" className="h-[1px] w-6 shrink-0 bg-gray-300" />
            <span>01 / On-Chain Analytics</span>
          </div>

          <h2
            className="text-3xl leading-[1.15] tracking-tight text-gray-900 md:text-[2.5rem]"
            style={{ fontFamily: SERIF, fontWeight: 500 }}
          >
            Ethereum Fund Flow Explorer
          </h2>

          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-gray-600 md:text-base md:leading-[1.85]">
            {project.targetAudience}
          </p>

          {/* ── Row 1: Tech tags + status on one line ── */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs leading-5 text-gray-700"
              >
                {tech}
              </span>
            ))}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs leading-5 text-gray-700">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Launching soon
            </span>
          </div>

          {/* ── Row 2: CTAs — separated with generous breathing room ── */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span
              aria-disabled="true"
              className="inline-flex cursor-default items-center justify-center rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-medium text-gray-900 shadow-sm"
            >
              Launching soon
            </span>
            <a
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Theo dõi tiến độ
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        {/* ── Right: visual (5 cols) ── */}
        <div className="w-full lg:col-span-5">
          <div className="overflow-hidden rounded-2xl bg-[#0B0F19] shadow-md shadow-gray-900/10">
            <img
              src={projectImg}
              alt="Ethereum Fund Flow Explorer"
              className="block h-auto w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

