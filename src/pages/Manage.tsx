import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { AuthContextType } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserPlus, 
  Newspaper, 
  Camera, 
  Shield, 
  UserCheck,
  Settings,
  LogOut
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Manage = () => {
  const { user, logout } = useAuth() as AuthContextType;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500';
      case 'co-admin':
        return 'bg-orange-500';
      case 'media-person':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const canManageUsers = user?.role === 'admin' || user?.role === 'co-admin';
  const canManageContent = true; // All roles can manage some content
  const canAddAdmins = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="font-bold text-xl text-primary">
                BEFA
              </Link>
              <Badge className={getRoleColor(user?.role || '')}>
                {user?.role?.toUpperCase()}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.name}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Management Dashboard</h1>
          <p className="text-muted-foreground">
            Manage BEFA content and users based on your role
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Management */}
          {canManageUsers && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage system users and permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/manage/users">
                  <Button className="w-full justify-start" variant="outline">
                    <UserCheck className="h-4 w-4 mr-2" />
                    View All Users
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Players Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Players
              </CardTitle>
              <CardDescription>
                Manage players and team roster
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/manage/players">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Players
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Staff Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Staff
              </CardTitle>
              <CardDescription>
                Manage coaching staff and personnel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/manage/staff">
                <Button className="w-full justify-start" variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Manage Staff
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* News Management */}
          {canManageContent && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Newspaper className="h-5 w-5" />
                  News
                </CardTitle>
                <CardDescription>
                  Create and manage news articles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/manage/news">
                  <Button className="w-full justify-start" variant="outline">
                    <Newspaper className="h-4 w-4 mr-2" />
                    Manage News
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Gallery Management */}
          {canManageContent && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Gallery
                </CardTitle>
                <CardDescription>
                  Manage photos and media content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/manage/gallery">
                  <Button className="w-full justify-start" variant="outline">
                    <Camera className="h-4 w-4 mr-2" />
                    Manage Gallery
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Manage;