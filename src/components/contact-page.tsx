import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { ArrowUpRight, CheckCircle2, Linkedin, Mail, Send } from "lucide-react";
import { hoanProfile } from "@/lib/hoan-content";

const SERIF = "'EB Garamond', Georgia, serif";
const SANS = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

// Preserved per rule — original GAS destinations kept as best-effort mirror.
const gasEndpoints = {
  message:
    "https://script.google.com/macros/s/AKfycbx30UtQAsPZZJytBtFjrtUZKwIatUWW8rfkABL6z037MdLDZ9_bQxVRYOGHe6fc68lHjg/exec",
  notify:
    "https://script.google.com/macros/s/AKfycbzYUixoBzb_zX_smGF7Ug5Trdh4FCwDL2SoOPQeM34Pe1sNF8S4EDP4wTMQGsc-2ea4/exec",
};

const turnstileSiteKey =
  (import.meta.env["VITE_TURNSTILE_SITE_KEY"] as string | undefined)?.trim() ||
  "1x00000000000000000000AA";

const inputClass =
  "w-full bg-white border border-gray-200/80 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-0 transition-colors [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset]";
const labelClass = "mb-1.5 block text-[13px] font-medium text-gray-700";

function XIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M18.9 2h3.2l-7 8 8.2 12h-6.4l-5-7.3L5.5 22H2.3l7.5-8.6L1.9 2h6.6l4.5 6.7L18.9 2Zm-1.1 18h1.8L7.5 4H5.6l12.2 16Z" />
    </svg>
  );
}

