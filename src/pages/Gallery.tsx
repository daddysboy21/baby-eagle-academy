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
      <div className="bg-gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-4xl lg:text-6xl font-bold">Gallery</h1>
          </div>
          <p className="text-xl opacity-90 max-w-2xl">
            Explore moments that define Baby Eagle Football Academy - from training sessions to victories, 
            celebrating our journey together.
          </p>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryImages.map((image, index) => (
            <Card key={image.id || index} className="overflow-hidden hover:shadow-glow transition-all duration-300 cursor-pointer">
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
              <CardContent className="p-6">
                <h3 className="font-semibold text-primary mb-2 text-lg">{image.title}</h3>
                <p className="text-muted-foreground">{image.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Full-size image modal */}
      {selectedImage !== null && galleryImages[selectedImage] && (
        <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle>{galleryImages[selectedImage].title}</DialogTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </DialogHeader>
            <div className="space-y-4">
              <img
                src={galleryImages[selectedImage].imageUrl}
                alt={galleryImages[selectedImage].title}
                className="w-full h-auto rounded-lg"
              />
              <p className="text-muted-foreground">{galleryImages[selectedImage].description}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Gallery;