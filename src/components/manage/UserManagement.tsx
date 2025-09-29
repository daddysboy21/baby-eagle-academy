import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import type { AuthContextType } from '@/contexts/AuthContext';
import { UserRole } from '@/contexts/AuthContext';
import { UserPlus, Edit, Trash2, Shield, Users, Camera, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}


import { useEffect } from 'react';
import { usersAPI } from '@/services/api';


const UserForm: React.FC<{
  initialData?: User;
  mode?: 'add' | 'edit';
  onSuccess: (user: User) => void;
  onCancel: () => void;
}> = ({ initialData, mode = 'add', onSuccess, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    role: initialData?.role || 'media-person',
    password: '', // Only used for add mode
  });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result;
      if (mode === 'edit' && initialData?.id) {
        // Don't send password on edit
        const { password, ...updateData } = formData;
        result = await usersAPI.update(initialData.id, updateData);
        toast({ title: 'User updated', description: `${result.name} has been updated.` });
      } else {
        // Password is required for new user
        if (!formData.password) {
          toast({ title: 'Password required', description: 'Please enter a password for the new user.', variant: 'destructive' });
          setLoading(false);
          return;
        }
        result = await usersAPI.create(formData);
        toast({ title: 'User added', description: `${result.name} has been added as ${result.role}` });
      }
      onSuccess(result);
    } catch (error) {
      toast({
        title: `Error ${mode === 'edit' ? 'updating' : 'adding'} user`,
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter full name"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Enter email address"
        />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Select value={formData.role} onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="media-person">Media Person</SelectItem>
            <SelectItem value="co-admin">Co-Admin</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {mode === 'add' && (
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Enter password"
            autoComplete="new-password"
          />
        </div>
      )}
      <DialogFooter>
        <Button variant="outline" type="button" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" disabled={!formData.name || !formData.email || (mode === 'add' && !formData.password) || loading}>
          {mode === 'edit' ? 'Update User' : 'Add User'}
        </Button>
      </DialogFooter>
    </form>
  );
};

const UserManagement = () => {
  const { user } = useAuth() as AuthContextType;
  const { toast } = useToast();
  
  // Role-based permissions
  const canManageUsers = user?.role === 'admin' || user?.role === 'co-admin';
  const canAddAdmin = user?.role === 'admin';
  const canAddCoAdmin = user?.role === 'admin';
  const canAddMediaPerson = user?.role === 'admin' || user?.role === 'co-admin';
  
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await usersAPI.getAll();
        setUsers(data);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to fetch users', variant: 'destructive' });
      }
    };
    fetchUsers();
  }, [toast]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  // Add missing newUser state and handler
  const [newUser, setNewUser] = useState<{ name: string; email: string; role: UserRole; password: string }>(
    { name: '', email: '', role: 'media-person', password: '' }
  );

  const handleAddUser = async () => {
    try {
      if (!newUser.password) {
        toast({ title: 'Password required', description: 'Please enter a password for the new user.', variant: 'destructive' });
        return;
      }
      const created = await usersAPI.create(newUser);
      setUsers([...users, created]);
      setIsAddDialogOpen(false);
      setNewUser({ name: '', email: '', role: 'media-person', password: '' });
      toast({ title: 'User added', description: `${created.name} has been added.` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add user', variant: 'destructive' });
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'co-admin': return <Users className="h-4 w-4" />;
      case 'media-person': return <Camera className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'co-admin': return 'bg-orange-500';
      case 'media-person': return 'bg-blue-500';
    }
  };


  const handleAddUserSuccess = (user: User) => {
    setUsers([...users, user]);
    setIsAddDialogOpen(false);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleEditUserSuccess = (updated: User) => {
    setUsers(users.map(u => u.id === updated.id ? updated : u));
    setIsEditDialogOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await usersAPI.delete(userId);
      setUsers(users.filter(user => user.id !== userId));
      toast({
        title: "User deleted",
        description: "User has been removed from the system",
      });
    } catch (error) {
      toast({
        title: "Error deleting user",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 sm:mb-8">
          <Link to="/manage">
            <Button variant="outline" size="sm" className="w-fit">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">User Management</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Manage system users and their roles</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="w-full sm:w-auto">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xs sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account with appropriate permissions
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUser.role} onValueChange={(value: UserRole) => setNewUser({ ...newUser, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="media-person">Media Person</SelectItem>
                      <SelectItem value="co-admin">Co-Admin</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Enter password"
                    autoComplete="new-password"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser} disabled={!newUser.name || !newUser.email}>
                  Add User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {users.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-2">
                  <CardTitle className="text-base sm:text-lg">{user.name}</CardTitle>
                  <Badge className={`${getRoleColor(user.role)} text-white w-fit text-xs`}>
                    <div className="flex items-center gap-1">
                      {getRoleIcon(user.role)}
                      {user.role}
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-xs sm:text-sm">
                  <p className="text-muted-foreground truncate">{user.email}</p>
                  <p className="text-muted-foreground">
                    Added: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => handleEditUser(user)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Add User Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-xs sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account with appropriate permissions</DialogDescription>
            </DialogHeader>
            <UserForm
              mode="add"
              onSuccess={handleAddUserSuccess}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-xs sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user information below.</DialogDescription>
            </DialogHeader>
            {editingUser && (
              <UserForm
                mode="edit"
                initialData={editingUser}
                onSuccess={handleEditUserSuccess}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        {users.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-base sm:text-lg font-medium mb-2">No users found</h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">Add your first user to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;