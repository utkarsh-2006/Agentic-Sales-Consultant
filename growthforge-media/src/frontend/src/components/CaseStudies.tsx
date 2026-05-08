import { useScrollAnimation } from "../hooks/useScrollAnimation";

const caseStudies = [
  {
    client: "SafeFlow Plumbing",
    location: "Denver, CO",
    industry: "Plumbing & HVAC",
    timeline: "6 months",
    investment: "$8,400",
    revenue: "$162,000",
    roi: "1,928%",
    leads: "412",
    quote:
      "Before GrowthForge, I never knew when my next customer was coming. Now I have more customers than I can handle.",
    author: "John Martinez",
    initials: "JM",
    color: "bg-indigo-100 text-indigo-700",
    roiColor: "bg-green-100 text-green-700",
  },
  {
    client: "Bright Smile Cosmetic Dentistry",
    location: "Austin, TX",
    industry: "Dental Practices",
    timeline: "4 months",
    investment: "$3,800",
    revenue: "$409,500",
    roi: "10,751%",
    leads: "121",
    quote:
      "We went from struggling to find new patients to having a waiting list. The ROI is insane.",
    author: "Dr. Sarah Chen",
    initials: "SC",
    color: "bg-blue-100 text-blue-700",
    roiColor: "bg-green-100 text-green-700",
  },
  {
    client: "TechGrow Marketing",
    location: "Phoenix, AZ",
    industry: "Professional Services",
    timeline: "5 months",
    investment: "$4,600",
    revenue: "$270,000+",
    roi: "5,870%",
    leads: "675",
    quote:
      "The funnel system GrowthForge built is still generating leads months after the initial ads ran.",
    author: "Michael Rodriguez",
    initials: "MR",
    color: "bg-purple-100 text-purple-700",
    roiColor: "bg-green-100 text-green-700",
  },
  {
    client: "Lakeside Realty Team",
    location: "Colorado Springs, CO",
    industry: "Real Estate",
    timeline: "6 months",
    investment: "$4,800",
    revenue: "$420,000",
    roi: "8,300%",
    leads: "78",
    quote:
      "We had to raise our minimum listing price because we're so selective now.",
    author: "Jennifer Hayes",
    initials: "JH",
    color: "bg-emerald-100 text-emerald-700",
    roiColor: "bg-green-100 text-green-700",
  },
  {
    client: "StrengthWear",
    location: "Los Angeles, CA",
    industry: "Fitness & Wellness",
    timeline: "3 months",
    investment: "Ad Optimization",
    revenue: "ROAS: 4.1x (was 1.2x)",
    roi: "43% CAC Drop",
    leads: "CAC: $35 to $20",
    quote:
      "GrowthForge turned it around in one month. We're now profitable on ad spend.",
    author: "Alex Chen",
    initials: "AC",
    color: "bg-amber-100 text-amber-700",
    roiColor: "bg-amber-100 text-amber-700",
  },
];

export function CaseStudies() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="case-studies" className="py-20 lg:py-28 bg-slate-50">
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
                Client Success Stories
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-700 text-slate-950 mb-4">
              Proven Results Across{" "}
              <span className="text-gradient">Every Industry</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Real numbers from real businesses we&apos;ve helped grow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {caseStudies.slice(0, 4).map((cs) => (
              <CaseStudyCard
                key={cs.client}
                cs={cs}
                index={caseStudies.indexOf(cs) + 1}
              />
            ))}
          </div>
          <div className="mt-6 max-w-xl mx-auto">
            <CaseStudyCard cs={caseStudies[4]} index={5} />
          </div>
        </div>
      </div>
    </section>
  );
}

function CaseStudyCard({
  cs,
  index,
}: { cs: (typeof caseStudies)[0]; index: number }) {
  return (
    <div
      className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
      data-ocid={`case-studies.item.${index}`}
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${cs.color}`}
        >
          {cs.industry}
        </span>
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${cs.roiColor}`}
        >
          {cs.roi} ROI
        </span>
      </div>

      <h3 className="font-display text-lg font-700 text-slate-900 mb-0.5">
        {cs.client}
      </h3>
      <p className="text-xs text-slate-400 mb-4">
        {cs.location} &middot; {cs.timeline}
      </p>

      <div className="grid grid-cols-3 gap-3 mb-5 p-3 bg-slate-50 rounded-xl">
        <div className="text-center">
          <div className="text-xs text-slate-500">Investment</div>
          <div className="text-sm font-bold text-slate-800 mt-0.5">
            {cs.investment}
          </div>
        </div>
        <div className="text-center border-x border-slate-200">
          <div className="text-xs text-slate-500">Revenue</div>
          <div className="text-sm font-bold text-green-700 mt-0.5">
            {cs.revenue}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-500">Leads</div>
          <div className="text-sm font-bold text-indigo-700 mt-0.5">
            {cs.leads}
          </div>
        </div>
      </div>

      <blockquote className="text-sm text-slate-600 italic leading-relaxed mb-4 border-l-2 border-indigo-200 pl-3">
        &ldquo;{cs.quote}&rdquo;
      </blockquote>

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold">
          {cs.initials}
        </div>
        <span className="text-xs font-semibold text-slate-700">
          {cs.author}
        </span>
      </div>
    </div>
  );
}
