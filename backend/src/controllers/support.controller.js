
const { Op } = require('sequelize');

// Mock data for support system - in real implementation, this would use a proper database model
let tickets = [
  {
    id: 1,
    title: 'Unable to access tenant dashboard',
    description: 'Users are reporting issues accessing their tenant dashboard after the latest update.',
    status: 'open',
    priority: 'high',
    category: 'technical',
    createdBy: 'admin@tenant1.com',
    assignedTo: 'support@aurahrms.com',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    title: 'Payroll calculation discrepancy',
    description: 'There appears to be an issue with overtime calculations in the payroll module.',
    status: 'in_progress',
    priority: 'medium',
    category: 'payroll',
    createdBy: 'hr@tenant2.com',
    assignedTo: 'support@aurahrms.com',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

let knowledgeBase = [
  {
    id: 1,
    title: 'Getting Started with AURA HRMS',
    content: 'This guide will help you get started with AURA HRMS...',
    category: 'getting_started',
    tags: ['setup', 'basics', 'tutorial'],
    views: 1250,
    helpful: 45,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    title: 'How to Configure Payroll Settings',
    content: 'Step-by-step guide to configure payroll settings...',
    category: 'payroll',
    tags: ['payroll', 'configuration', 'setup'],
    views: 892,
    helpful: 32,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const getSupportTickets = async (req, res) => {
  try {
    const { status, priority, category, page = 1, limit = 10 } = req.query;
    
    let filteredTickets = [...tickets];
    
    if (status) {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === status);
    }
    
    if (priority) {
      filteredTickets = filteredTickets.filter(ticket => ticket.priority === priority);
    }
    
    if (category) {
      filteredTickets = filteredTickets.filter(ticket => ticket.category === category);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedTickets = filteredTickets.slice(startIndex, endIndex);

    res.json({
      tickets: paginatedTickets,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredTickets.length / limit),
        totalItems: filteredTickets.length,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch support tickets', error: error.message });
  }
};

const createSupportTicket = async (req, res) => {
  try {
    const { title, description, priority = 'medium', category = 'general' } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const newTicket = {
      id: tickets.length + 1,
      title,
      description,
      status: 'open',
      priority,
      category,
      createdBy: req.user?.email || 'system@aurahrms.com',
      assignedTo: 'support@aurahrms.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    tickets.push(newTicket);
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create support ticket', error: error.message });
  }
};

const updateSupportTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const ticketIndex = tickets.findIndex(ticket => ticket.id === parseInt(id));
    if (ticketIndex === -1) {
      return res.status(404).json({ message: 'Support ticket not found' });
    }

    tickets[ticketIndex] = {
      ...tickets[ticketIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    res.json(tickets[ticketIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update support ticket', error: error.message });
  }
};

const getKnowledgeBase = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    
    let filteredArticles = [...knowledgeBase];
    
    if (category) {
      filteredArticles = filteredArticles.filter(article => article.category === category);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredArticles = filteredArticles.filter(article => 
        article.title.toLowerCase().includes(searchLower) ||
        article.content.toLowerCase().includes(searchLower) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

    res.json({
      articles: paginatedArticles,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredArticles.length / limit),
        totalItems: filteredArticles.length,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch knowledge base', error: error.message });
  }
};

const createKnowledgeArticle = async (req, res) => {
  try {
    const { title, content, category, tags = [] } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const newArticle = {
      id: knowledgeBase.length + 1,
      title,
      content,
      category,
      tags: Array.isArray(tags) ? tags : [tags],
      views: 0,
      helpful: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    knowledgeBase.push(newArticle);
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create knowledge article', error: error.message });
  }
};

const getSupportStats = async (req, res) => {
  try {
    const stats = {
      totalTickets: tickets.length,
      openTickets: tickets.filter(t => t.status === 'open').length,
      inProgressTickets: tickets.filter(t => t.status === 'in_progress').length,
      resolvedTickets: tickets.filter(t => t.status === 'resolved').length,
      highPriorityTickets: tickets.filter(t => t.priority === 'high').length,
      avgResolutionTime: '2.5 days',
      knowledgeBaseArticles: knowledgeBase.length,
      totalViews: knowledgeBase.reduce((sum, article) => sum + article.views, 0)
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch support statistics', error: error.message });
  }
};

module.exports = {
  getSupportTickets,
  createSupportTicket,
  updateSupportTicket,
  getKnowledgeBase,
  createKnowledgeArticle,
  getSupportStats
};
