
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BlogPostProps {
  image: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  authorRole: string;
}

const BlogPostCard = ({ image, title, excerpt, date, author, authorRole }: BlogPostProps) => (
  <Card className="overflow-hidden card-hover animate-fade-in">
    <div className="h-48 overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover" />
    </div>
    <div className="p-6">
      <p className="text-sm text-muted-foreground mb-2">{date}</p>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 line-clamp-2">{excerpt}</p>
      <div className="flex items-center">
        <div className="mr-3 h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
          {author.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium">{author}</p>
          <p className="text-xs text-muted-foreground">{authorRole}</p>
        </div>
      </div>
    </div>
  </Card>
);

const Blog = () => {
  const blogPosts = [
    {
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&h=300&q=80",
      title: "5 Ways to Improve Employee Engagement",
      excerpt: "Discover proven strategies to boost employee morale and productivity in your organization.",
      date: "April 15, 2023",
      author: "Emily Johnson",
      authorRole: "HR Specialist"
    },
    {
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&h=300&q=80",
      title: "The Future of Remote Work in HR Management",
      excerpt: "How HR departments are adapting to the new normal of remote and hybrid work environments.",
      date: "March 22, 2023",
      author: "Michael Chen",
      authorRole: "Product Manager"
    },
    {
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=600&h=300&q=80",
      title: "Streamlining Your Payroll Process",
      excerpt: "Practical tips to make payroll processing more efficient and error-free for your business.",
      date: "February 08, 2023",
      author: "Sarah Rodriguez",
      authorRole: "Finance Director"
    }
  ];

  return (
    <div className="section-padding bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest from Our Blog</h2>
          <p className="text-muted-foreground text-lg">
            Insights, tips, and news about HR management and best practices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <BlogPostCard
              key={index}
              image={post.image}
              title={post.title}
              excerpt={post.excerpt}
              date={post.date}
              author={post.author}
              authorRole={post.authorRole}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button variant="outline" className="btn-outline">
            View All Articles
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
