
import { useState } from "react";
import { HelpCircle, MessageSquare, Book, Plus, Search, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { systemAdminApi } from "@/services/api/system-admin";

const HelpSupportPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newTicketDialog, setNewTicketDialog] = useState(false);
  const [newArticleDialog, setNewArticleDialog] = useState(false);

  // Fetch support data
  const { data: supportStats } = useQuery({
    queryKey: ['support-stats'],
    queryFn: () => systemAdminApi.getSupportStats(),
  });

  const { data: ticketsData, isLoading: ticketsLoading } = useQuery({
    queryKey: ['support-tickets'],
    queryFn: () => systemAdminApi.getSupportTickets(),
  });

  const { data: knowledgeData, isLoading: knowledgeLoading } = useQuery({
    queryKey: ['knowledge-base', searchTerm, selectedCategory],
    queryFn: () => systemAdminApi.getKnowledgeBase({
      search: searchTerm || undefined,
      category: selectedCategory || undefined
    }),
  });

  const createTicketMutation = useMutation({
    mutationFn: systemAdminApi.createSupportTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['support-stats'] });
      toast.success('Support ticket created successfully');
      setNewTicketDialog(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create ticket');
    }
  });

  const createArticleMutation = useMutation({
    mutationFn: systemAdminApi.createKnowledgeArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-base'] });
      toast.success('Knowledge article created successfully');
      setNewArticleDialog(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create article');
    }
  });

  const handleCreateTicket = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const priority = formData.get('priority') as string;
    const category = formData.get('category') as string;

    createTicketMutation.mutate({
      title,
      description,
      priority,
      category
    });
  };

  const handleCreateArticle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const tags = (formData.get('tags') as string).split(',').map(tag => tag.trim());

    createArticleMutation.mutate({
      title,
      content,
      category,
      tags
    });
  };

  const tickets = ticketsData?.tickets || [];
  const articles = knowledgeData?.articles || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Help & Support</h2>
        <p className="text-muted-foreground">Manage support tickets and knowledge base</p>
      </div>

      {/* Support Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supportStats?.totalTickets || 0}</div>
            <p className="text-xs text-muted-foreground">
              {supportStats?.openTickets || 0} open
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <MessageSquare className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supportStats?.inProgressTickets || 0}</div>
            <p className="text-xs text-muted-foreground">Being worked on</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">KB Articles</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supportStats?.knowledgeBaseArticles || 0}</div>
            <p className="text-xs text-muted-foreground">
              {supportStats?.totalViews || 0} total views
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supportStats?.avgResolutionTime || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Resolution time</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Support Tickets</CardTitle>
                <CardDescription>Manage and track support requests</CardDescription>
              </div>
              <Dialog open={newTicketDialog} onOpenChange={setNewTicketDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Ticket
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Support Ticket</DialogTitle>
                    <DialogDescription>
                      Create a new support ticket for tracking issues
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateTicket} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" name="title" placeholder="Brief description of the issue" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Detailed description of the issue"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select name="priority" defaultValue="medium">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select name="category" defaultValue="general">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="technical">Technical</SelectItem>
                            <SelectItem value="billing">Billing</SelectItem>
                            <SelectItem value="payroll">Payroll</SelectItem>
                            <SelectItem value="security">Security</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setNewTicketDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createTicketMutation.isPending}>
                        {createTicketMutation.isPending ? 'Creating...' : 'Create Ticket'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {ticketsLoading ? (
                <div className="text-center py-8">Loading tickets...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No support tickets found
                        </TableCell>
                      </TableRow>
                    ) : (
                      tickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-medium">{ticket.title}</TableCell>
                          <TableCell>
                            <Badge variant={
                              ticket.status === 'open' ? 'destructive' :
                              ticket.status === 'in_progress' ? 'default' :
                              'secondary'
                            }>
                              {ticket.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              ticket.priority === 'high' || ticket.priority === 'critical' ? 'destructive' :
                              ticket.priority === 'medium' ? 'default' :
                              'secondary'
                            }>
                              {ticket.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>{ticket.category}</TableCell>
                          <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Knowledge Base</CardTitle>
                <CardDescription>Manage help articles and documentation</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
                <Dialog open={newArticleDialog} onOpenChange={setNewArticleDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Article
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Knowledge Article</DialogTitle>
                      <DialogDescription>
                        Create a new help article for the knowledge base
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateArticle} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" placeholder="Article title" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          name="content"
                          placeholder="Article content..."
                          className="min-h-[200px]"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select name="category" defaultValue="general">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General</SelectItem>
                              <SelectItem value="getting_started">Getting Started</SelectItem>
                              <SelectItem value="payroll">Payroll</SelectItem>
                              <SelectItem value="attendance">Attendance</SelectItem>
                              <SelectItem value="troubleshooting">Troubleshooting</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tags">Tags</Label>
                          <Input
                            id="tags"
                            name="tags"
                            placeholder="tag1, tag2, tag3"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setNewArticleDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createArticleMutation.isPending}>
                          {createArticleMutation.isPending ? 'Creating...' : 'Create Article'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {knowledgeLoading ? (
                <div className="text-center py-8">Loading articles...</div>
              ) : (
                <div className="space-y-4">
                  {articles.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No articles found
                    </div>
                  ) : (
                    articles.map((article) => (
                      <Card key={article.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{article.title}</CardTitle>
                              <CardDescription>
                                {article.category} • {article.views} views • {article.helpful} helpful
                              </CardDescription>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {article.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {article.content}
                          </p>
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-xs text-muted-foreground">
                              Updated {new Date(article.updatedAt).toLocaleDateString()}
                            </span>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpSupportPage;
