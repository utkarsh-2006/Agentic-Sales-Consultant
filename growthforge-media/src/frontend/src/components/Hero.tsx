import { useScrollAnimation } from "../hooks/useScrollAnimation";

const stats = [
  { value: "150+", label: "Clients Served" },
  { value: "92%", label: "Client Retention" },
  { value: "3-5x", label: "Avg Lead Increase" },
  { value: "35-50%", label: "CPL Reduction" },
];

const barData = [
  { id: "w1", h: 40 },
  { id: "w2", h: 55 },
  { id: "w3", h: 45 },
  { id: "w4", h: 70 },
  { id: "w5", h: 65 },
  { id: "w6", h: 88 },
  { id: "w7", h: 95 },
  { id: "w8", h: 78 },
  { id: "w9", h: 105 },
  { id: "w10", h: 98 },
  { id: "w11", h: 115 },
  { id: "w12", h: 128 },
];

export function Hero() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  const handleScroll = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden gradient-hero">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-indigo-100/60 blur-3xl" />
        <div className="absolute top-20 -left-40 w-[400px] h-[400px] rounded-full bg-blue-100/40 blur-3xl" />
      </div>

      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div>
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 mb-6">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                Meta Blueprint Certified Agency
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-800 text-slate-950 leading-tight mb-6">
              Turn Facebook Ads Into a{" "}
              <span className="text-gradient">Predictable Lead Machine</span>{" "}
              for Your Local Business
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
              We help local businesses generate{" "}
              <strong className="text-slate-800">
                20-150+ qualified leads per month
              </strong>{" "}
              through strategic Facebook &amp; Instagram advertising &mdash;
              without wasting money on ineffective marketing.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <button
                type="button"
                onClick={() => handleScroll("#contact")}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white gradient-brand rounded-2xl hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-glow"
                data-ocid="hero.primary_button"
              >
                Get Free Strategy Session
                <svg
                  aria-hidden="true"
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleScroll("#case-studies")}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-indigo-700 bg-white border-2 border-indigo-200 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200"
                data-ocid="hero.secondary_button"
              >
                See Our Results
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <div className="text-2xl font-display font-800 text-gradient">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Dashboard mockup */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 p-6 glow-ring">
              {/* Dashboard header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm font-semibold text-slate-700">
                    Campaign Dashboard
                  </div>
                  <div className="text-xs text-slate-400">
                    Live metrics &middot; Last 30 days
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-xs font-semibold text-green-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Active
                </span>
              </div>

              {/* Metric cards */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-indigo-50 rounded-xl p-4">
                  <div className="text-xs text-slate-500 mb-1">Total Leads</div>
                  <div className="text-2xl font-display font-700 text-indigo-700">
                    847
                  </div>
                  <div className="text-xs text-green-600 font-medium mt-1">
                    &uarr; 34% vs last month
                  </div>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="text-xs text-slate-500 mb-1">
                    Cost Per Lead
                  </div>
                  <div className="text-2xl font-display font-700 text-green-700">
                    $12.40
                  </div>
                  <div className="text-xs text-green-600 font-medium mt-1">
                    &darr; 41% reduction
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-xs text-slate-500 mb-1">Ad Spend</div>
                  <div className="text-2xl font-display font-700 text-blue-700">
                    $10,500
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-1">
                    This month
                  </div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-xs text-slate-500 mb-1">
                    Est. Revenue
                  </div>
                  <div className="text-2xl font-display font-700 text-purple-700">
                    $186K
                  </div>
                  <div className="text-xs text-green-600 font-medium mt-1">
                    &uarr; 18x ROAS
                  </div>
                </div>
              </div>

              {/* Mini bar chart */}
              <div>
                <div className="text-xs font-medium text-slate-500 mb-2">
                  Weekly Lead Volume
                </div>
                <div className="flex items-end gap-1.5 h-14">
                  {barData.map((bar) => (
                    <div
                      key={bar.id}
                      className="flex-1 rounded-t gradient-brand opacity-80 hover:opacity-100 transition-opacity"
                      style={{ height: `${(bar.h / 128) * 100}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Campaign row */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Top Campaign: Plumbing &mdash; Denver
                  </span>
                  <span className="font-semibold text-indigo-600">
                    ROI: 1,928%
                  </span>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800">
                    12 new leads today
                  </div>
                  <div className="text-xs text-slate-400">
                    SafeFlow Plumbing, Denver
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
