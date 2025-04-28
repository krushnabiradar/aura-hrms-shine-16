
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, BookText, FileText } from "lucide-react";

interface DocCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

const DocCard = ({ icon, title, description, link }: DocCardProps) => (
  <Card className="p-6 card-hover animate-fade-in text-center">
    <div className="flex justify-center mb-4">
      <div className="feature-icon">{icon}</div>
    </div>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className="text-muted-foreground mb-4">{description}</p>
    <Button variant="outline" className="w-full" asChild>
      <a href={link}>Read More</a>
    </Button>
  </Card>
);

const Documentation = () => {
  const docs = [
    {
      icon: <BookOpen />,
      title: "Getting Started Guide",
      description: "Learn the fundamentals of Aura HRMS and set up your account",
      link: "#"
    },
    {
      icon: <BookText />,
      title: "API Documentation",
      description: "Integrate Aura HRMS with your existing business systems",
      link: "#"
    },
    {
      icon: <FileText />,
      title: "User Manual",
      description: "Detailed instructions for using all features of the platform",
      link: "#"
    }
  ];

  return (
    <div className="section-padding">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Documentation</h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to get the most out of Aura HRMS
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {docs.map((doc, index) => (
            <DocCard
              key={index}
              icon={doc.icon}
              title={doc.title}
              description={doc.description}
              link={doc.link}
            />
          ))}
        </div>
        
        <div className="mt-16 bg-accent/10 rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Need help implementing Aura HRMS?</h3>
          <p className="mb-6">
            Our support team is ready to help you with implementation and answer any questions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="btn-accent">Contact Support</Button>
            <Button variant="outline">Schedule a Call</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
