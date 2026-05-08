import { useState } from "react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const faqs = [
  {
    q: "How much do your services cost?",
    a: "Our pricing has two components: a Management Fee ($250-$1,500/mo based on ad spend level) plus your Ad Spend (paid directly to Facebook/Meta). Example: $2,000 ad spend + $600 management fee = $2,600/mo total. No hidden fees.",
  },
  {
    q: "What's your minimum investment?",
    a: "Our minimum is $250/mo management fee + $500-$1,000/mo ad spend. However, we strongly recommend $1,000-$1,500/mo total for meaningful results. Lower budgets can work but results take longer to achieve and optimize.",
  },
  {
    q: "How long until I see results?",
    a: "Week 1: Ads go live, Facebook collects initial data. Weeks 2-3: First significant leads and initial optimizations. Month 2: 20-30% improvement in cost per lead. Month 3+: Optimal performance with fully optimized campaigns.",
  },
  {
    q: "Do you guarantee results?",
    a: "Yes - our 90-Day Performance Guarantee means if we don't hit agreed metrics after 90 days, we continue working at 50% management fee until we do. We put our money where our mouth is.",
  },
  {
    q: "What's included in Facebook Ads management?",
    a: "Complete end-to-end management: campaign strategy, ad creative development, audience research, pixel setup, daily monitoring, weekly A/B testing, audience segmentation, performance reporting, and regular strategy calls.",
  },
  {
    q: "How many leads should I expect?",
    a: "Depends on your industry and budget. With a $1,500 budget: Local services (plumbing, HVAC): 60-100 leads/mo. Professional services (dentists, lawyers): 30-50 leads/mo. Fitness studios: 60-100 leads/mo. Real estate: 25-40 leads/mo.",
  },
  {
    q: "Do you work with e-commerce?",
    a: "We can, but our specialty is local and service-based businesses with high customer lifetime value. If you're in e-commerce, we'll give you an honest assessment of whether we're the best fit or if you'd be better served by a specialized e-com agency.",
  },
  {
    q: "Can I pause or cancel anytime?",
    a: "Starter plan: 30-day notice required. Growth and Premium plans: 60-90 day notice. There are no early termination fees - we don't believe in locking clients in contracts when results should speak for themselves.",
  },
  {
    q: "How are you different from other agencies?",
    a: "Four key differences: (1) We specialize in local businesses only - no diluted expertise. (2) We focus on lead generation, not vanity metrics. (3) Full transparency - you see all campaign data. (4) 90-day guarantee backed by 150+ proven client results.",
  },
  {
    q: "Why not use Google Ads instead?",
    a: "Facebook is best for local targeting, brand awareness, and behavioral targeting - reaching people before they search. Google is best for capturing existing search intent. Both can work together. We'll recommend the right mix for your specific goals.",
  },
  {
    q: "What if the leads aren't converting into customers?",
    a: "Common causes: sales process issues, lead quality, or offer mismatch. We adjust targeting and messaging to improve lead quality, provide lead qualification scripts, and offer sales process coaching to help you close more of the leads we generate.",
  },
  {
    q: "Can I see my campaign data in real-time?",
    a: "Yes. All clients get live dashboard access showing all campaign metrics, ad performance, lead volume, cost per lead, and ROI estimates. You also get custom weekly reports and real-time lead tracking notifications.",
  },
];

export function FAQ() {
  const { ref, isVisible } = useScrollAnimation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 mb-4">
              <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                FAQ
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-700 text-slate-950 mb-4">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-lg text-slate-500">
              Everything you need to know before getting started.
            </p>
          </div>

          <div className="space-y-3" data-ocid="faq.list">
            {faqs.map((faq, i) => (
              <div
                key={faq.q}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs"
                data-ocid={`faq.item.${i + 1}`}
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                  data-ocid={`faq.toggle.${i + 1}`}
                >
                  <span className="font-semibold text-slate-900 pr-4">
                    {faq.q}
                  </span>
                  <svg
                    aria-hidden="true"
                    className={`w-5 h-5 text-indigo-500 shrink-0 transition-transform duration-300 ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openIndex === i && (
                  <div className="px-6 pb-5">
                    <p className="text-slate-600 leading-relaxed text-sm">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
