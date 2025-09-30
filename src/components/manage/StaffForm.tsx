import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Upload, User } from 'lucide-react';
import { staffAPI } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import type { AuthContextType } from '@/contexts/AuthContext';

interface Staff {
  id?: string;
  name: string;
  role: string;
  department: 'Technical' | 'Medical' | 'Administrative' | 'Support';
  experience?: number;
  email: string;
  phone?: string;
  qualifications?: string;
  bio?: string;
  status: string;
  image?: string;
  createdAt?: string;
}

interface StaffFormProps {
  mode?: 'add' | 'edit';
  initialData?: Staff;
  onSuccess?: (staff: Staff) => void;
  onCancel?: () => void;
}

const StaffForm: React.FC<StaffFormProps> = ({ mode = 'add', initialData, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth() as AuthContextType;
  
  // Privilege checking
  const isAdmin = user?.role === 'admin';
  const isCoAdmin = user?.role === 'co-admin';
  const isMediaPerson = user?.role === 'media-person';
  const canManageStaff = isAdmin || isCoAdmin || isMediaPerson;

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    role: initialData?.role || '',
    department: initialData?.department || '',
    experience: initialData?.experience?.toString() || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    qualifications: initialData?.qualifications || '',
    bio: initialData?.bio || '',
    status: initialData?.status || 'active',
    image: initialData?.image || '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);
  const [loading, setLoading] = useState(false);

  // Check access on component mount
  useEffect(() => {
    if (!canManageStaff) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to manage staff members",
        variant: "destructive",
      });
      navigate('/manage');
    }
  }, [canManageStaff, navigate, toast]);

  const departments: Array<'Technical' | 'Medical' | 'Administrative' | 'Support'> = ['Technical', 'Medical', 'Administrative', 'Support'];
  
  const roles = {
    Technical: ['Head Coach', 'Assistant Coach', 'Fitness Coach', 'Goalkeeping Coach', 'Scout', 'Technical Director'],
    Medical: ['Team Doctor', 'Physiotherapist', 'Sports Psychologist', 'Nutritionist'],
    Administrative: ['General Manager', 'Secretary', 'Accountant', 'Media Officer', 'Marketing Manager'],
    Support: ['Kit Manager', 'Groundskeeper', 'Security', 'Driver', 'Equipment Manager']
  };

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  // If user doesn't have permission, show access denied
  if (!canManageStaff) {
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
              You don't have permission to manage staff members.
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
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
    if (!formData.name || !formData.role || !formData.department || !formData.email) {
      toast({ 
        title: 'Missing required fields', 
        description: 'Please fill in all required fields.', 
        variant: 'destructive' 
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        role: formData.role,
        department: formData.department as 'Technical' | 'Medical' | 'Administrative' | 'Support',
        experience: formData.experience ? Number(formData.experience) : undefined,
        email: formData.email,
        phone: formData.phone || '',
        qualifications: formData.qualifications || '',
        bio: formData.bio || '',
        status: formData.status,
        image: formData.image
      };

      let result;
      if (mode === 'edit' && initialData?.id) {
        result = await staffAPI.update(initialData.id, payload);
        toast({
          title: "Staff member updated successfully",
          description: `${result.name} has been updated`,
        });
        if (onSuccess) onSuccess(result);
      } else {
        result = await staffAPI.create(payload);
        toast({
          title: "Staff member added successfully",
          description: `${result.name} has been added to the team`,
        });
        navigate('/manage/staff');
      }
    } catch (error) {
      console.error('Error saving staff member:', error);
      toast({
        title: `Error ${mode === 'edit' ? 'updating' : 'adding'} staff member`,
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const availableRoles = formData.department ? roles[formData.department as keyof typeof roles] || [] : [];

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
                onClick={() => navigate('/manage/staff')}
                className="w-fit"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold truncate">Add New Staff Member</h2>
                <p className="text-muted-foreground text-sm md:text-base">Add a new staff member to the team</p>
              </div>
            </div>
          )}
          
          {/* Main Form Card */}
          <Card className="w-full">
            <CardHeader className="pb-4 md:pb-6">
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <User className="h-5 w-5" />
                Staff Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                
                {/* Staff Image Section - Responsive */}
                <div className="space-y-3">
                  <Label htmlFor="image" className="text-sm md:text-base font-medium">
                    Staff Photo
                  </Label>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Image Preview */}
                    <div className="flex-shrink-0">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 object-cover rounded-full border-2 border-muted shadow-sm" 
                        />
                      ) : (
                        <div className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-muted rounded-full border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
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
                      placeholder="Enter full name"
                      className="w-full"
                      required
                    />
                  </div>
                  
                  {/* Department Field */}
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-sm md:text-base font-medium">
                      Department <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.department} onValueChange={(value) => {
                      handleInputChange('department', value);
                      handleInputChange('role', ''); // Reset role when department changes
                    }}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Role Field */}
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm md:text-base font-medium">
                      Role <span className="text-destructive">*</span>
                    </Label>
                    <Select 
                      value={formData.role} 
                      onValueChange={(value) => handleInputChange('role', value)}
                      disabled={!formData.department}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={formData.department ? "Select role" : "Select department first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Experience Field */}
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-sm md:text-base font-medium">
                      Years of Experience
                    </Label>
                    <Input
                      id="experience"
                      type="number"
                      min="0"
                      max="50"
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      placeholder="Enter years"
                      className="w-full"
                    />
                  </div>
                  
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm md:text-base font-medium">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter email address"
                      className="w-full"
                      required
                    />
                  </div>
                  
                  {/* Phone Field */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm md:text-base font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full"
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
                </div>
                
                {/* Full Width Fields */}
                <div className="space-y-4 md:space-y-6">
                  {/* Qualifications Field */}
                  <div className="space-y-2">
                    <Label htmlFor="qualifications" className="text-sm md:text-base font-medium">
                      Qualifications
                    </Label>
                    <Textarea
                      id="qualifications"
                      value={formData.qualifications}
                      onChange={(e) => handleInputChange('qualifications', e.target.value)}
                      placeholder="Enter qualifications and certifications..."
                      rows={3}
                      className="w-full resize-none"
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
                      placeholder="Enter staff member biography..."
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
                      onClick={() => navigate('/manage/staff')}
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
                        {mode === 'edit' ? 'Update Staff Member' : 'Add Staff Member'}
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

export default StaffForm;