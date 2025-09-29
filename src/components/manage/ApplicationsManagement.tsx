import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import type { AuthContextType } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  Search, 
  FileText, 
  Users, 
  Building, 
  Eye,
  Download,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Application {
  id: string;
  type: 'player' | 'partner' | 'fan';
  name: string;
  email: string;
  phone: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  data: any;
}

const ApplicationsManagement = () => {
  const { user } = useAuth() as AuthContextType;
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API calls
      const mockApplications: Application[] = [
        {
          id: '1',
          type: 'player',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+231555123456',
          submittedAt: '2024-01-15T10:30:00Z',
          status: 'pending',
          data: {
            position: 'Forward',
            age: 18,
            experience: '2 years'
          }
        },
        {
          id: '2', 
          type: 'partner',
          name: 'ABC Company',
          email: 'contact@abc.com',
          phone: '+231555789012',
          submittedAt: '2024-01-14T14:20:00Z',
          status: 'approved',
          data: {
            companyType: 'Sponsorship',
            proposal: 'Equipment sponsorship'
          }
        },
        {
          id: '3',
          type: 'fan',
          name: 'Mary Johnson',
          email: 'mary@example.com', 
          phone: '+231555345678',
          submittedAt: '2024-01-13T09:15:00Z',
          status: 'pending',
          data: {
            membershipType: 'Standard',
            interests: 'Match attendance'
          }
        }
      ];
      
      setApplications(mockApplications);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      // Replace with actual API call
      setApplications(prev => 
        prev.map(app => 
          app.id === id ? { ...app, status: newStatus } : app
        )
      );
      
      toast({
        title: "Success",
        description: `Application ${newStatus} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: `Failed to ${newStatus} application`,
        variant: "destructive",
      });
    }
  };

  const exportApplications = () => {
    const csv = [
      ['ID', 'Type', 'Name', 'Email', 'Phone', 'Status', 'Submitted'],
      ...applications.map(app => [
        app.id,
        app.type,
        app.name,
        app.email,
        app.phone,
        app.status,
        new Date(app.submittedAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'applications.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'player':
        return <Users className="h-4 w-4" />;
      case 'partner':
        return <Building className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const groupedApplications = {
    player: filteredApplications.filter(app => app.type === 'player'),
    partner: filteredApplications.filter(app => app.type === 'partner'), 
    fan: filteredApplications.filter(app => app.type === 'fan')
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/manage">
              <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Applications Management</h1>
              <p className="text-muted-foreground text-sm sm:text-base">Review and manage incoming applications</p>
            </div>
          </div>
          
          <Button onClick={exportApplications} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
        </div>

        {/* Search and Filter Controls */}
        <Card className="mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Player Applications</span>
              </div>
              <p className="text-2xl font-bold mt-2">{groupedApplications.player.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Partner Applications</span>
              </div>
              <p className="text-2xl font-bold mt-2">{groupedApplications.partner.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Fan Applications</span>
              </div>
              <p className="text-2xl font-bold mt-2">{groupedApplications.fan.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Pending Review</span>
              </div>
              <p className="text-2xl font-bold mt-2">
                {applications.filter(app => app.status === 'pending').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Applications Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Applications</TabsTrigger>
            <TabsTrigger value="player">Players</TabsTrigger>
            <TabsTrigger value="partner">Partners</TabsTrigger>
            <TabsTrigger value="fan">Fans</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Applications</CardTitle>
                <CardDescription>
                  Complete list of all application submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden sm:table-cell">Email</TableHead>
                        <TableHead className="hidden lg:table-cell">Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTypeIcon(app.type)}
                              <span className="capitalize">{app.type}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{app.name}</TableCell>
                          <TableCell className="hidden sm:table-cell">{app.email}</TableCell>
                          <TableCell className="hidden lg:table-cell">{app.phone}</TableCell>
                          <TableCell>{getStatusBadge(app.status)}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(app.submittedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {app.status === 'pending' && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleStatusChange(app.id, 'approved')}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleStatusChange(app.id, 'rejected')}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              <Button variant="outline" size="sm">
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {Object.entries(groupedApplications).map(([type, typeApplications]) => (
            <TabsContent key={type} value={type}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getTypeIcon(type)}
                    <span className="capitalize">{type} Applications</span>
                  </CardTitle>
                  <CardDescription>
                    {type === 'player' && 'Applications from aspiring football players'}
                    {type === 'partner' && 'Partnership proposals and sponsorship requests'}
                    {type === 'fan' && 'Fan club membership applications'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead className="hidden sm:table-cell">Email</TableHead>
                          <TableHead className="hidden lg:table-cell">Phone</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="hidden md:table-cell">Submitted</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {typeApplications.map((app) => (
                          <TableRow key={app.id}>
                            <TableCell className="font-medium">{app.name}</TableCell>
                            <TableCell className="hidden sm:table-cell">{app.email}</TableCell>
                            <TableCell className="hidden lg:table-cell">{app.phone}</TableCell>
                            <TableCell>{getStatusBadge(app.status)}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {new Date(app.submittedAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {app.status === 'pending' && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleStatusChange(app.id, 'approved')}
                                      className="text-green-600 hover:text-green-700"
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleStatusChange(app.id, 'rejected')}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                                <Button variant="outline" size="sm">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default ApplicationsManagement;