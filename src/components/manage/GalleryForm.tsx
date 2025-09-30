import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { galleryAPI } from '@/services/api';
import { ArrowLeft, Save, Upload, X, Images } from 'lucide-react';

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
  onSuccess?: (gallery: GalleryItem) => void;
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

const GalleryForm: React.FC<GalleryFormProps> = ({ 
  mode = 'add', 
  initialData, 
  onSuccess, 
  onCancel 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    tags: initialData?.tags || '',
    status: initialData?.status || 'published'
  });
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      toast({
        title: "Invalid files",
        description: "Please select only image files",
        variant: "destructive",
      });
    }

    const oversizedFiles = imageFiles.filter(file => file.size > 15 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast({
        title: "Files too large",
        description: `${oversizedFiles.length} file(s) exceed the 15MB limit`,
        variant: "destructive",
      });
      return;
    }
    
    setSelectedFiles(prev => [...prev, ...imageFiles]);
    
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'add' && selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one image",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      let result;
      if (mode === 'edit' && initialData?.id) {
        if (selectedFiles.length > 0) {
          // Convert new files to base64 if any
          const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              const base64String = result.split(',')[1];
              resolve(base64String);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          const images = await Promise.all(selectedFiles.map(toBase64));
          result = await galleryAPI.update(initialData.id, { ...formData, images });
        } else {
          result = await galleryAPI.update(initialData.id, formData);
        }
        toast({
          title: "Gallery updated",
          description: "Gallery item has been updated successfully",
        });
      } else {
        const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            const base64String = result.split(',')[1];
            resolve(base64String);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const images = await Promise.all(selectedFiles.map(toBase64));
        result = await galleryAPI.create({ ...formData, images });
        toast({
          title: "Gallery created",
          description: "Gallery item has been created successfully",
        });
      }
      
      if (onSuccess) {
        onSuccess(result);
      } else {
        navigate('/manage/gallery');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${mode} gallery item`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/manage/gallery');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleCancel}
            className="w-fit h-8 sm:h-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
              {mode === 'edit' ? 'Edit Gallery' : 'Create Gallery'}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              {mode === 'edit' ? 'Update gallery information' : 'Add new images to the gallery'}
            </p>
          </div>
        </div>

        {/* Main Content - Responsive Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Form Section */}
          <Card className="order-1">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl">Gallery Information</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Enter the details for your gallery item
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm sm:text-base">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter gallery title"
                    className="text-sm sm:text-base"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm sm:text-base">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleInputChange('category', value)}
                    disabled={loading}
                  >
                    <SelectTrigger className="text-sm sm:text-base">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category} className="text-sm sm:text-base">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm sm:text-base">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter gallery description..."
                    rows={4}
                    className="text-sm sm:text-base resize-none"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-sm sm:text-base">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="Enter tags separated by commas"
                    className="text-sm sm:text-base"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm sm:text-base">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: 'published' | 'private') => handleInputChange('status', value)}
                    disabled={loading}
                  >
                    <SelectTrigger className="text-sm sm:text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published" className="text-sm sm:text-base">Published</SelectItem>
                      <SelectItem value="private" className="text-sm sm:text-base">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Buttons - Responsive */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancel}
                    className="order-2 sm:order-1 text-sm sm:text-base"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading || (mode === 'add' && selectedFiles.length === 0)}
                    className="order-1 sm:order-2 flex-1 text-sm sm:text-base"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        {mode === 'edit' ? 'Updating...' : 'Creating...'}
                      </div>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {mode === 'edit' ? 'Update Gallery' : 'Create Gallery'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Image Upload Section */}
          <Card className="order-2">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl">
                {mode === 'edit' ? 'Add More Images' : 'Upload Images'}
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {mode === 'edit' 
                  ? 'Add additional images to this gallery' 
                  : 'Select images to include in this gallery'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 sm:p-6 text-center">
                <Upload className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-2 sm:mb-4" />
                <div className="space-y-1 sm:space-y-2">
                  <p className="text-sm sm:text-base font-medium">Click to upload images</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">PNG, JPG, JPEG up to 15MB each</p>
                </div>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="mt-3 sm:mt-4"
                  disabled={loading}
                />
              </div>

              {/* Image Previews */}
              {previews.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Images className="h-4 w-4" />
                    <span className="text-sm font-medium">{previews.length} image(s) selected</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-3 gap-3 sm:gap-4">
                    {previews.map((src, index) => (
                      <div key={index} className="relative group border rounded-lg overflow-hidden">
                        <img 
                          src={src} 
                          alt={`Preview ${index + 1}`} 
                          className="w-full h-24 sm:h-32 object-cover" 
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-1 right-1 h-5 w-5 sm:h-6 sm:w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeFile(index)}
                          disabled={loading}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {mode === 'edit' && selectedFiles.length === 0 && (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No new images selected. Current images will be preserved.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GalleryForm;