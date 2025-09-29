import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { playersAPI } from '@/services/api';

interface Player {
  _id?: string;
  id?: string;
  name: string;
  position: string;
  age: number;
  nationality: string;
  jerseyNumber: number;
  height: number;
  weight: number;
  previousClub?: string;
  bio?: string;
  status: 'active' | 'injured' | 'suspended';
  image?: string;
  createdAt?: string;
}

interface PlayerFormProps {
  mode?: 'add' | 'edit';
  initialData?: Player;
  onSuccess?: (player: Player) => void;
  onCancel?: () => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ mode = 'add', initialData, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    position: initialData?.position || '',
    age: initialData?.age?.toString() || '',
    nationality: initialData?.nationality || '',
    jerseyNumber: initialData?.jerseyNumber?.toString() || '',
    height: initialData?.height?.toString() || '',
    weight: initialData?.weight?.toString() || '',
    previousClub: initialData?.previousClub || '',
    bio: initialData?.bio || '',
    status: initialData?.status || 'active',
    image: initialData?.image || '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);

  const positions = [
    'Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Winger', 'Striker'
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'injured', label: 'Injured' },
    { value: 'suspended', label: 'Suspended' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData(prev => ({ ...prev, image: result }));
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.position || !formData.age || !formData.nationality || !formData.jerseyNumber) {
      toast({ title: 'Missing required fields', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    
    if (mode === 'add' && !formData.image) {
      toast({ title: 'Image required', description: 'Please upload a player image.', variant: 'destructive' });
      return;
    }

    try {
      const payload = {
        name: formData.name,
        position: formData.position,
        age: Number(formData.age),
        nationality: formData.nationality,
        jerseyNumber: Number(formData.jerseyNumber),
        height: formData.height ? Number(formData.height) : 0,
        weight: formData.weight ? Number(formData.weight) : 0,
        previousClub: formData.previousClub || '',
        bio: formData.bio || '',
        status: formData.status as 'active' | 'injured' | 'suspended',
        image: formData.image
      };

      let result;
      if (mode === 'edit' && (initialData?._id || initialData?.id)) {
        result = await playersAPI.update(initialData._id || initialData.id || '', payload);
        toast({
          title: "Player updated successfully",
          description: `${result.name} has been updated`,
        });
        if (onSuccess) onSuccess(result);
      } else {
        result = await playersAPI.create(payload);
        toast({
          title: "Player added successfully",
          description: `${result.name} has been added to the team`,
        });
        navigate('/manage/players');
      }
    } catch (error) {
      console.error('Error saving player:', error);
      toast({
        title: `Error ${mode === 'edit' ? 'updating' : 'adding'} player`,
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4 sm:space-y-6">
            {mode === 'add' ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/manage/players')}
                  className="w-fit"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Add New Player</h2>
                  <p className="text-muted-foreground text-sm sm:text-base">Add a new player to the team roster</p>
                </div>
              </div>
            ) : null}
            
            <Card className="w-full">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">Player Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* Player Image */}
                  <div className="space-y-2">
                    <Label htmlFor="image" className="text-sm sm:text-base">
                      Player Image {mode === 'add' && <span className="text-destructive">*</span>}
                    </Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full text-sm"
                    />
                    {imagePreview && (
                      <div className="flex justify-center sm:justify-start mt-3">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border shadow-sm" 
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm sm:text-base">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter player's full name"
                        className="w-full"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-sm sm:text-base">
                        Position <span className="text-destructive">*</span>
                      </Label>
                      <Select value={formData.position} onValueChange={(value) => handleInputChange('position', value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          {positions.map((position) => (
                            <SelectItem key={position} value={position}>
                              {position}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-sm sm:text-base">
                        Age <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        placeholder="Enter age"
                        className="w-full"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="nationality" className="text-sm sm:text-base">
                        Nationality <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="nationality"
                        value={formData.nationality}
                        onChange={(e) => handleInputChange('nationality', e.target.value)}
                        placeholder="Enter nationality"
                        className="w-full"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="jerseyNumber" className="text-sm sm:text-base">
                        Jersey Number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="jerseyNumber"
                        type="number"
                        value={formData.jerseyNumber}
                        onChange={(e) => handleInputChange('jerseyNumber', e.target.value)}
                        placeholder="Enter jersey number"
                        className="w-full"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-sm sm:text-base">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="height" className="text-sm sm:text-base">Height (m)</Label>
                      <Input
                        id="height"
                        type="number"
                        step="0.01"
                        value={formData.height}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                        placeholder="e.g., 1.75"
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="weight" className="text-sm sm:text-base">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={formData.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                        placeholder="Enter weight in kg"
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="previousClub" className="text-sm sm:text-base">Previous Club</Label>
                    <Input
                      id="previousClub"
                      value={formData.previousClub}
                      onChange={(e) => handleInputChange('previousClub', e.target.value)}
                      placeholder="Enter previous club"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm sm:text-base">Biography</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Enter player biography..."
                      rows={4}
                      className="w-full resize-none"
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                    {mode === 'add' ? (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => navigate('/manage/players')}
                        className="w-full sm:w-auto order-2 sm:order-1"
                      >
                        Cancel
                      </Button>
                    ) : (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={onCancel}
                        className="w-full sm:w-auto order-2 sm:order-1"
                      >
                        Cancel
                      </Button>
                    )}
                    <Button 
                      type="submit"
                      className="w-full sm:w-auto sm:flex-1 order-1 sm:order-2"
                    >
                      {mode === 'edit' ? 'Update Player' : 'Add Player'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerForm;