import { useState } from "react";
import { captureLead, getSessionId } from "../api";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

interface FormData {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  monthlyBudget: string;
  message: string;
}

const initialForm: FormData = {
  name: "",
  businessName: "",
  email: "",
  phone: "",
  monthlyBudget: "",
  message: "",
};

const trustItems = [
  "Meta Blueprint Certified Agency",
  "Facebook Marketing Partner",
  "Google Partner",
  "92% Client Retention Rate",
  "90-Day Performance Guarantee",
];

export function ContactForm() {
  const { ref, isVisible } = useScrollAnimation();
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await captureLead({
        session_id: getSessionId(),
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        business: form.businessName || undefined,
      });
      setSubmitted(true);
      setForm(initialForm);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong. Please try again or email us directly at info@growthforgemedia.com",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white">
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
                Get Started
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-700 text-slate-950 mb-4">
              Book Your Free{" "}
              <span className="text-gradient">Strategy Session</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              30-minute call to discuss your business and whether Facebook Ads
              is right for you. No hard sell, just honest advice.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-12">
            {/* Left sidebar info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h3 className="font-display text-lg font-700 text-slate-900 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center shrink-0">
                      <svg
                        aria-hidden="true"
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-0.5">Email</div>
                      <a
                        href="mailto:info@growthforgemedia.com"
                        className="text-sm font-medium text-indigo-600 hover:underline"
                      >
                        info@growthforgemedia.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0">
                      <svg
                        aria-hidden="true"
                        className="w-4 h-4 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-0.5">
                        Business Hours
                      </div>
                      <div className="text-sm font-medium text-slate-700">
                        Monday&ndash;Friday, 9am&ndash;6pm EST
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-200">
                <h3 className="font-display text-base font-700 text-indigo-900 mb-3">
                  Why Work With Us
                </h3>
                <ul className="space-y-2.5">
                  {trustItems.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-sm text-indigo-800"
                    >
                      <svg
                        aria-hidden="true"
                        className="w-4 h-4 text-indigo-500 shrink-0"
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
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div
                  className="h-full min-h-64 flex flex-col items-center justify-center text-center p-8 bg-green-50 rounded-2xl border border-green-200"
                  data-ocid="contact.success_state"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <svg
                      aria-hidden="true"
                      className="w-8 h-8 text-green-600"
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
                  <h3 className="font-display text-xl font-700 text-green-900 mb-2">
                    You&apos;re on the calendar!
                  </h3>
                  <p className="text-green-700 text-sm leading-relaxed">
                    Thanks for reaching out. We&apos;ll contact you within 24
                    hours to schedule your free strategy session.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  data-ocid="contact.modal"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-slate-700 mb-1.5"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Martinez"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors"
                        data-ocid="contact.input"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="businessName"
                        className="block text-sm font-medium text-slate-700 mb-1.5"
                      >
                        Business Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="businessName"
                        name="businessName"
                        type="text"
                        required
                        value={form.businessName}
                        onChange={handleChange}
                        placeholder="SafeFlow Plumbing"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors"
                        data-ocid="contact.input"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-slate-700 mb-1.5"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors"
                        data-ocid="contact.input"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-slate-700 mb-1.5"
                      >
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="(555) 123-4567"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors"
                        data-ocid="contact.input"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="monthlyBudget"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Monthly Ad Budget
                    </label>
                    <select
                      id="monthlyBudget"
                      name="monthlyBudget"
                      value={form.monthlyBudget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors"
                      data-ocid="contact.select"
                    >
                      <option value="">Select your budget range</option>
                      <option value="$500-$1,000">$500&ndash;$1,000/mo</option>
                      <option value="$1,000-$2,500">
                        $1,000&ndash;$2,500/mo
                      </option>
                      <option value="$2,500-$5,000">
                        $2,500&ndash;$5,000/mo
                      </option>
                      <option value="$5,000-$10,000">
                        $5,000&ndash;$10,000/mo
                      </option>
                      <option value="$10,000+">$10,000+/mo</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Tell Us About Your Business
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Briefly describe your business, target customers, and your main marketing challenge..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors resize-none"
                      data-ocid="contact.textarea"
                    />
                  </div>

                  {error && (
                    <div
                      className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700"
                      data-ocid="contact.error_state"
                    >
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl font-semibold text-white gradient-brand hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 shadow-md disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                    data-ocid="contact.submit_button"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          aria-hidden="true"
                          className="w-4 h-4 animate-spin"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                            strokeLinecap="round"
                          />
                        </svg>
                        Submitting&hellip;
                      </span>
                    ) : (
                      "Book Free Consultation"
                    )}
                  </button>

                  {submitting && (
                    <div
                      className="text-center"
                      data-ocid="contact.loading_state"
                    >
                      <p className="text-xs text-slate-400">
                        Submitting your request&hellip;
                      </p>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
