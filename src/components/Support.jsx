// The form opens the user's email app with the message filled in (no backend needed).
// Change SUPPORT_EMAIL to your real address.

import { useState } from "react";

const SUPPORT_EMAIL = "mohammadgolkar21@gmail.com";

const topics = ["مشکل فنی", "پیشنهاد", "سوال درباره ویجت‌ها", "سایر"];

const inputClass =
  "mt-2 w-full rounded-lg border border-current/20 bg-transparent px-3 py-2 text-sm placeholder:text-current/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

export default function Support({ theme }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(topics[0]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    const subject = `[${topic}] پیام از ${name}`;
    const body = `${message}\n\n---\nنام: ${name}\nایمیل: ${email}`;

    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
  }

  return (
    <main className="dashboard-page" data-theme={theme} dir="rtl">
      <div className="mx-auto w-full max-w-2xl px-6 py-10">
        <a
          href="/dashboard"
          className="text-sm text-current/70 hover:text-current focus-visible:underline"
        >
          بازگشت به داشبورد
        </a>

        <h1 className="mt-6 text-3xl font-bold">پشتیبانی</h1>
        <p className="mt-3 max-w-prose leading-8 text-current/70">
          مشکلی پیش آمده یا پیشنهادی دارید؟ پیام خود را بنویسید تا بررسی کنیم.
        </p>

        <section
          className="mt-8 rounded-xl border border-current/15 p-5"
          aria-labelledby="before-title"
        >
          <h2 id="before-title" className="font-semibold">
            قبل از ارسال پیام
          </h2>
          <ul className="mt-3 list-disc space-y-2 pr-5 text-sm leading-7 text-current/80">
            <li>
              جواب خیلی از سوال‌ها در{" "}
              <a href="/help" className="underline">
                صفحه راهنما
              </a>{" "}
              هست.
            </li>
            <li>صفحه را یک بار دوباره بارگذاری کنید.</li>
            <li>اتصال اینترنت خود را بررسی کنید.</li>
          </ul>
        </section>

        <section className="mt-10" aria-labelledby="contact-title">
          <h2 id="contact-title" className="text-xl font-semibold">
            ارسال پیام
          </h2>

          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="support-name" className="text-sm font-medium">
                نام
              </label>
              <input
                id="support-name"
                className={inputClass}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="نام خود را وارد کنید"
                required
              />
            </div>

            <div>
              <label htmlFor="support-email" className="text-sm font-medium">
                ایمیل
              </label>
              <input
                id="support-email"
                className={inputClass}
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="support-topic" className="text-sm font-medium">
                موضوع
              </label>
              <select
                id="support-topic"
                className={inputClass}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                {topics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="support-message" className="text-sm font-medium">
                پیام
              </label>
              <textarea
                id="support-message"
                className={inputClass}
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="مشکل را توضیح دهید. اگر خطایی دیدید، متن آن را بنویسید."
                required
              />
            </div>

            <button
              type="submit"
              className="rounded-lg border border-current/30 px-5 py-2 text-sm font-medium hover:bg-current/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              ارسال پیام
            </button>

            {sent && (
              <p className="text-sm leading-7 text-current/80" role="status">
                برنامه ایمیل شما باز شد. پیام را در آن ارسال کنید. اگر باز
                نشد، مستقیم به {SUPPORT_EMAIL} ایمیل بزنید.
              </p>
            )}
          </form>
        </section>

        <p className="mt-10 text-sm leading-7 text-current/60">
          زمان پاسخ‌گویی معمولاً ۱ تا ۲ روز کاری است.
        </p>
      </div>
    </main>
  );
}
