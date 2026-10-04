// Help.jsx - Persian help page for the dashboard.
// Edit the `widgetGuides` and `faqs` arrays below to change the content.

const widgetGuides = [
  {
    title: "فعالیت‌ها",
    steps: [
      "روی «+ اضافه کردن» بزنید، عنوان فعالیت را بنویسید و «افزودن» را بزنید.",
      "برای انجام‌شده علامت‌گذاشتن، تیک کنار فعالیت را بزنید.",
      "با آیکن سطل زباله، فعالیت حذف می‌شود.",
      "عدد بالای کارت نشان می‌دهد چند فعالیت از کل را انجام داده‌اید.",
    ],
  },
  {
    title: "یادداشت",
    steps: [
      "هر چه می‌خواهید در کادر بنویسید.",
      "زیر کادر، تعداد کاراکترها نمایش داده می‌شود.",
    ],
  },
  {
    title: "عادت‌ها",
    steps: [
      "تعداد روزهای متوالی ورود شما را نشان می‌دهد.",
      "دایره‌های هفته، روزهایی را که وارد شده‌اید پررنگ می‌کنند.",
    ],
  },
  {
    title: "آب و هوا",
    steps: [
      "روی «مکانی را انتخاب کنید» بزنید و نام شهر یا کشور را جستجو کنید (حداقل دو حرف).",
      "می‌توانید از مکان‌های پیشنهادی هم استفاده کنید.",
      "دما، حس‌شده، رطوبت و سرعت باد نمایش داده می‌شود.",
      "با «تغییر مکان» شهر دیگری انتخاب کنید.",
    ],
  },
  {
    title: "کارت مرور",
    steps: [
      "سوال را بنویسید؛ بعد از آن کادر پاسخ ظاهر می‌شود.",
      "پاسخ را بنویسید و «افزودن کارت» را بزنید.",
      "روی هر کارت کلیک کنید تا بین سوال و پاسخ جابه‌جا شود.",
      "حداکثر ۱۰۰ کارت می‌توانید داشته باشید.",
    ],
  },
  {
    title: "زمان تمرکز",
    steps: [
      "یکی از بازه‌های ۱۵، ۲۵، ۴۵ یا ۶۰ دقیقه را انتخاب کنید.",
      "«شروع» تایمر را روشن می‌کند و «مکث» آن را نگه می‌دارد.",
      "بعد از مکث، «ادامه» از همان‌جا ادامه می‌دهد.",
      "«بازنشانی» تایمر را به ابتدای بازه برمی‌گرداند.",
    ],
  },
];

const faqs = [
  {
    q: "چطور یک ویجت را پنهان یا دوباره نمایش دهم؟",
    a: "در نوار کناری، زیر «بخش‌های داشبورد»، تیک ویجت مورد نظر را بردارید یا بزنید. دکمه حذف بالای هر کارت هم همین کار را انجام می‌دهد.",
  },
  {
    q: "چطور حالت تاریک را روشن کنم؟",
    a: "در نوار کناری «تنظیمات» را باز کنید و بین «روشن» و «تاریک» یکی را انتخاب کنید.",
  },
  {
    q: "نوار کناری را چطور ببندم؟",
    a: "در دسکتاپ، دکمه فلش کنار «بخش‌های داشبورد» نوار را می‌بندد و فلش کنار صفحه آن را دوباره باز می‌کند. در موبایل از دکمه فهرست بالای صفحه استفاده کنید.",
  },
  {
    q: "چرا وضعیت آب و هوا نمایش داده نمی‌شود؟",
    a: "اول باید یک مکان انتخاب کنید. اگر بعد از انتخاب هم چیزی نیامد، اتصال اینترنت را بررسی کنید و دوباره امتحان کنید.",
  },
  {
    q: "چرا نمی‌توانم کارت مرور جدید اضافه کنم؟",
    a: "برای اضافه شدن کارت، هم سوال و هم پاسخ باید نوشته شده باشد. اگر ۱۰۰ کارت دارید، به سقف رسیده‌اید و باید یکی را پاک کنید.",
  },
];

export default function Help({ theme }) {
  return (
    <main
      className="dashboard-page"
      data-theme={theme}
      dir="rtl"
    >
      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <a
          href="/"
          className="text-sm text-current/70 hover:text-current focus-visible:underline"
        >
          بازگشت به داشبورد
        </a>

        <h1 className="mt-6 text-3xl font-bold">راهنمای داشبورد</h1>
        <p className="mt-3 max-w-prose leading-8 text-current/70">
          اینجا یاد می‌گیرید هر بخش داشبورد چه کاری انجام می‌دهد و چطور آن را
          به سلیقه خودتان تنظیم کنید.
        </p>

        <section className="mt-10" aria-labelledby="customize-title">
          <h2 id="customize-title" className="text-xl font-semibold">
            شخصی‌سازی داشبورد
          </h2>
          <ul className="mt-3 list-disc space-y-2 pr-5 leading-8 text-current/80">
            <li>
              در نوار کناری، بخش «بخش‌های داشبورد» را باز کنید و ویجت‌هایی را
              که می‌خواهید نمایش یا پنهان کنید تیک بزنید.
            </li>
            <li>در بخش «تنظیمات» حالت روشن یا تاریک را انتخاب کنید.</li>
            <li>در دسکتاپ می‌توانید کل نوار کناری را ببندید تا فضای بیشتری داشته باشید.</li>
          </ul>
        </section>

        <section className="mt-10" aria-labelledby="widgets-title">
          <h2 id="widgets-title" className="text-xl font-semibold">
            ویجت‌ها
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {widgetGuides.map((guide) => (
              <article
                key={guide.title}
                className="rounded-xl border border-current/15 p-5"
              >
                <h3 className="font-semibold">{guide.title}</h3>
                <ul className="mt-3 list-disc space-y-2 pr-5 text-sm leading-7 text-current/80">
                  {guide.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="faq-title">
          <h2 id="faq-title" className="text-xl font-semibold">
            سوالات متداول
          </h2>
          <div className="mt-4 divide-y divide-current/15 border-y border-current/15">
            {faqs.map((item) => (
              <details key={item.q} className="group py-4">
                <summary className="cursor-pointer list-none font-medium focus-visible:underline">
                  {item.q}
                </summary>
                <p className="mt-3 leading-8 text-current/80">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="support-title">
          <h2 id="support-title" className="text-xl font-semibold">
            هنوز مشکل دارید؟
          </h2>
          <p className="mt-3 leading-8 text-current/80">
            از بخش <a href="/support" className="underline text-blue-600">پشتیبانی</a> با ما در
            تماس باشید.
          </p>
        </section>
      </div>
    </main>
  );
}
