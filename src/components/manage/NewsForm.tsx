import { newsAPI } from '@/services/api';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye } from 'lucide-react';


interface NewsArticle {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags?: string;
  status: 'published' | 'draft' | 'archived';
  author?: string;
  publishDate?: string;
  views?: number;
  createdAt?: string;
}

interface NewsFormProps {
  mode?: 'add' | 'edit';
  initialData?: NewsArticle;
  onSuccess?: (news: NewsArticle) => void;
  onCancel?: () => void;
}

const NewsForm: React.FC<NewsFormProps> = ({ mode = 'add', initialData, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    category: initialData?.category || '',
    tags: initialData?.tags || '',
    status: initialData?.status || 'draft',
  });

  const categories = [
    'Match Results',
    'Transfers',
    'Team News',
    'Training Updates',
    'Academy News',
    'Community',
    'Announcements'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let result;
      if (mode === 'edit' && initialData?.id) {
        result = await newsAPI.update(initialData.id, formData);
        toast({
          title: "News article updated",
          description: `Article "${result.title}" has been updated`,
        });
        if (onSuccess) onSuccess(result);
      } else {
        result = await newsAPI.create(formData);
        toast({
          title: "News article created",
          description: `Article "${result.title}" has been ${result.status === 'published' ? 'published' : 'saved as draft'}`,
        });
        navigate('/manage/news');
      }
    } catch (error) {
      toast({
        title: `Error ${mode === 'edit' ? 'updating' : 'creating'} article`,
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleSaveAndPublish = () => {
    setFormData(prev => ({ ...prev, status: 'published' }));
    setTimeout(() => {
      document.getElementById('news-form')?.dispatchEvent(new Event('submit', { bubbles: true }));
    }, 0);
  };

  return (
    <div className="space-y-6">
      {mode === 'add' ? (
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/manage/news')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Create News Article</h2>
            <p className="text-muted-foreground">Write and publish a new news article</p>
          </div>
        </div>
      ) : null}
      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Article Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="news-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Article Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter article title"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="Enter tags separated by commas"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="excerpt">Article Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                placeholder="Enter a brief summary of the article..."
                rows={3}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="content">Article Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Write your article content here..."
                rows={12}
                required
              />
            </div>
            
            <div className="flex gap-4">
              {mode === 'add' ? (
                <Button type="button" variant="outline" onClick={() => navigate('/manage/news')}>Cancel</Button>
              ) : (
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
              )}
              <Button 
                type="submit" 
                variant="outline"
                disabled={!formData.title || !formData.category || !formData.excerpt || !formData.content}
              >
                <Save className="h-4 w-4 mr-2" />
                {mode === 'edit' ? 'Update Article' : 'Save as Draft'}
              </Button>
              <Button 
                type="button"
                onClick={handleSaveAndPublish}
                disabled={!formData.title || !formData.category || !formData.excerpt || !formData.content}
              >
                <Eye className="h-4 w-4 mr-2" />
                {mode === 'edit' ? 'Update & Publish' : 'Publish Article'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsForm;