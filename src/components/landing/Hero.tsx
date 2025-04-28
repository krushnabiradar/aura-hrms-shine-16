
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="pt-32 pb-20 md:pt-36 md:pb-32 security-pattern">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          {/* Left Side - Text Content */}
          <div className="w-full md:w-1/2 text-left animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Streamline Your <span className="text-accent">HR Operations</span> with Aura HRMS
            </h1>
            <p className="text-lg md:text-xl mb-8 text-muted-foreground">
              The complete human resource management system that helps you manage your workforce efficiently, from recruitment to retirement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-accent text-lg px-6 py-3">Start Free Trial</Button>
              <Button variant="outline" className="btn-outline text-lg px-6 py-3">Book Demo</Button>
            </div>
            
            {/* Metrics */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8">
              <div>
                <p className="text-3xl font-bold">98%</p>
                <p className="text-muted-foreground text-sm">Customer satisfaction</p>
              </div>
              <div>
                <p className="text-3xl font-bold">10k+</p>
                <p className="text-muted-foreground text-sm">Companies using Aura</p>
              </div>
              <div>
                <p className="text-3xl font-bold">99.9%</p>
                <p className="text-muted-foreground text-sm">Uptime guaranteed</p>
              </div>
            </div>
          </div>
          
          {/* Right Side - Image */}
          <div className="w-full md:w-1/2 mt-12 md:mt-0 animate-fade-in delay-200">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/10 rounded-full blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&h=500&q=80" 
                alt="HR Dashboard Preview" 
                className="relative z-10 rounded-lg shadow-xl mx-auto"
              />
            </div>
          </div>
        </div>
        
        {/* Trusted by Section */}
        <div className="mt-20 text-center">
          <p className="text-sm uppercase tracking-wider text-muted-foreground mb-6">TRUSTED BY LEADING COMPANIES</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {['Microsoft', 'Google', 'Slack', 'Airbnb', 'Uber'].map((company) => (
              <div key={company} className="text-muted-foreground/70 font-semibold text-xl">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
