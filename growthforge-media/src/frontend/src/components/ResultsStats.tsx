import { useScrollAnimation } from "../hooks/useScrollAnimation";

const stats = [
  {
    value: "750+",
    label: "Leads Generated",
    sub: "Sample period results",
    color: "text-indigo-400",
  },
  {
    value: "$1.6M+",
    label: "Revenue Generated",
    sub: "For our client base",
    color: "text-green-400",
  },
  {
    value: "6,530%",
    label: "Average Campaign ROI",
    sub: "Across tracked campaigns",
    color: "text-amber-400",
  },
  {
    value: "18+ mo",
    label: "Average Client Tenure",
    sub: "92% retention rate",
    color: "text-cyan-400",
  },
];

export function ResultsStats() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 lg:py-28 gradient-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-4">
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                Proven Performance
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-700 text-white mb-4">
              Real Results, Real Businesses
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              These aren&apos;t cherry-picked results &mdash; they represent
              typical performance across our client base.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/8 transition-colors"
              >
                <div
                  className={`font-display text-4xl lg:text-5xl font-800 ${stat.color} mb-2`}
                >
                  {stat.value}
                </div>
                <div className="text-base font-semibold text-white mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-500">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
