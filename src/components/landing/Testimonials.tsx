
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  image?: string;
}

const TestimonialCard = ({ quote, author, role, company, image }: TestimonialProps) => (
  <Card className="p-8 h-full flex flex-col">
    <div className="mb-6 flex-grow">
      <div className="text-4xl text-accent mb-2">"</div>
      <p className="italic">{quote}</p>
      <div className="text-4xl text-accent text-right">"</div>
    </div>
    <div className="flex items-center mt-4">
      <div className="mr-4 h-12 w-12 rounded-full bg-secondary overflow-hidden">
        {image ? (
          <img src={image} alt={author} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-lg font-bold">
            {author.charAt(0)}
          </div>
        )}
      </div>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-muted-foreground">{role}, {company}</p>
      </div>
    </div>
  </Card>
);

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Aura HRMS has transformed how we manage our employees. The intuitive interface and comprehensive features have saved us countless hours of administrative work.",
      author: "Jennifer Williams",
      role: "HR Director",
      company: "Tech Innovations Inc."
    },
    {
      quote: "The payroll processing feature alone has saved our finance team so much time and reduced errors by 95%. The customer support is also exceptional.",
      author: "Robert Chen",
      role: "CFO",
      company: "Global Solutions Ltd."
    },
    {
      quote: "As a small business, we needed an affordable HR solution that could scale with us. Aura HRMS provided exactly what we needed without breaking the bank.",
      author: "Michelle Rodriguez",
      role: "Founder",
      company: "Bright Start Studios"
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="section-padding">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground text-lg">
            Don't just take our word for it - hear from some of our satisfied customers
          </p>
        </div>

        {/* Desktop view: Grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              company={testimonial.company}
            />
          ))}
        </div>

        {/* Mobile view: Carousel */}
        <div className="md:hidden">
          <TestimonialCard
            quote={testimonials[activeIndex].quote}
            author={testimonials[activeIndex].author}
            role={testimonials[activeIndex].role}
            company={testimonials[activeIndex].company}
          />
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full ${
                  activeIndex === index ? 'bg-accent' : 'bg-muted'
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Stats */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="animate-fade-in">
            <p className="text-4xl font-bold text-accent">350+</p>
            <p className="text-muted-foreground">Companies</p>
          </div>
          <div className="animate-fade-in delay-100">
            <p className="text-4xl font-bold text-accent">25k+</p>
            <p className="text-muted-foreground">Employees Managed</p>
          </div>
          <div className="animate-fade-in delay-200">
            <p className="text-4xl font-bold text-accent">15+</p>
            <p className="text-muted-foreground">Countries</p>
          </div>
          <div className="animate-fade-in delay-300">
            <p className="text-4xl font-bold text-accent">99%</p>
            <p className="text-muted-foreground">Customer Satisfaction</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
