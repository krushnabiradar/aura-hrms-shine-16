
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CircleCheck } from "lucide-react";

interface PlanProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlight?: boolean;
  buttonText: string;
}

const PricingCard = ({ name, price, description, features, highlight, buttonText }: PlanProps) => (
  <Card className={`p-8 flex flex-col h-full ${highlight ? 'border-accent border-2 shadow-lg' : ''}`}>
    <div className="mb-4">
      {highlight && <p className="text-accent mb-4 text-sm font-semibold">MOST POPULAR</p>}
      <h3 className="text-xl font-bold">{name}</h3>
      <div className="my-4">
        <span className="text-4xl font-bold">{price}</span>
        {price !== 'Free' && <span className="text-muted-foreground text-sm">/month per user</span>}
      </div>
      <p className="text-muted-foreground mb-6">{description}</p>
    </div>
    
    <ul className="space-y-3 mb-8 flex-grow">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <CircleCheck className="mr-2 text-accent flex-shrink-0 mt-1" size={18} />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    
    <div className="mt-auto">
      <Button 
        className={highlight ? "btn-accent w-full" : "btn-outline w-full"}
      >
        {buttonText}
      </Button>
    </div>
  </Card>
);

const Pricing = () => {
  const plans = [
    {
      name: "Free Trial",
      price: "Free",
      description: "Perfect for testing Aura HRMS capabilities",
      features: [
        "Up to 10 employees",
        "Basic employee management",
        "Time and attendance tracking",
        "Limited reporting",
        "Email support"
      ],
      buttonText: "Start Free Trial"
    },
    {
      name: "Business",
      price: "$12",
      description: "Everything you need for growing companies",
      features: [
        "Unlimited employees",
        "Advanced employee management",
        "Complete attendance system",
        "Payroll processing",
        "Performance reviews",
        "Comprehensive reporting",
        "Priority support"
      ],
      highlight: true,
      buttonText: "Get Started"
    },
    {
      name: "Enterprise",
      price: "$24",
      description: "Custom solutions for large organizations",
      features: [
        "All Business features",
        "Custom integrations",
        "Advanced security features",
        "Dedicated account manager",
        "Custom workflow automation",
        "Multi-company management",
        "24/7 premium support"
      ],
      buttonText: "Contact Sales"
    }
  ];

  return (
    <div className="section-padding bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground text-lg">
            Choose the plan that works best for your organization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PricingCard
              key={index}
              name={plan.name}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              highlight={plan.highlight}
              buttonText={plan.buttonText}
            />
          ))}
        </div>

        <div className="mt-16 bg-background rounded-lg p-8 border border-border">
          <h3 className="text-xl font-bold mb-4 text-center">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: "Can I switch plans later?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
              },
              {
                q: "Is there a setup fee?",
                a: "No, there are no hidden fees. You only pay the advertised monthly subscription price."
              },
              {
                q: "Do you offer discounts for annual billing?",
                a: "Yes, we offer a 15% discount when you choose annual billing instead of monthly."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans."
              },
            ].map((faq, index) => (
              <div key={index} className="mb-4">
                <h4 className="font-semibold mb-1">{faq.q}</h4>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button variant="link">View All FAQs</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
