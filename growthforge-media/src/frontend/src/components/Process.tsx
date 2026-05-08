import { useScrollAnimation } from "../hooks/useScrollAnimation";

const steps = [
  {
    number: "01",
    title: "Free Consultation",
    desc: "15-30 minute call to understand your business, goals, and target customers. No hard sell - just honest conversation about your options.",
    color: "bg-indigo-600",
  },
  {
    number: "02",
    title: "Strategy Session",
    desc: "We analyze your market, competitors, and ideal customer profile. Build a winning campaign plan with clear, measurable targets.",
    color: "bg-blue-600",
  },
  {
    number: "03",
    title: "Campaign Launch",
    desc: "Campaigns go live within 2-3 weeks. We handle all setup, creative development, audience targeting, and technical configuration.",
    color: "bg-indigo-500",
  },
  {
    number: "04",
    title: "Optimize & Scale",
    desc: "Daily monitoring, weekly optimization. Cost per lead drops 40-60% by month 3 as we refine targeting and creative performance.",
    color: "bg-blue-500",
  },
];

export function Process() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="process" className="py-20 lg:py-28 bg-white">
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
                Our Process
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-700 text-slate-950 mb-4">
              Your Path to{" "}
              <span className="text-gradient">Predictable Lead Flow</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              A proven 4-step system that takes you from zero to consistent lead
              generation.
            </p>
          </div>

          {/* Horizontal stepper */}
          <div className="relative">
            {/* Connector line (desktop) */}
            <div
              className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-slate-200"
              style={{ left: "10%", right: "10%" }}
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, i) => (
                <div
                  key={step.number}
                  className="relative flex flex-col items-center text-center"
                  data-ocid={`process.item.${i + 1}`}
                >
                  <div
                    className={`relative z-10 w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center text-white font-display font-700 text-lg mb-5 shadow-md`}
                  >
                    {step.number}
                  </div>
                  <h3 className="font-display text-lg font-600 text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantee box */}
          <div className="mt-12 p-6 lg:p-8 rounded-2xl bg-indigo-50 border-2 border-indigo-200 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-display text-xl font-700 text-indigo-900">
                90-Day Performance Guarantee
              </h3>
            </div>
            <p className="text-slate-600 max-w-2xl mx-auto">
              If we don&apos;t hit agreed metrics after 90 days, we continue
              working at{" "}
              <strong className="text-indigo-700">50% management fee</strong>{" "}
              until we do. That&apos;s how confident we are in our process.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
