import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, Edit, Trash2, Eye, Calendar, Image } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  uploadedBy: string;
  uploadDate: string;
  views: number;
  status: 'published' | 'private';
}

// Mock data - replace with API calls
const mockGallery: GalleryItem[] = [
  {
    id: '1',
    title: 'Championship Victory Celebration',
    description: 'Team celebrating after winning the championship title',
    category: 'Matches',
    imageUrl: '/src/assets/celebration-1.jpg',
    uploadedBy: 'Media Team',
    uploadDate: '2024-03-15',
    views: 850,
    status: 'published'
  },
  {
    id: '2',
    title: 'Training Session',
    description: 'Intensive training session preparation',
    category: 'Training',
    imageUrl: '/src/assets/training-session-1.jpg',
    uploadedBy: 'Coach Johnson',
    uploadDate: '2024-03-10',
    views: 420,
    status: 'published'
  },
  {
    id: '3',
    title: 'Team Photo 2024',
    description: 'Official team photo for the 2024 season',
    category: 'Team',
    imageUrl: '/src/assets/team-photo-1.jpg',
    uploadedBy: 'Media Team',
    uploadDate: '2024-03-05',
    views: 1200,
    status: 'published'
  },
];

const GalleryManagement = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>(mockGallery);
  const { toast } = useToast();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Matches': return 'bg-green-500';
      case 'Training': return 'bg-blue-500';
      case 'Team': return 'bg-purple-500';
      case 'Events': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'published' ? 'bg-green-500' : 'bg-gray-500';
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      // TODO: Replace with your backend API call
      setGallery(gallery.filter(item => item.id !== imageId));
      
      toast({
        title: "Image deleted",
        description: "The image has been removed from the gallery",
      });
    } catch (error) {
      toast({
        title: "Error deleting image",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (imageId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'private' : 'published';
    
    try {
      // TODO: Replace with your backend API call
      setGallery(gallery.map(item => 
        item.id === imageId 
          ? { ...item, status: newStatus as 'published' | 'private' }
          : item
      ));
      
      toast({
        title: `Image ${newStatus}`,
        description: `The image is now ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error updating image",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gallery Management</h2>
          <p className="text-muted-foreground">Manage photos and media content</p>
        </div>
        
        <Link to="/manage/gallery/upload">
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Photos
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gallery.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <Badge className={`${getCategoryColor(item.category)} text-white text-xs`}>
                  {item.category}
                </Badge>
                <Badge className={`${getStatusColor(item.status)} text-white text-xs`}>
                  {item.status}
                </Badge>
              </div>
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {item.uploadDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {item.views} views
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Uploaded by {item.uploadedBy}
                </p>
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleToggleStatus(item.id, item.status)}
                  >
                    {item.status === 'published' ? 'Hide' : 'Show'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteImage(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {gallery.length === 0 && (
        <div className="text-center py-12">
          <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No images found</h3>
          <p className="text-muted-foreground mb-4">Upload your first photos to get started</p>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;