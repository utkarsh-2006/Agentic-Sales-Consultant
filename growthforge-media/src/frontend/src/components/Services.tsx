import { useScrollAnimation } from "../hooks/useScrollAnimation";

const services = [
  {
    icon: (
      <svg
        aria-hidden="true"
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="2" x2="12" y2="8" strokeLinecap="round" />
        <line x1="12" y1="16" x2="12" y2="22" strokeLinecap="round" />
        <line x1="2" y1="12" x2="8" y2="12" strokeLinecap="round" />
        <line x1="16" y1="12" x2="22" y2="12" strokeLinecap="round" />
      </svg>
    ),
    color: "text-indigo-600 bg-indigo-50",
    title: "Facebook Ads",
    desc: "Strategic paid advertising to generate qualified local leads.",
    detail:
      "Cost per lead: $5-$25 depending on industry. 70%+ leads ready for sales conversations.",
    badge: "Core Service",
  },
  {
    icon: (
      <svg
        aria-hidden="true"
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
    color: "text-pink-600 bg-pink-50",
    title: "Instagram Ads",
    desc: "Visual-first advertising through Stories, Reels & Carousels.",
    detail:
      "Often cheaper than Facebook. Best for fitness, beauty & real estate businesses.",
    badge: "Visual Growth",
  },
  {
    icon: (
      <svg
        aria-hidden="true"
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path
          d="M3 6h18M8 6V4h8v2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="3" y="6" width="18" height="14" rx="2" />
        <path d="M12 11v5M9 14h6" strokeLinecap="round" />
      </svg>
    ),
    color: "text-blue-600 bg-blue-50",
    title: "Lead Generation Funnels",
    desc: "End-to-end systems: landing pages, email sequences, CRM integration.",
    detail:
      "15-40% landing page conversion rate. Automated follow-up sequences included.",
    badge: "High-Converting",
  },
  {
    icon: (
      <svg
        aria-hidden="true"
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M12 20h9" strokeLinecap="round" />
        <path
          d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    color: "text-emerald-600 bg-emerald-50",
    title: "Content Creation",
    desc: "30-90 day content calendars, video editing, Reels, graphic design.",
    detail:
      "3-8x engagement rate increase within 90 days. Professional branded content.",
    badge: "Brand Building",
  },
  {
    icon: (
      <svg
        aria-hidden="true"
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <polyline
          points="22 12 18 12 15 21 9 3 6 12 2 12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    color: "text-amber-600 bg-amber-50",
    title: "Ad Optimization",
    desc: "Daily monitoring, A/B testing, audience segmentation for max ROI.",
    detail:
      "20-50% cost per lead reduction over first 90 days of optimization.",
    badge: "Performance",
  },
];

export function Services() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="services" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 mb-4">
              <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                Our Services
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-700 text-slate-950 mb-4">
              Everything You Need to Generate{" "}
              <span className="text-gradient">Qualified Leads</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              A complete suite of services designed specifically for local
              businesses ready to scale.
            </p>
          </div>

          {/* 3+2 grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
            {services.slice(0, 3).map((svc) => (
              <ServiceCard key={svc.title} svc={svc} />
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto lg:max-w-none lg:grid-cols-2 lg:w-2/3 lg:mx-auto">
            {services.slice(3).map((svc) => (
              <ServiceCard key={svc.title} svc={svc} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ svc }: { svc: (typeof services)[0] }) {
  return (
    <div className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${svc.color}`}
        >
          {svc.icon}
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
          {svc.badge}
        </span>
      </div>
      <h3 className="font-display text-lg font-600 text-slate-900 mb-2">
        {svc.title}
      </h3>
      <p className="text-sm text-slate-600 mb-3 leading-relaxed">{svc.desc}</p>
      <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
        {svc.detail}
      </p>
    </div>
  );
}
