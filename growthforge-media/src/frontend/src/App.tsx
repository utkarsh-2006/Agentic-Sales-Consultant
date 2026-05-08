import { Toaster } from "@/components/ui/sonner";
import { CTABand } from "./components/CTABand";
import { CaseStudies } from "./components/CaseStudies";
import { ChatWidget } from "./components/ChatWidget";
import { ContactForm } from "./components/ContactForm";
import { FAQ } from "./components/FAQ";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Industries } from "./components/Industries";
import { Navbar } from "./components/Navbar";
import { Pricing } from "./components/Pricing";
import { Process } from "./components/Process";
import { ResultsStats } from "./components/ResultsStats";
import { Services } from "./components/Services";
import { SocialProof } from "./components/SocialProof";

export default function App() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Toaster />
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <Services />
        <ResultsStats />
        <CaseStudies />
        <Process />
        <Pricing />
        <Industries />
        <FAQ />
        <ContactForm />
        <CTABand />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
