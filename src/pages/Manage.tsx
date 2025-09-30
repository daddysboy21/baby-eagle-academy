import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { AuthContextType } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Newspaper, 
  Camera, 
  Shield, 
  UserCheck,
  Settings,
  LogOut,
  FileText
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

  // Updated privilege system
  const isAdmin = user?.role === 'admin';
  const isCoAdmin = user?.role === 'co-admin';
  const isMediaPerson = user?.role === 'media-person';
  
  // Admin: Full access to everything
  const canManageUsers = isAdmin || isCoAdmin;
  const canManageApplications = isAdmin || isCoAdmin;
  const canManageContent = isAdmin || isCoAdmin || isMediaPerson;
  const canManageTeams = isAdmin || isCoAdmin || isMediaPerson;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link to="/" className="font-bold text-lg sm:text-xl text-primary">
                BEFA
              </Link>
              <Badge className={`${getRoleColor(user?.role || '')} text-xs px-2 py-1`}>
                {user?.role?.toUpperCase()}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
              <span className="text-xs sm:text-sm text-muted-foreground">
                Welcome, {user?.name}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Management Dashboard</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage BEFA content and users based on your role
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

          {/* User Management - Admin & Co-Admin only */}
          {canManageUsers && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>
                  {isAdmin ? "Manage all system users and permissions" : "Manage system users (limited permissions)"}
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

          {/* Players Management - Admin, Co-Admin & Media-Person */}
          {canManageTeams && (
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
          )}

          {/* Staff Management - Admin, Co-Admin & Media-Person */}
          {canManageTeams && (
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
          )}

          {/* News Management - Admin, Co-Admin & Media-Person */}
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

          {/* Gallery Management - Admin, Co-Admin & Media-Person */}
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

          {/* Applications Management - Admin & Co-Admin only */}
          {canManageApplications && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Applications
                </CardTitle>
                <CardDescription>
                  Review and manage incoming applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/manage/applications">
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    View Applications
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Personal Settings - Available to ALL roles */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Personal Settings
              </CardTitle>
              <CardDescription>
                Update your profile and password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/manage/personal-settings">
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  My Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Manage;