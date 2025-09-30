import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, User, Shield } from 'lucide-react';
import { playersAPI } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import type { AuthContextType } from '@/contexts/AuthContext';

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
  const { user } = useAuth() as AuthContextType;
  
  // Privilege checking
  const isAdmin = user?.role === 'admin';
  const isCoAdmin = user?.role === 'co-admin';
  const isMediaPerson = user?.role === 'media-person';
  const canManagePlayers = isAdmin || isCoAdmin || isMediaPerson;

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
  const [loading, setLoading] = useState(false);

  // Check access on component mount
  useEffect(() => {
    if (!canManagePlayers) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to manage players",
        variant: "destructive",
      });
      navigate('/manage');
    }
  }, [canManagePlayers, navigate, toast]);

  const positions = [
    'Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Winger', 'Striker'
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'injured', label: 'Injured' },
    { value: 'suspended', label: 'Suspended' }
  ];

  // If user doesn't have permission, show access denied
  if (!canManagePlayers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-600 text-lg">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground text-sm">
              You don't have permission to manage players.
            </p>
            <p className="text-xs text-muted-foreground">
              Required roles: Admin, Co-Admin, or Media Person
            </p>
            <Button onClick={() => navigate('/manage')} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

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
      toast({ 
        title: 'Missing required fields', 
        description: 'Please fill in all required fields.', 
        variant: 'destructive' 
      });
      return;
    }
    
    if (mode === 'add' && !formData.image) {
      toast({ 
        title: 'Image required', 
        description: 'Please upload a player image.', 
        variant: 'destructive' 
      });
      return;
    }

    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="space-y-4 md:space-y-6">
          
          {/* Header - Responsive */}
          {mode === 'add' && (
            <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/manage/players')}
                className="w-fit"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold truncate">Add New Player</h2>
                <p className="text-muted-foreground text-sm md:text-base">Add a new player to the team roster</p>
              </div>
            </div>
          )}
          
          {/* Main Form Card */}
          <Card className="w-full">
            <CardHeader className="pb-4 md:pb-6">
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <User className="h-5 w-5" />
                Player Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                
                {/* Player Image Section - Responsive */}
                <div className="space-y-3">
                  <Label htmlFor="image" className="text-sm md:text-base font-medium">
                    Player Image {mode === 'add' && <span className="text-destructive">*</span>}
                  </Label>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Image Preview */}
                    <div className="flex-shrink-0">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 object-cover rounded-lg border-2 border-muted shadow-sm" 
                        />
                      ) : (
                        <div className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-muted rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                          <User className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    {/* Upload Controls */}
                    <div className="flex-1 w-full space-y-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Max size: 5MB. Formats: JPG, PNG, WebP
                        {mode === 'add' && ' (Required)'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Fields Grid - Responsive */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  
                  {/* Name Field */}
                  <div className="space-y-2 md:col-span-2 lg:col-span-1">
                    <Label htmlFor="name" className="text-sm md:text-base font-medium">
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
                  
                  {/* Position Field */}
                  <div className="space-y-2">
                    <Label htmlFor="position" className="text-sm md:text-base font-medium">
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
                  
                  {/* Age Field */}
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm md:text-base font-medium">
                      Age <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      min="14"
                      max="45"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      placeholder="Enter age"
                      className="w-full"
                      required
                    />
                  </div>
                  
                  {/* Nationality Field */}
                  <div className="space-y-2">
                    <Label htmlFor="nationality" className="text-sm md:text-base font-medium">
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
                  
                  {/* Jersey Number Field */}
                  <div className="space-y-2">
                    <Label htmlFor="jerseyNumber" className="text-sm md:text-base font-medium">
                      Jersey Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="jerseyNumber"
                      type="number"
                      min="1"
                      max="99"
                      value={formData.jerseyNumber}
                      onChange={(e) => handleInputChange('jerseyNumber', e.target.value)}
                      placeholder="Enter jersey number"
                      className="w-full"
                      required
                    />
                  </div>

                  {/* Status Field */}
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm md:text-base font-medium">
                      Status
                    </Label>
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
                  
                  {/* Height Field */}
                  <div className="space-y-2">
                    <Label htmlFor="height" className="text-sm md:text-base font-medium">
                      Height (m)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.01"
                      min="1.40"
                      max="2.20"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      placeholder="e.g., 1.75"
                      className="w-full"
                    />
                  </div>
                  
                  {/* Weight Field */}
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-sm md:text-base font-medium">
                      Weight (kg)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      min="40"
                      max="120"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      placeholder="Enter weight"
                      className="w-full"
                    />
                  </div>
                </div>
                
                {/* Full Width Fields */}
                <div className="space-y-4 md:space-y-6">
                  {/* Previous Club Field */}
                  <div className="space-y-2">
                    <Label htmlFor="previousClub" className="text-sm md:text-base font-medium">
                      Previous Club
                    </Label>
                    <Input
                      id="previousClub"
                      value={formData.previousClub}
                      onChange={(e) => handleInputChange('previousClub', e.target.value)}
                      placeholder="Enter previous club"
                      className="w-full"
                    />
                  </div>
                  
                  {/* Bio Field */}
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm md:text-base font-medium">
                      Biography
                    </Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Enter player biography..."
                      rows={4}
                      className="w-full resize-none"
                    />
                  </div>
                </div>
                
                {/* Action Buttons - Responsive */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 md:pt-6 border-t">
                  {mode === 'add' ? (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate('/manage/players')}
                      className="w-full sm:w-auto"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  ) : (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={onCancel}
                      className="w-full sm:w-auto"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button 
                    type="submit"
                    className="w-full sm:flex-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        {mode === 'edit' ? 'Updating...' : 'Adding...'}
                      </div>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        {mode === 'edit' ? 'Update Player' : 'Add Player'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlayerForm;