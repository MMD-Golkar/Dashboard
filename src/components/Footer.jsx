// Footer.jsx - theme-aware, Persian, slim dashboard footer (placeholder data).
// Edit `footerData` to change everything.

const footerData = {
  appName: "داشبورد",
  year: "۱۴۰۵",
  version: "v1.0.0",
  lastSynced: "11 مهر 1405",
  status: "degraded", // "online" | "degraded" | "offline"
  links: [
    { label: "راهنما", href: "/help" },
    { label: "پشتیبانی", href: "/support" },
    { label: "حریم خصوصی", href: "/privacy" },
    { label: "قوانین", href: "/terms" },
  ],
};

const statusStyles = {
  online: { dot: "bg-green-500", text: "همه سرویس‌ها فعال هستند" },
  degraded: { dot: "bg-yellow-500", text: "برخی سرویس‌ها کند هستند" },
  offline: { dot: "bg-red-500", text: "سرویس در دسترس نیست" },
};

export default function Footer() {
  const { appName, year, version, lastSynced, status, links } = footerData;
  const s = statusStyles[status];

  return (
    <footer
      dir="rtl"
      className="border-t border-current/15 text-xs text-current/70 pb-10"
    >
      <div className="mx-auto flex w-full max-w-360 flex-col gap-2 px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>
            © {year} {appName}
          </span>
          <span dir="ltr">{version}</span>
          <span>آخرین همگام‌سازی: {lastSynced}</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-current focus-visible:underline"
            >
              {link.label}
            </a>
          ))}
          <span className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${s.dot}`} />
            {s.text}
          </span>
        </div>
      </div>
    </footer>
  );
}
