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
  id?: string;
  name: string;
  position: string;
  age: number;
  nationality: string;
  jerseyNumber: number;
  status: 'active' | 'injured' | 'suspended';
  createdAt?: string;
  height?: number;
  weight?: number;
  previousClub?: string;
  bio?: string;
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
    image: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const positions = [
    'Goalkeeper',
    'Defender',
    'Midfielder',
    'Forward',
    'Winger',
    'Striker'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'add' && !formData.image) {
      toast({ title: 'Image required', description: 'Please upload a player image.', variant: 'destructive' });
      return;
    }
    try {
      // Convert numeric fields to numbers as required by backend
      const payload = {
        ...formData,
        age: formData.age ? Number(formData.age) : undefined,
        jerseyNumber: formData.jerseyNumber ? Number(formData.jerseyNumber) : undefined,
        height: formData.height ? Number(formData.height) : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
      };
      let result;
      if (mode === 'edit' && initialData?.id) {
        result = await playersAPI.update(initialData.id, payload);
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
      toast({
        title: `Error ${mode === 'edit' ? 'updating' : 'adding'} player`,
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {mode === 'add' ? (
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/manage/players')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Add New Player</h2>
            <p className="text-muted-foreground">Add a new player to the team roster</p>
          </div>
        </div>
      ) : null}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Player Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter player's full name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="position">Position *</Label>
                <Select value={formData.position} onValueChange={(value) => handleInputChange('position', value)}>
                  <SelectTrigger>
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
              
              <div>
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="Enter age"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="nationality">Nationality *</Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  placeholder="Enter nationality"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="jerseyNumber">Jersey Number *</Label>
                <Input
                  id="jerseyNumber"
                  type="number"
                  value={formData.jerseyNumber}
                  onChange={(e) => handleInputChange('jerseyNumber', e.target.value)}
                  placeholder="Enter jersey number"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  placeholder="Enter height in cm"
                />
              </div>
              
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="Enter weight in kg"
                />
              </div>
              
              <div>
                <Label htmlFor="previousClub">Previous Club</Label>
                <Input
                  id="previousClub"
                  value={formData.previousClub}
                  onChange={(e) => handleInputChange('previousClub', e.target.value)}
                  placeholder="Enter previous club"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="bio">Biography</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Enter player biography..."
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="image">Player Image {mode === 'add' && '*'}</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
              )}
            </div>
            <div className="flex gap-4">
              {mode === 'add' ? (
                <Button type="button" variant="outline" onClick={() => navigate('/manage/players')}>Cancel</Button>
              ) : (
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
              )}
              <Button type="submit" disabled={!formData.name || !formData.position || !formData.age || (mode === 'add' && !formData.image)}>
                {mode === 'edit' ? 'Update Player' : 'Add Player'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerForm;