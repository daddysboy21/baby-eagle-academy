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

const NewsForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    status: 'draft'
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
      // TODO: Replace with your backend API call
      // const response = await fetch('/api/news', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      toast({
        title: "News article created",
        description: `Article "${formData.title}" has been ${formData.status === 'published' ? 'published' : 'saved as draft'}`,
      });
      
      navigate('/manage/news');
    } catch (error) {
      toast({
        title: "Error creating article",
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
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/manage/news')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Create News Article</h2>
          <p className="text-muted-foreground">Write and publish a new news article</p>
        </div>
      </div>

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
              <Button type="button" variant="outline" onClick={() => navigate('/manage/news')}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="outline"
                disabled={!formData.title || !formData.category || !formData.excerpt || !formData.content}
              >
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
              <Button 
                type="button"
                onClick={handleSaveAndPublish}
                disabled={!formData.title || !formData.category || !formData.excerpt || !formData.content}
              >
                <Eye className="h-4 w-4 mr-2" />
                Publish Article
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsForm;