
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UseCaseCardProps {
  title: string;
  description: string;
  icon: string;
  benefits: string[];
}

const UseCaseCard = ({ title, description, icon, benefits }: UseCaseCardProps) => (
  <Card className="p-6 card-hover animate-fade-in">
    <div className="text-2xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-muted-foreground mb-4">{description}</p>
    <ul className="space-y-2 mb-4">
      {benefits.map((benefit, index) => (
        <li key={index} className="flex items-center">
          <span className="mr-2 text-accent">•</span>
          <span>{benefit}</span>
        </li>
      ))}
    </ul>
  </Card>
);

const UseCases = () => {
  const useCases = [
    {
      title: "Remote Teams",
      description: "Manage distributed teams efficiently across time zones and locations.",
      icon: "🌎",
      benefits: [
        "Track remote work hours automatically",
        "Streamlined virtual onboarding",
        "Digital document management",
        "Enhanced team communication"
      ]
    },
    {
      title: "Growing Enterprises",
      description: "Scale your HR operations along with your growing business needs.",
      icon: "📈",
      benefits: [
        "Adaptable workflows for changing needs",
        "Scalable user access management",
        "Advanced reporting capabilities",
        "Integration with existing systems"
      ]
    },
    {
      title: "Small Businesses",
      description: "Affordable HR solutions tailored for small business requirements.",
      icon: "🏪",
      benefits: [
        "Cost-effective employee management",
        "Simplified compliance tracking",
        "Time-saving automation tools",
        "Easy-to-use administrative interface"
      ]
    }
  ];

  return (
    <div className="section-padding">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Aura HRMS Works for Everyone</h2>
          <p className="text-muted-foreground text-lg">
            Tailored solutions for organizations of all sizes and industries
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <UseCaseCard
              key={index}
              title={useCase.title}
              description={useCase.description}
              icon={useCase.icon}
              benefits={useCase.benefits}
            />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-lg mb-6">
            Discover how Aura HRMS can be customized for your specific industry needs
          </p>
          <Button className="btn-accent">Request Custom Solution</Button>
        </div>
      </div>
    </div>
  );
};

export default UseCases;
