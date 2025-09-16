import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Images, X } from "lucide-react";

// Import team photos
import teamPhoto1 from "@/assets/team-photo-1.jpg";
import trainingSession1 from "@/assets/training-session-1.jpg";
import celebration1 from "@/assets/celebration-1.jpg";
import staffTeamPhoto from "@/assets/staff-team-photo.jpg";
import goalkeeperAction from "@/assets/goalkeeper-action.jpg";
import awardsCeremony from "@/assets/awards-ceremony.jpg";

const galleryImages = [
  {
    src: teamPhoto1,
    title: "Team Photo 2024",
    description: "Our complete squad for the 2024 season. These young champions represent the future of football in Liberia."
  },
  {
    src: trainingSession1,
    title: "Training Session",
    description: "Daily training sessions where our players develop their skills, discipline, and teamwork under professional coaching."
  },
  {
    src: celebration1,
    title: "Victory Celebration",
    description: "Celebrating our recent victory in the local championship. Every goal is a step towards our bigger dreams."
  },
  {
    src: staffTeamPhoto,
    title: "Coaching Staff & Players",
    description: "Our dedicated coaching staff working alongside our talented players. Together, we build champions on and off the pitch."
  },
  {
    src: goalkeeperAction,
    title: "Goalkeeper in Action",
    description: "Our goalkeeper making a crucial save during a competitive match. Dedication and training pay off in moments like these."
  },
  {
    src: awardsCeremony,
    title: "Awards Ceremony",
    description: "Recognition ceremony for our outstanding players. We celebrate both academic and athletic achievements."
  }
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="lg" className="gap-2 shadow-brand">
          <Images className="w-5 h-5" />
          View Gallery
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">Baby Eagle Academy Gallery</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {galleryImages.map((image, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-glow transition-all duration-300 cursor-pointer">
              <div 
                className="aspect-video overflow-hidden"
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-primary mb-2">{image.title}</h3>
                <p className="text-sm text-muted-foreground">{image.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Full-size image modal */}
        {selectedImage !== null && (
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
                  src={galleryImages[selectedImage].src}
                  alt={galleryImages[selectedImage].title}
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-muted-foreground">{galleryImages[selectedImage].description}</p>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Gallery;