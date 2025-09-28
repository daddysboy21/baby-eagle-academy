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
import { staffAPI } from '@/services/api';

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
      toast({ title: 'Missing required fields', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }

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
    }
  };

  const availableRoles = formData.department ? roles[formData.department as keyof typeof roles] || [] : [];

  return (
    <div className="space-y-6">
      {mode === 'add' ? (
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/manage/staff')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Add New Staff Member</h2>
            <p className="text-muted-foreground">Add a new staff member to the team</p>
          </div>
        </div>
      ) : null}
      
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Staff Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Staff Image */}
            <div>
              <Label htmlFor="image">Staff Photo</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mb-2"
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-full border" />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="department">Department *</Label>
                <Select value={formData.department} onValueChange={(value) => {
                  handleInputChange('department', value);
                  handleInputChange('role', ''); // Reset role when department changes
                }}>
                  <SelectTrigger>
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
              
              <div>
                <Label htmlFor="role">Role *</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
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
              
              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  placeholder="Enter years of experience"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
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
            
            <div>
              <Label htmlFor="qualifications">Qualifications</Label>
              <Textarea
                id="qualifications"
                value={formData.qualifications}
                onChange={(e) => handleInputChange('qualifications', e.target.value)}
                placeholder="Enter qualifications and certifications..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="bio">Biography</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Enter staff member biography..."
                rows={4}
              />
            </div>
            
            <div className="flex gap-4">
              {mode === 'add' ? (
                <Button type="button" variant="outline" onClick={() => navigate('/manage/staff')}>Cancel</Button>
              ) : (
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
              )}
              <Button type="submit">
                {mode === 'edit' ? 'Update Staff Member' : 'Add Staff Member'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffForm;