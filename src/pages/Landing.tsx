
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import UseCases from "@/components/landing/UseCases";
import Pricing from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import Documentation from "@/components/landing/Documentation";
import Blog from "@/components/landing/Blog";
import Footer from "@/components/layout/Footer";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section id="hero">
        <Hero />
      </section>
      
      {/* Features Section */}
      <section id="features">
        <Features />
      </section>
      
      {/* Use Cases Section */}
      <section id="use-cases">
        <UseCases />
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials">
        <Testimonials />
      </section>
      
      {/* Pricing Section */}
      <section id="pricing">
        <Pricing />
      </section>
      
      {/* Documentation Section */}
      <section id="docs">
        <Documentation />
      </section>
      
      {/* Blog Section */}
      <section id="blog">
        <Blog />
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
