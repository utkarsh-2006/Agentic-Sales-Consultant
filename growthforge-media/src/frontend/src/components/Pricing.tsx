import { useScrollAnimation } from "../hooks/useScrollAnimation";

const plans = [
  {
    name: "Starter",
    price: "$750-$1,250",
    period: "/mo total",
    adSpend: "$500-$1,000/mo",
    mgmtFee: "$250/mo",
    features: [
      "Facebook Ads only",
      "Basic Content Creation (4-6 posts/mo)",
      "Weekly Lead Reporting",
      "Monthly Strategy Call",
      "Audience Research & Setup",
    ],
    expected: "25-50 leads/mo at $15-25 CPL",
    commitment: "90-day minimum",
    popular: false,
    cta: "Get Started",
  },
  {
    name: "Growth",
    price: "$2,150-$3,900",
    period: "/mo total",
    adSpend: "$1,500-$3,000/mo",
    mgmtFee: "$600-$900/mo",
    features: [
      "Facebook Ads + Instagram Ads",
      "Lead Generation Funnels",
      "Professional Content (8-10 posts/mo)",
      "Bi-weekly Strategy Calls",
      "Advanced Audience Targeting",
      "A/B Testing & Optimization",
    ],
    expected: "60-150 leads/mo at $10-18 CPL",
    commitment: "6 months recommended",
    popular: true,
    cta: "Get Started",
  },
  {
    name: "Premium",
    price: "$4,000-$9,000+",
    period: "/mo total",
    adSpend: "$3,000-$7,000+/mo",
    mgmtFee: "$900-$1,500/mo",
    features: [
      "Everything in Growth +",
      "Professional Video (2-3 videos/mo)",
      "Complete Content Calendar (12-15 posts)",
      "CRM Integration & Lead Tracking",
      "Priority Support (4-hr response)",
      "Weekly Optimization Calls",
    ],
    expected: "150-350+ leads/mo at $8-15 CPL",
    commitment: "6-12 months recommended",
    popular: false,
    cta: "Get Started",
  },
];

export function Pricing() {
  const { ref, isVisible } = useScrollAnimation();

  const handleScroll = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 mb-4">
              <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                Pricing
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-700 text-slate-950 mb-4">
              Transparent,{" "}
              <span className="text-gradient">Performance-Based Pricing</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Pricing is split into{" "}
              <strong className="text-slate-700">Management Fee</strong> (paid
              to us) + <strong className="text-slate-700">Ad Spend</strong>{" "}
              (paid directly to Meta).
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mt-10">
            {plans.map((plan, i) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular
                    ? "bg-white popular-glow"
                    : "bg-white border border-slate-200 shadow-card hover:shadow-card-hover"
                }`}
                data-ocid={`pricing.item.${i + 1}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full gradient-brand text-white text-xs font-bold shadow-md">
                      <svg
                        aria-hidden="true"
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <div className="text-sm font-semibold text-slate-500 mb-1">
                    {plan.name}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-3xl font-800 text-slate-950">
                      {plan.price}
                    </span>
                    <span className="text-sm text-slate-400">
                      {plan.period}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    Ad Spend:{" "}
                    <span className="font-semibold text-slate-700">
                      {plan.adSpend}
                    </span>{" "}
                    &middot; Mgmt:{" "}
                    <span className="font-semibold text-slate-700">
                      {plan.mgmtFee}
                    </span>
                  </div>
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm text-slate-600"
                    >
                      <svg
                        aria-hidden="true"
                        className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0"
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
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mb-5 p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                  <div className="text-xs font-semibold text-indigo-700">
                    {plan.expected}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {plan.commitment}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleScroll}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 ${
                    plan.popular
                      ? "gradient-brand text-white shadow-md hover:opacity-90"
                      : "border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400"
                  }`}
                  data-ocid={`pricing.primary_button.${i + 1}`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Enterprise */}
          <div className="mt-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-display font-700 text-slate-900 mb-1">
                Enterprise &mdash; Custom Pricing
              </div>
              <div className="text-sm text-slate-500">
                For businesses with $10,000+/mo ad spend. Dedicated account
                manager, white-label options, and custom SLA.
              </div>
            </div>
            <button
              type="button"
              onClick={handleScroll}
              className="shrink-0 px-6 py-2.5 rounded-xl font-semibold text-sm gradient-brand text-white shadow-sm hover:opacity-90 transition-all"
              data-ocid="pricing.secondary_button"
            >
              Contact Us
            </button>
          </div>

          {/* Special offers */}
          <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg" aria-hidden="true">
                  🎁
                </span>
                <span className="font-semibold text-indigo-800">
                  First month 50% off
                </span>
                <span className="text-slate-500">management fee</span>
              </div>
              <span className="hidden sm:block text-slate-300">|</span>
              <div className="flex items-center gap-2">
                <span className="text-lg" aria-hidden="true">
                  👥
                </span>
                <span className="font-semibold text-indigo-800">
                  $500 referral credit
                </span>
                <span className="text-slate-500">per client</span>
              </div>
              <span className="hidden sm:block text-slate-300">|</span>
              <div className="flex items-center gap-2">
                <span className="text-lg" aria-hidden="true">
                  📅
                </span>
                <span className="font-semibold text-indigo-800">
                  10% discount
                </span>
                <span className="text-slate-500">annual commitment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
