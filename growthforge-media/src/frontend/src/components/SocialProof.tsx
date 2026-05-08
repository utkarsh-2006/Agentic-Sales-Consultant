const industries = [
  "Plumbing & HVAC",
  "Dental Practices",
  "Real Estate",
  "Fitness Studios",
  "Law Firms",
  "Beauty & Wellness",
  "Auto Repair",
  "Landscaping",
];

export function SocialProof() {
  return (
    <section className="py-10 border-y border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
          <div className="text-sm font-medium text-slate-500 whitespace-nowrap">
            Trusted across{" "}
            <strong className="text-slate-700">12+ industries</strong>:
          </div>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            {industries.map((industry) => (
              <span
                key={industry}
                className="px-3 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded-full border border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
