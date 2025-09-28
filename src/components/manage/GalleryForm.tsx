import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { galleryAPI } from '@/services/api';

interface GalleryItem {
  id?: string;
  title?: string;
  description?: string;
  category?: string;
  tags?: string;
  status: 'published' | 'private';
  images?: Array<{
    data: string;
    uploadedAt: string;
  }>;
  createdAt?: string;
}

interface GalleryFormProps {
  mode?: 'add' | 'edit';
  initialData?: GalleryItem;
  onSuccess?: (item: GalleryItem) => void;
  onCancel?: () => void;
}

const categories = [
  'Matches',
  'Training',
  'Team',
  'Events',
  'Academy',
  'Community',
  'Behind the Scenes',
];

const GalleryForm: React.FC<GalleryFormProps> = ({ mode = 'add', initialData, onSuccess, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    tags: initialData?.tags || '',
    status: initialData?.status || 'published',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'add') {
      toast({ 
        title: 'Not implemented', 
        description: 'Use the upload page to add new gallery items.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      if (mode === 'edit' && initialData?.id) {
        const result = await galleryAPI.update(initialData.id, formData);
        toast({ 
          title: 'Gallery item updated', 
          description: `${result.title || 'Gallery item'} has been updated.` 
        });
        if (onSuccess) onSuccess(result);
      }
    } catch (error) {
      toast({
        title: 'Error updating gallery item',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter title"
        />
      </div>
      
      <div>
        <Label htmlFor="category">Category</Label>
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
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter description..."
          rows={3}
        />
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
      
      <div>
        <Label htmlFor="status">Visibility</Label>
        <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="published">Public</SelectItem>
            <SelectItem value="private">Private</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {mode === 'edit' ? 'Update Gallery Item' : 'Add Gallery Item'}
        </Button>
      </div>
    </form>
  );
};

export default GalleryForm;