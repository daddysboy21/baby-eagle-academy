import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, ArrowLeft, ArrowRight, ArrowLeft as PrevIcon, Images, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { galleryAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface GalleryItem {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  tags?: string;
  status: string;
  images: Array<{
    data: string; // base64 string
    uploadedAt: string;
  }>;
  createdAt: string;
}

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await galleryAPI.getAll();
        // Filter to only show published items
        const publishedItems = data.filter((item: GalleryItem) => item.status === 'published');
        setGalleryItems(publishedItems);
      } catch (err) {
        setError("Failed to load gallery images");
        toast({
          title: "Error",
          description: "Failed to load gallery images",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [toast]);

  const openImageModal = (item: GalleryItem, imageIndex: number = 0) => {
    setSelectedItem(item);
    setCurrentImageIndex(imageIndex);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedItem && currentImageIndex < selectedItem.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "Matches": return "bg-green-500 text-white";
      case "Training": return "bg-blue-500 text-white";
      case "Team": return "bg-purple-500 text-white";
      case "Events": return "bg-orange-500 text-white";
      case "Academy": return "bg-indigo-500 text-white";
      case "Community": return "bg-pink-500 text-white";
      case "Behind the Scenes": return "bg-gray-500 text-white";
      default: return "bg-gray-500 text-white";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-200"></div>
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 sm:mb-8">
          <Link to="/">
            <Button variant="outline" size="sm" className="w-fit">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Gallery</h1>
            <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">Explore moments that define Baby Eagle Football Academy</p>
          </div>
        </div>

        {galleryItems.length === 0 && !loading ? (
          <div className="text-center py-12">
            <Images className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No gallery items found</h3>
            <p className="text-muted-foreground">Gallery items will be displayed here once published.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {galleryItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                <div className="relative">
                  <div 
                    className="aspect-video overflow-hidden"
                    onClick={() => openImageModal(item, 0)}
                  >
                    <img
                      src={`data:image/jpeg;base64,${item.images[0]?.data}`}
                      alt={item.title || 'Gallery image'}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {item.images.length > 1 && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-black/70 text-white text-xs">
                        <Images className="w-3 h-3 mr-1" />
                        {item.images.length}
                      </Badge>
                    </div>
                  )}
                  {item.category && (
                    <div className="absolute top-2 right-2">
                      <Badge className={`${getCategoryColor(item.category)} text-xs`}>
                        {item.category}
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm sm:text-base lg:text-lg line-clamp-2">
                    {item.title || 'Untitled'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  {item.description && (
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 flex-shrink-0" />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                  {item.tags && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.tags.split(',').slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={closeModal}>
          <DialogContent className="max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <DialogTitle className="text-sm sm:text-base lg:text-lg leading-tight pr-8">
                    {selectedItem.title || 'Gallery Image'}
                  </DialogTitle>
                  {selectedItem.images.length > 1 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Image {currentImageIndex + 1} of {selectedItem.images.length}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeModal}
                  className="h-8 w-8 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </DialogHeader>
            <div className="space-y-3 sm:space-y-4">
              <div className="relative">
                <img
                  src={`data:image/jpeg;base64,${selectedItem.images[currentImageIndex]?.data}`}
                  alt={selectedItem.title || 'Gallery image'}
                  className="w-full h-auto rounded-lg max-h-[60vh] object-contain"
                />
                
                {selectedItem.images.length > 1 && (
                  <>
                    {currentImageIndex > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                      >
                        <PrevIcon className="w-4 h-4" />
                      </Button>
                    )}
                    {currentImageIndex < selectedItem.images.length - 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    )}
                  </>
                )}
              </div>
              
              {selectedItem.description && (
                <p className="text-muted-foreground text-sm sm:text-base">
                  {selectedItem.description}
                </p>
              )}
              
              {selectedItem.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {selectedItem.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 transition-all ${
                        index === currentImageIndex 
                          ? 'border-primary' 
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={`data:image/jpeg;base64,${image.data}`}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Gallery;