export function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [turnstileToken, setTurnstileToken] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  function update(field: keyof typeof formData) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");
    const name = formData.name.trim();
    const email = formData.email.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();
    if (!name || !email || !message) {
      setErrorMsg("Vui lòng điền đầy đủ họ tên, email và nội dung lời nhắn.");
      return;
    }
    if (!turnstileToken) {
      setErrorMsg("Vui lòng hoàn thành xác minh bảo mật (Turnstile) trước khi gửi.");
      return;
    }
    // Read fresh at submit time so .env.local changes (after dev restart) are honored.
    const web3formsAccessKey = import.meta.env["VITE_WEB3FORMS_ACCESS_KEY"] as string | undefined;
    if (!web3formsAccessKey?.trim()) {
      setErrorMsg("Không gửi được lúc này. Vui lòng liên hệ trực tiếp qua hoanvuonxoai@gmail.com.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: web3formsAccessKey,
          name,
          email,
          subject: subject || "Lời nhắn mới từ Portfolio Hoan Duong",
          message,
          "cf-turnstile-response": turnstileToken,
          from_name: "Portfolio Hoan Duong",
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
      } | null;
      if (!res.ok || !data?.success)
        throw new Error(data?.message || "Không gửi được. Vui lòng thử lại.");
      try {
        void fetch(gasEndpoints.message, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ name, email, subject, message, source: "web3forms-primary" }),
        });
      } catch {
        /* mirror best-effort only */
      }
      setSent(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTurnstileToken("");
      turnstileRef.current?.reset();
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Không thể gửi lời nhắn. Vui lòng gửi email trực tiếp tới hoanvuonxoai@gmail.com.",
      );
    } finally {
      setSending(false);
    }
  }

  const submitDisabled = sending || !turnstileToken;

  return (
    <main className="w-full bg-white" style={{ fontFamily: SANS }}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-12 max-w-6xl mx-auto px-4">
        {/* LEFT — 5 cols */}
        <section className="lg:col-span-5">
          <p
            className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2"
            style={{ fontFamily: MONO }}
          >
            Kết nối và liên hệ
          </p>
          <h1 className="text-3xl font-normal text-gray-900 mb-3" style={{ fontFamily: SERIF }}>
            Liên hệ với Hoan Duong
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed mb-8">
            Bạn có thể liên hệ trực tiếp qua email, kết nối trên LinkedIn, X hoặc để lại lời nhắn
            qua biểu mẫu bên cạnh.
          </p>

          <div className="space-y-4">
            <a
              href={`mailto:${hoanProfile.social.email}`}
              aria-label={`Gửi email đến ${hoanProfile.social.email}`}
              className="flex items-start gap-4 rounded-xl border-none bg-gray-50/50 p-4 transition-colors hover:bg-gray-100/60"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm">
                <Mail size={17} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1 leading-relaxed">
                <span className="block text-xs font-medium uppercase tracking-wider text-gray-400">
                  Email
                </span>
                <span className="mt-1.5 block break-all text-sm font-medium leading-6 text-gray-900">
                  {hoanProfile.social.email}
                </span>
                <span className="mt-1.5 inline-flex items-center gap-1 text-xs leading-5 text-gray-500">
                  Mở trình gửi mail <ArrowUpRight size={13} aria-hidden="true" />
                </span>
              </span>
            </a>

            <a
              href={hoanProfile.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Mở hồ sơ LinkedIn của Hoan Duong (mở tab mới)"
              className="flex items-start gap-4 rounded-xl border-none bg-gray-50/50 p-4 transition-colors hover:bg-gray-100/60"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm">
                <Linkedin size={17} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1 leading-relaxed">
                <span className="block text-xs font-medium uppercase tracking-wider text-gray-400">
                  LinkedIn
                </span>
                <span className="mt-1.5 block break-all text-sm font-medium leading-6 text-gray-900">
                  linkedin.com/in/hoanduongg
                </span>
                <span className="mt-1.5 inline-flex items-center gap-1 text-xs leading-5 text-gray-500">
                  Xem trang cá nhân <ArrowUpRight size={13} aria-hidden="true" />
                </span>
              </span>
            </a>

            <a
              href={hoanProfile.social.x}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Mở tài khoản X @0xQuzazzz (mở tab mới)"
              className="flex items-start gap-4 rounded-xl border-none bg-gray-50/50 p-4 transition-colors hover:bg-gray-100/60"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm">
                <XIcon size={15} />
              </span>
              <span className="min-w-0 flex-1 leading-relaxed">
                <span className="block text-xs font-medium uppercase tracking-wider text-gray-400">
                  X (Twitter)
                </span>
                <span className="mt-1.5 block break-all text-sm font-medium leading-6 text-gray-900">
                  x.com/0xQuzazzz
                </span>
                <span className="mt-1.5 inline-flex items-center gap-1 text-xs leading-5 text-gray-500">
                  Theo dõi trên X <ArrowUpRight size={13} aria-hidden="true" />
                </span>
              </span>
            </a>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <p className="text-xs leading-6 text-gray-500">{hoanProfile.university}</p>
            <p className="mt-1 text-xs text-gray-400">{hoanProfile.location}</p>
          </div>
        </section>

        {/* RIGHT — 7 cols */}
        <section className="lg:col-span-7">
          <div className="bg-gray-50/60 p-6 sm:p-8 rounded-2xl border border-gray-100/80 shadow-sm">
            <h2 className="text-xl font-normal text-gray-900" style={{ fontFamily: SERIF }}>
              Gửi lời nhắn
            </h2>
            <p className="mt-1.5 text-sm leading-6 text-gray-600">
              Có ý tưởng hoặc muốn trao đổi về dự án web? Để lại thông tin để mình tiện phản hồi
              nhé.
            </p>

            {sent ? (
              <div
                role="status"
                className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50/60 p-5"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Đã gửi lời nhắn thành công!</p>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Cảm ơn bạn đã liên hệ. Mình sẽ phản hồi qua email trong thời gian sớm nhất.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSent(false)}
                      className="mt-3 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Gửi lời nhắn khác
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className={labelClass}>
                      Họ và tên *
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      value={formData.name}
                      onChange={update("name")}
                      placeholder="Nguyễn Văn A"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className={labelClass}>
                      Email nhận phản hồi *
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={formData.email}
                      onChange={update("email")}
                      placeholder="email@domain.com"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-subject" className={labelClass}>
                    Chủ đề
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={update("subject")}
                    placeholder="Ví dụ: Trao đổi dự án / Hợp tác"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className={labelClass}>
                    Nội dung lời nhắn *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={update("message")}
                    placeholder="Chia sẻ đôi điều với Hoan Duong..."
                    className={`${inputClass} min-h-[120px] resize-none`}
                  />
                </div>
                <input
                  type="checkbox"
                  name="botcheck"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />
                <div className="space-y-4 pt-1">
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={turnstileSiteKey}
                    options={{ theme: "light" }}
                    onSuccess={(token) => setTurnstileToken(token)}
                    onExpire={() => setTurnstileToken("")}
                    onError={() => setTurnstileToken("")}
                  />
                  {errorMsg && (
                    <p role="alert" className="text-sm leading-6 text-red-600">
                      {errorMsg}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={submitDisabled}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    <Send size={15} aria-hidden="true" />
                    {sending ? "Đang gửi..." : "Gửi lời nhắn"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
