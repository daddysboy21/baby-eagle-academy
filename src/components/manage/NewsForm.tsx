import { newsAPI } from '@/services/api';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Upload, FileText, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { AuthContextType } from '@/contexts/AuthContext';

interface NewsArticle {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags?: string;
  status: 'published' | 'draft';
  image?: string;
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
  const { user } = useAuth() as AuthContextType;
  
  // Privilege checking
  const isAdmin = user?.role === 'admin';
  const isCoAdmin = user?.role === 'co-admin';
  const isMediaPerson = user?.role === 'media-person';
  const canManageNews = isAdmin || isCoAdmin || isMediaPerson;

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    category: initialData?.category || '',
    tags: initialData?.tags || '',
    status: initialData?.status || 'draft' as 'draft' | 'published',
    image: initialData?.image || '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image ? `data:image/jpeg;base64,${initialData.image}` : null
  );
  const [loading, setLoading] = useState(false);

  // Check access on component mount
  useEffect(() => {
    if (!canManageNews) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to manage news",
        variant: "destructive",
      });
      navigate('/manage');
    }
  }, [canManageNews, navigate, toast]);

  // If user doesn't have permission, show access denied
  if (!canManageNews) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-600 text-lg">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground text-sm">
              You don't have permission to manage news.
            </p>
            <p className="text-xs text-muted-foreground">
              Required roles: Admin, Co-Admin, or Media Person
            </p>
            <Button onClick={() => navigate('/manage')} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (15MB limit to match backend)
    if (file.size > 15 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 15MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove the data URL prefix to get just the base64 string
      const base64String = result.split(',')[1];
      setFormData(prev => ({ ...prev, image: base64String }));
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

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
    
    // Validation
    if (!formData.title || !formData.excerpt || !formData.content || !formData.category) {
      toast({ 
        title: 'Missing required fields', 
        description: 'Please fill in all required fields.', 
        variant: 'destructive' 
      });
      return;
    }

    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndPublish = () => {
    setFormData(prev => ({ ...prev, status: 'published' }));
    setTimeout(() => {
      document.getElementById('news-form')?.dispatchEvent(new Event('submit', { bubbles: true }));
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="container mx-auto px-4 py-4 max-w-5xl">
        <div className="space-y-4 md:space-y-6">
          
          {/* Header - Responsive */}
          {mode === 'add' && (
            <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/manage/news')}
                className="w-fit"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold truncate">Create News Article</h2>
                <p className="text-muted-foreground text-sm md:text-base">Write and publish a new news article</p>
              </div>
            </div>
          )}
          
          {/* Main Form Card */}
          <Card className="w-full">
            <CardHeader className="pb-4 md:pb-6">
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Article Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <form id="news-form" onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                
                {/* Title Field */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm md:text-base font-medium">
                    Article Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter article title"
                    className="w-full text-sm md:text-base"
                    required
                  />
                </div>
                
                {/* Category and Tags Grid - Responsive */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm md:text-base font-medium">
                      Category <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className="w-full">
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-sm md:text-base font-medium">
                      Tags
                    </Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      placeholder="Enter tags separated by commas"
                      className="w-full text-sm md:text-base"
                    />
                  </div>
                </div>
                
                {/* Excerpt Field */}
                <div className="space-y-2">
                  <Label htmlFor="excerpt" className="text-sm md:text-base font-medium">
                    Article Excerpt <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder="Enter a brief summary of the article..."
                    rows={3}
                    className="w-full resize-none text-sm md:text-base"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Brief summary that will appear in article previews and social shares
                  </p>
                </div>
                
                {/* Content Field */}
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm md:text-base font-medium">
                    Article Content <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Write your article content here..."
                    rows={window.innerWidth < 768 ? 8 : 12}
                    className="w-full resize-none text-sm md:text-base"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    The main body of your article. Use clear paragraphs and engaging content.
                  </p>
                </div>
                
                {/* Image Upload Section - Responsive */}
                <div className="space-y-3">
                  <Label htmlFor="image" className="text-sm md:text-base font-medium">
                    Article Image
                  </Label>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Upload Controls */}
                    <div className="space-y-3">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Max size: 15MB. Formats: JPG, PNG, WebP. Optional but recommended for better engagement.
                      </p>
                    </div>
                    
                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Preview:</p>
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full max-w-sm h-auto rounded-lg border shadow-sm" 
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons - Responsive */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 md:pt-6 border-t">
                  {mode === 'add' ? (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate('/manage/news')}
                      className="w-full sm:w-auto"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  ) : (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={onCancel}
                      className="w-full sm:w-auto"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  )}
                  
                  <Button 
                    type="submit" 
                    variant="outline"
                    disabled={!formData.title || !formData.category || !formData.excerpt || !formData.content || loading}
                    className="w-full sm:w-auto"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                        Saving...
                      </div>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {mode === 'edit' ? 'Update Article' : 'Save as Draft'}
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    type="button"
                    onClick={handleSaveAndPublish}
                    disabled={!formData.title || !formData.category || !formData.excerpt || !formData.content || loading}
                    className="w-full sm:flex-1"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Publishing...
                      </div>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        {mode === 'edit' ? 'Update & Publish' : 'Publish Article'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewsForm;