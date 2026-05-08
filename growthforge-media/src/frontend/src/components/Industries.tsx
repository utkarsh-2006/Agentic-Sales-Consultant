import { useScrollAnimation } from "../hooks/useScrollAnimation";

const industries = [
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
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
        <polyline
          points="9 22 9 12 15 12 15 22"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Local Services",
    pct: "45%",
    desc: "Plumbing, HVAC, Electrical, Roofing, Cleaning",
    color: "text-indigo-600 bg-indigo-50",
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
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
        />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <line x1="9" y1="12" x2="15" y2="12" strokeLinecap="round" />
        <line x1="9" y1="16" x2="13" y2="16" strokeLinecap="round" />
      </svg>
    ),
    title: "Professional Services",
    pct: "25%",
    desc: "Dentists, Chiropractors, CPAs, Law Firms",
    color: "text-blue-600 bg-blue-50",
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
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
    title: "Fitness & Wellness",
    pct: "20%",
    desc: "Personal Trainers, CrossFit, Yoga Studios",
    color: "text-pink-600 bg-pink-50",
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
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10" />
      </svg>
    ),
    title: "Real Estate",
    pct: "10%",
    desc: "Agents, Teams, Property Management",
    color: "text-emerald-600 bg-emerald-50",
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
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 3h14M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2M5 3l7 9 7-9"
        />
      </svg>
    ),
    title: "Beauty & Wellness",
    pct: "",
    desc: "Salons, Spas, Esthetic Services",
    color: "text-purple-600 bg-purple-50",
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
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    title: "Automotive",
    pct: "",
    desc: "Detailing, Repair Shops, Dealerships",
    color: "text-amber-600 bg-amber-50",
  },
];

export function Industries() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 mb-4">
              <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                Specializations
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-700 text-slate-950 mb-4">
              Industries We <span className="text-gradient">Specialize In</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Deep expertise in the verticals where Facebook &amp; Instagram Ads
              deliver the strongest ROI.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {industries.map((ind, i) => (
              <div
                key={ind.title}
                className="flex items-start gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
                data-ocid={`industries.item.${i + 1}`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${ind.color}`}
                >
                  {ind.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-display text-base font-600 text-slate-900">
                      {ind.title}
                    </span>
                    {ind.pct && (
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                        {ind.pct}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">{ind.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
