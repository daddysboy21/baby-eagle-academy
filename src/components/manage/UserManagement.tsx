import React, { useState, useEffect } from 'react';
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
import { usersAPI } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

const UserForm: React.FC<{
  initialData?: User;
  mode?: 'add' | 'edit';
  onSuccess: (user: User) => void;
  onCancel: () => void;
  allowedRoles: UserRole[];
}> = ({ initialData, mode = 'add', onSuccess, onCancel, allowedRoles }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    role: initialData?.role || (allowedRoles.includes('media-person') ? 'media-person' : allowedRoles[0]),
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
          required
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
          required
        />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Select 
          value={formData.role} 
          onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {allowedRoles.includes('media-person') && (
              <SelectItem value="media-person">Media Person</SelectItem>
            )}
            {allowedRoles.includes('co-admin') && (
              <SelectItem value="co-admin">Co-Admin</SelectItem>
            )}
            {allowedRoles.includes('admin') && (
              <SelectItem value="admin">Admin</SelectItem>
            )}
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
            placeholder="Enter password (min 6 characters)"
            autoComplete="new-password"
            minLength={6}
            required
          />
        </div>
      )}
      <DialogFooter>
        <Button variant="outline" type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!formData.name || !formData.email || (mode === 'add' && !formData.password) || loading}
        >
          {loading ? 'Processing...' : (mode === 'edit' ? 'Update User' : 'Add User')}
        </Button>
      </DialogFooter>
    </form>
  );
};

const UserManagement = () => {
  const { user } = useAuth() as AuthContextType;
  const { toast } = useToast();
  
  // Role-based permissions
  const isAdmin = user?.role === 'admin';
  const isCoAdmin = user?.role === 'co-admin';
  
  const canManageUsers = isAdmin || isCoAdmin;
  const canAddAdmin = isAdmin;
  const canAddCoAdmin = isAdmin;
  const canAddMediaPerson = isAdmin || isCoAdmin;
  
  // Determine which roles this user can add
  const allowedRolesToAdd: UserRole[] = [];
  if (canAddMediaPerson) allowedRolesToAdd.push('media-person');
  if (canAddCoAdmin) allowedRolesToAdd.push('co-admin');
  if (canAddAdmin) allowedRolesToAdd.push('admin');
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await usersAPI.getAll();
        setUsers(data);
      } catch (error) {
        toast({ 
          title: 'Error', 
          description: 'Failed to fetch users', 
          variant: 'destructive' 
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (canManageUsers) {
      fetchUsers();
    }
  }, [toast, canManageUsers]);

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
    // Check if current user can edit this user's role
    const canEditThisUser = isAdmin || (isCoAdmin && user.role === 'media-person');
    
    if (!canEditThisUser) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to edit this user",
        variant: "destructive",
      });
      return;
    }
    
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleEditUserSuccess = (updated: User) => {
    setUsers(users.map(u => u.id === updated.id ? updated : u));
    setIsEditDialogOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = async (userId: string, userRole: UserRole) => {
    // Check if current user can delete this user
    const canDeleteThisUser = isAdmin || (isCoAdmin && userRole === 'media-person');
    
    if (!canDeleteThisUser) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to delete this user",
        variant: "destructive",
      });
      return;
    }

    // Prevent user from deleting themselves
    if (userId === user?.id) {
      toast({
        title: "Cannot Delete",
        description: "You cannot delete your own account",
        variant: "destructive",
      });
      return;
    }

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

  // If user doesn't have permission to manage users
  if (!canManageUsers) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">
            You don't have permission to manage users.
          </p>
          <Link to="/manage">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage system users and their roles
              {isCoAdmin && " (limited to media persons)"}
            </p>
          </div
          >
          
          {/* Add User Button - Only show if user can add at least one role */}
          {allowedRolesToAdd.length > 0 && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="w-full sm:w-auto">
                  <UserPlus className="h-4 w-4 mr-2" />
                  {isAdmin ? "Add User" : "Add Media Person"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xs sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account with appropriate permissions
                    {isCoAdmin && " (you can only add media persons)"}
                  </DialogDescription>
                </DialogHeader>
                <UserForm
                  mode="add"
                  onSuccess={handleAddUserSuccess}
                  onCancel={() => setIsAddDialogOpen(false)}
                  allowedRoles={allowedRolesToAdd}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {users.map((userItem) => {
              const canEdit = isAdmin || (isCoAdmin && userItem.role === 'media-person');
              const canDelete = isAdmin || (isCoAdmin && userItem.role === 'media-person');
              const isCurrentUser = userItem.id === user?.id;

              return (
                <Card key={userItem.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col gap-2">
                      <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                        {userItem.name}
                        {isCurrentUser && (
                          <Badge variant="outline" className="text-xs">You</Badge>
                        )}
                      </CardTitle>
                      <Badge className={`${getRoleColor(userItem.role)} text-white w-fit text-xs`}>
                        <div className="flex items-center gap-1">
                          {getRoleIcon(userItem.role)}
                          {userItem.role}
                        </div>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-xs sm:text-sm">
                      <p className="text-muted-foreground truncate">{userItem.email}</p>
                      <p className="text-muted-foreground">
                        Added: {new Date(userItem.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-xs" 
                        onClick={() => handleEditUser(userItem)}
                        disabled={!canEdit}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteUser(userItem.id, userItem.role)}
                        disabled={!canDelete || isCurrentUser}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

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
                allowedRoles={allowedRolesToAdd}
              />
            )}
          </DialogContent>
        </Dialog>

        {users.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-base sm:text-lg font-medium mb-2">No users found</h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              {allowedRolesToAdd.length > 0 
                ? "Add your first user to get started" 
                : "No users available for your permission level"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;