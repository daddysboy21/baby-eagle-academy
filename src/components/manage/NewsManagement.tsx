import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  status: 'published' | 'draft' | 'archived';
  author: string;
  publishDate: string;
  views: number;
  createdAt: string;
}

// Mock data - replace with API calls
const mockNews: NewsArticle[] = [
  {
    id: '1',
    title: 'BEFA Wins Championship Title',
    excerpt: 'After an incredible season, BEFA has secured the championship title with a spectacular final match...',
    category: 'Match Results',
    status: 'published',
    author: 'John Doe',
    publishDate: '2024-03-15',
    views: 1250,
    createdAt: '2024-03-15'
  },
  {
    id: '2',
    title: 'New Player Signing Announcement',
    excerpt: 'We are excited to announce the signing of our new striker who will join us for the upcoming season...',
    category: 'Transfers',
    status: 'published',
    author: 'Media Team',
    publishDate: '2024-03-10',
    views: 890,
    createdAt: '2024-03-10'
  },
  {
    id: '3',
    title: 'Training Camp Updates',
    excerpt: 'Our team is currently in intensive training preparation for the next season. Here are the latest updates...',
    category: 'Team News',
    status: 'draft',
    author: 'Coach Johnson',
    publishDate: '',
    views: 0,
    createdAt: '2024-03-12'
  },
];

const NewsManagement = () => {
  const [news, setNews] = useState<NewsArticle[]>(mockNews);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'archived': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Match Results': return 'bg-blue-500';
      case 'Transfers': return 'bg-purple-500';
      case 'Team News': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const handleDeleteNews = async (newsId: string) => {
    try {
      // TODO: Replace with your backend API call
      setNews(news.filter(article => article.id !== newsId));
      
      toast({
        title: "News article deleted",
        description: "The article has been removed",
      });
    } catch (error) {
      toast({
        title: "Error deleting article",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (newsId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    
    try {
      // TODO: Replace with your backend API call
      setNews(news.map(article => 
        article.id === newsId 
          ? { ...article, status: newStatus as 'published' | 'draft' | 'archived' }
          : article
      ));
      
      toast({
        title: `Article ${newStatus}`,
        description: `The article has been ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error updating article",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">News Management</h2>
          <p className="text-muted-foreground">Manage news articles and announcements</p>
        </div>
        
        <Link to="/manage/news/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add News Article
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {news.map((article) => (
          <Card key={article.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{article.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {article.publishDate || 'Not published'}
                    </span>
                    <span>By {article.author}</span>
                    {article.status === 'published' && (
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.views} views
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 items-end">
                  <div className="flex gap-2">
                    <Badge className={`${getCategoryColor(article.category)} text-white text-xs`}>
                      {article.category}
                    </Badge>
                    <Badge className={`${getStatusColor(article.status)} text-white text-xs`}>
                      {article.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleToggleStatus(article.id, article.status)}
                >
                  {article.status === 'published' ? 'Unpublish' : 'Publish'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDeleteNews(article.id)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {news.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No news articles found</h3>
          <p className="text-muted-foreground mb-4">Create your first news article to get started</p>
        </div>
      )}
    </div>
  );
};

export default NewsManagement;