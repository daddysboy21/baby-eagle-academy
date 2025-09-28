import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, Edit, Trash2, Eye, Calendar, Images, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import GalleryForm from './GalleryForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { galleryAPI } from '@/services/api';

interface GalleryItem {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  tags?: string;
  status: 'published' | 'private';
  images: Array<{
    data: string; // base64 string
    uploadedAt: string;
  }>;
  createdAt: string;
}

const GalleryManagement = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleEditItem = (item: GalleryItem) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditingItem(null);
    setIsEditDialogOpen(false);
  };

  const handleGalleryItemUpdated = (updated: GalleryItem) => {
    setGallery(gallery.map(g => g.id === updated.id ? updated : g));
    handleEditDialogClose();
    toast({ title: 'Gallery item updated', description: `${updated.title || 'Gallery item'} has been updated.` });
  };

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await galleryAPI.getAll();
        setGallery(data);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to fetch gallery', variant: 'destructive' });
      }
    };
    fetchGallery();
  }, [toast]);

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Matches': return 'bg-green-500';
      case 'Training': return 'bg-blue-500';
      case 'Team': return 'bg-purple-500';
      case 'Events': return 'bg-orange-500';
      case 'Academy': return 'bg-indigo-500';
      case 'Community': return 'bg-pink-500';
      case 'Behind the Scenes': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'published' ? 'bg-green-500' : 'bg-gray-500';
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await galleryAPI.remove(itemId);
      setGallery(gallery.filter(item => item.id !== itemId));
      toast({
        title: "Gallery item deleted",
        description: "The gallery item has been removed",
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete gallery item',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async (itemId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'private' : 'published';
    try {
      await galleryAPI.update(itemId, { status: newStatus });
      setGallery(gallery.map(item => 
        item.id === itemId 
          ? { ...item, status: newStatus as 'published' | 'private' }
          : item
      ));
      toast({
        title: `Gallery item ${newStatus}`,
        description: `The gallery item is now ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error updating gallery item",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
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
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Gallery Management</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Manage photos and media content</p>
          </div>
          
          <Link to="/manage/gallery/upload">
            <Button size="sm" className="w-full sm:w-auto">
              <Upload className="h-4 w-4 mr-2" />
              Upload Photos
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {gallery.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative">
                <img 
                  src={`data:image/jpeg;base64,${item.images[0]?.data}`}
                  alt={item.title || 'Gallery image'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {item.images.length > 1 && (
                    <Badge className="bg-black/70 text-white text-xs">
                      <Images className="w-3 h-3 mr-1" />
                      {item.images.length}
                    </Badge>
                  )}
                </div>
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  {item.category && (
                    <Badge className={`${getCategoryColor(item.category)} text-white text-xs`}>
                      {item.category}
                    </Badge>
                  )}
                  <Badge className={`${getStatusColor(item.status)} text-white text-xs`}>
                    {item.status}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-sm sm:text-base lg:text-lg line-clamp-2">
                  {item.title || 'Untitled Gallery'}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {item.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                )}
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 flex-shrink-0" />
                  <span>{formatDate(item.createdAt)}</span>
                </div>

                {item.tags && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.split(',').slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => handleEditItem(item)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => handleToggleStatus(item.id, item.status)}
                  >
                    {item.status === 'published' ? 'Hide' : 'Show'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Edit Gallery Item Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-xs sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Gallery Item</DialogTitle>
              <DialogDescription>Update gallery item information below.</DialogDescription>
            </DialogHeader>
            {editingItem && (
              <GalleryForm
                mode="edit"
                initialData={editingItem}
                onSuccess={handleGalleryItemUpdated}
                onCancel={handleEditDialogClose}
              />
            )}
          </DialogContent>
        </Dialog>
        
        {gallery.length === 0 && (
          <div className="text-center py-12">
            <Images className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-base sm:text-lg font-medium mb-2">No gallery items found</h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">Upload your first photos to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryManagement;