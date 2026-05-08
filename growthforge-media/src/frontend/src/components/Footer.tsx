const currentYear = new Date().getFullYear();

const footerCols = [
  {
    title: "Services",
    links: [
      "Facebook Ads",
      "Instagram Ads",
      "Lead Gen Funnels",
      "Content Creation",
      "Ad Optimization",
    ],
  },
  {
    title: "Industries",
    links: [
      "Local Services",
      "Professional Services",
      "Fitness & Wellness",
      "Real Estate",
      "Beauty & Wellness",
    ],
  },
  {
    title: "Company",
    links: ["About", "Case Studies", "Pricing", "FAQ", "Blog"],
  },
  {
    title: "Contact",
    links: ["info@growthforgemedia.com", "Mon-Fri, 9am-6pm EST"],
  },
];

const certs = [
  "Meta Blueprint Certified",
  "Facebook Marketing Partner",
  "Google Partner",
  "GDPR & CCPA Compliant",
];

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-14 grid sm:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand column */}
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center shadow-sm">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5 text-white"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M12 2C8 2 5 5.5 5 9c0 2.5 1.2 4.7 3 6l1 5h6l1-5c1.8-1.3 3-3.5 3-6 0-3.5-3-7-7-7z"
                    fill="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M9 20h6" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-display font-700 text-lg">
                GrowthForge <span className="text-indigo-400">Media</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Predictable leads for local businesses. We specialize in Facebook
              &amp; Instagram Ads that generate real results.
            </p>
            <div className="flex gap-3">
              {["F", "in", "X"].map((social) => (
                <div
                  key={social}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-indigo-600 flex items-center justify-center text-xs font-bold cursor-pointer transition-colors"
                >
                  {social}
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerCols.map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm text-white mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <span className="text-slate-400 text-sm">{link}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="py-5 border-t border-slate-800">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {certs.map((cert) => (
              <span
                key={cert}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500"
              >
                <svg
                  aria-hidden="true"
                  className="w-3.5 h-3.5 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {cert}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-sm">
            &copy; {currentYear} GrowthForge Media. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">
            Built with &hearts; using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 hover:text-indigo-400 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
