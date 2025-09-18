import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Edit, Trash2, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  experience: number;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Mock data - replace with API calls
const mockStaff: Staff[] = [
  { 
    id: '1', 
    name: 'Coach Johnson', 
    role: 'Head Coach', 
    department: 'Technical', 
    experience: 10, 
    email: 'coach@befa.com', 
    phone: '+233 123 456 789',
    status: 'active', 
    createdAt: '2024-01-01' 
  },
  { 
    id: '2', 
    name: 'Dr. Sarah Wilson', 
    role: 'Team Doctor', 
    department: 'Medical', 
    experience: 8, 
    email: 'doctor@befa.com', 
    phone: '+233 987 654 321',
    status: 'active', 
    createdAt: '2024-01-15' 
  },
  { 
    id: '3', 
    name: 'Mark Thompson', 
    role: 'Fitness Coach', 
    department: 'Technical', 
    experience: 5, 
    email: 'fitness@befa.com', 
    phone: '+233 555 666 777',
    status: 'active', 
    createdAt: '2024-02-01' 
  },
];

const StaffManagement = () => {
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-500' : 'bg-gray-500';
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'Technical': return 'bg-blue-500';
      case 'Medical': return 'bg-red-500';
      case 'Administrative': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    try {
      // TODO: Replace with your backend API call
      setStaff(staff.filter(member => member.id !== staffId));
      
      toast({
        title: "Staff member deleted",
        description: "Staff member has been removed from the team",
      });
    } catch (error) {
      toast({
        title: "Error deleting staff member",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Staff Management</h2>
          <p className="text-muted-foreground">Manage coaching staff and team personnel</p>
        </div>
        
        <Link to="/manage/staff/add">
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Staff Member
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((member) => (
          <Card key={member.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <Badge className={`${getStatusColor(member.status)} text-white`}>
                  {member.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className={`${getDepartmentColor(member.department)} text-white text-xs`}>
                    {member.department}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">{member.role}</p>
                  <p className="text-xs text-muted-foreground">{member.experience} years experience</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                  <p className="text-xs text-muted-foreground">{member.phone}</p>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteStaff(member.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {staff.length === 0 && (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No staff members found</h3>
          <p className="text-muted-foreground mb-4">Add your first staff member to get started</p>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;