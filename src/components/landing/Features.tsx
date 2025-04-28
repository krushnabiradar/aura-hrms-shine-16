
import { Users, Calendar, FileText, Award, CircleCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <Card className="p-6 card-hover animate-fade-in">
    <div className="feature-icon mb-4">{icon}</div>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </Card>
);

const Features = () => {
  const features = [
    {
      icon: <Users />,
      title: "Employee Management",
      description: "Centralize employee data, manage profiles, and track career development in one place."
    },
    {
      icon: <Calendar />,
      title: "Attendance & Leave",
      description: "Effortlessly track attendance, manage leave requests, and monitor employee time-off."
    },
    {
      icon: <FileText />,
      title: "Payroll Processing",
      description: "Automate payroll calculations, tax deductions, and generate pay stubs with ease."
    },
    {
      icon: <Award />,
      title: "Performance Reviews",
      description: "Conduct fair evaluations, set goals, and provide continuous feedback to employees."
    },
    {
      icon: <CircleCheck />,
      title: "Compliance Management",
      description: "Stay updated with labor laws and ensure organizational compliance effortlessly."
    },
    {
      icon: <Users />,
      title: "Recruitment & Onboarding",
      description: "Streamline hiring processes and create smooth onboarding experiences."
    },
  ];

  return (
    <div className="section-padding bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Modern HR Teams</h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to streamline your HR processes and enhance productivity
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
        
        {/* Feature highlights */}
        <div className="mt-24 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&h=400&q=80" 
              alt="HR Dashboard" 
              className="rounded-lg shadow-lg mx-auto"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h3 className="text-2xl font-bold mb-4">Intuitive Dashboards</h3>
            <p className="text-muted-foreground mb-6">
              Get a bird's-eye view of your organization with customizable dashboards that provide real-time insights into your workforce.
            </p>
            <ul className="space-y-3">
              {[
                "Interactive data visualization",
                "Customizable widgets for key metrics",
                "Real-time updates and notifications",
                "Role-based access control"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-3 text-accent">
                    <CircleCheck size={20} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
