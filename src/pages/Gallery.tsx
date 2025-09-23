import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { galleryAPI } from "@/services/api";

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await galleryAPI.getAll();
        setGalleryImages(data);
      } catch (err) {
        setError("Failed to load gallery images");
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-primary-foreground py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold">Gallery</h1>
          </div>
          <p className="text-sm sm:text-lg lg:text-xl opacity-90 max-w-2xl">
            Explore moments that define Baby Eagle Football Academy - from training sessions to victories, 
            celebrating our journey together.
          </p>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {galleryImages.map((image, index) => (
            <Card key={image.id || index} className="overflow-hidden hover:shadow-glow transition-all duration-300 cursor-pointer hover:scale-[1.02] sm:hover:scale-105">
              <div 
                className="aspect-video overflow-hidden"
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <h3 className="font-semibold text-primary mb-1 sm:mb-2 text-sm sm:text-base lg:text-lg line-clamp-2">{image.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm line-clamp-3">{image.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Full-size image modal */}
      {selectedImage !== null && galleryImages[selectedImage] && (
        <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <div className="flex justify-between items-start gap-4">
                <DialogTitle className="text-sm sm:text-base lg:text-lg leading-tight pr-8">{galleryImages[selectedImage].title}</DialogTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedImage(null)}
                  className="h-8 w-8 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </DialogHeader>
            <div className="space-y-3 sm:space-y-4">
              <img
                src={galleryImages[selectedImage].imageUrl}
                alt={galleryImages[selectedImage].title}
                className="w-full h-auto rounded-lg max-h-[60vh] object-contain"
              />
              <p className="text-muted-foreground text-sm sm:text-base">{galleryImages[selectedImage].description}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Gallery;