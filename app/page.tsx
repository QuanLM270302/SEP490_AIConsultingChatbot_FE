import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/common/HeroSection";
import { FeaturesSection } from "@/components/common/FeaturesSection";
import { IntegrationsSection } from "@/components/common/IntegrationsSection";
import { CTASection } from "@/components/common/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <IntegrationsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
