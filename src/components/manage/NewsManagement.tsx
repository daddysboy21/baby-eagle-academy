import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye, Calendar, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import NewsForm from './NewsForm';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  status: 'published' | 'draft' | 'archived';
  author: string;
  publishDate: string;
  views: number;
  createdAt: string;
  tags?: string;
}


import { useEffect } from 'react';
import { newsAPI } from '@/services/api';

const NewsManagement = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  // Add missing handlers for edit dialog
  const handleEditNews = (article: NewsArticle) => {
    setEditingNews(article);
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditingNews(null);
    setIsEditDialogOpen(false);
  };

  const handleNewsUpdated = (updated: NewsArticle) => {
    setNews(news.map(n => n.id === updated.id ? updated : n));
    handleEditDialogClose();
    toast({ title: 'News article updated', description: `${updated.title} has been updated.` });
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await newsAPI.getAll();
        setNews(data);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to fetch news', variant: 'destructive' });
      }
    };
    fetchNews();
  }, [toast]);
// ...existing code...

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
  const handleEditNews = (article: NewsArticle) => {
    setEditingNews(article);
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditingNews(null);
    setIsEditDialogOpen(false);
  };

  const handleNewsUpdated = (updated: NewsArticle) => {
    setNews(news.map(n => n.id === updated.id ? updated : n));
    handleEditDialogClose();
    toast({ title: 'News article updated', description: `${updated.title} has been updated.` });
  };
    try {
      await newsAPI.delete(newsId);
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
      await newsAPI.update(newsId, { status: newStatus });
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 sm:mb-8">
          <Link to="/manage">
            <Button variant="outline" size="sm" className="w-fit">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">News Management</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Manage news articles and announcements</p>
          </div>
          
          <Link to="/manage/news/add">
            <Button size="sm" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add News Article
            </Button>
          </Link>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {news.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-base sm:text-lg lg:text-xl mb-2 leading-tight">{article.title}</CardTitle>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3">
                        {article.excerpt}
                      </p>
                    </div>
                    
                    <div className="flex flex-row sm:flex-col gap-2">
                      <Badge className={`${getCategoryColor(article.category)} text-white text-xs w-fit`}>
                        {article.category}
                      </Badge>
                      <Badge className={`${getStatusColor(article.status)} text-white text-xs w-fit`}>
                        {article.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      {article.publishDate || 'Not published'}
                    </span>
                    <span>By {article.author}</span>
                    {article.status === 'published' && (
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3 flex-shrink-0" />
                        {article.views} views
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => handleEditNews(article)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                    onClick={() => handleToggleStatus(article.id, article.status)}
                  >
                    {article.status === 'published' ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:text-destructive text-xs"
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
        
        {/* Edit News Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-xs sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit News Article</DialogTitle>
              <DialogDescription>Update news article information below.</DialogDescription>
            </DialogHeader>
            {editingNews && (
              <NewsForm
                mode="edit"
                initialData={editingNews}
                onSuccess={handleNewsUpdated}
                onCancel={handleEditDialogClose}
              />
            )}
          </DialogContent>
        </Dialog>
        
        {news.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-base sm:text-lg font-medium mb-2">No news articles found</h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">Create your first news article to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsManagement;