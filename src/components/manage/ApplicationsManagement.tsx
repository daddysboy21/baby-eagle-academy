import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import type { AuthContextType } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  Search, 
  FileText, 
  Users, 
  Building, 
  Eye,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { applicationsAPI } from '@/services/api';
import { format } from 'date-fns';

interface BaseApplication {
  _id: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedBy?: {
    name: string;
    email: string;
  };
  reviewedAt?: string;
  reviewNotes?: string;
}

interface PlayerApplication extends BaseApplication {
  type: 'player';
  fullName: string;
  age: number;
  contact: string;
  email: string;
  schoolCommunity: string;
  position: string;
  photo?: string;
}

interface PartnerApplication extends BaseApplication {
  type: 'partner';
  fullNameCompany: string;
  email: string;
  phone: string;
  partnershipInterest: string;
}

interface FanApplication extends BaseApplication {
  type: 'fan';
  fullName: string;
  email: string;
  phone: string;
  whyJoin: string;
  photo?: string;
}

type Application = PlayerApplication | PartnerApplication | FanApplication;

interface ApplicationSummary {
  players: { total: number; pending: number };
  partners: { total: number; pending: number };
  fans: { total: number; pending: number };
}

interface FilterState {
  search: string;
  status: string;
  type: string;
}

interface SortState {
  field: 'name' | 'email' | 'createdAt' | 'status';
  direction: 'asc' | 'desc';
}

// Define response types for API calls
interface PlayerApplicationResponse {
  applications: PlayerApplication[];
}

interface PartnerApplicationResponse {
  applications: PartnerApplication[];
}

interface FanApplicationResponse {
  applications: FanApplication[];
}

interface ApplicationsSummaryResponse {
  summary: ApplicationSummary;
}

const ApplicationsManagement = () => {
  const { user } = useAuth() as AuthContextType;
  const { toast } = useToast();
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [summary, setSummary] = useState<ApplicationSummary>({
    players: { total: 0, pending: 0 },
    partners: { total: 0, pending: 0 },
    fans: { total: 0, pending: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  
  // Simplified filter and sort state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    type: 'all'
  });
  
  const [sort, setSort] = useState<SortState>({
    field: 'createdAt',
    direction: 'desc'
  });
  
  const loadApplicationsData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load summary data
      const summaryData = await applicationsAPI.getAllApplications() as ApplicationsSummaryResponse;
      setSummary(summaryData.summary);
      
      // Load all applications with proper typing
      const [playerData, partnerData, fanData] = await Promise.all([
        applicationsAPI.getPlayerApplications() as Promise<PlayerApplicationResponse>,
        applicationsAPI.getPartnerApplications() as Promise<PartnerApplicationResponse>,
        applicationsAPI.getFanApplications() as Promise<FanApplicationResponse>
      ]);
      
      const allApplications: Application[] = [
        ...playerData.applications.map((app: PlayerApplication) => ({ ...app, type: 'player' as const })),
        ...partnerData.applications.map((app: PartnerApplication) => ({ ...app, type: 'partner' as const })),
        ...fanData.applications.map((app: FanApplication) => ({ ...app, type: 'fan' as const }))
      ];
      
      setApplications(allApplications);
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
  }, [toast]);
  
  useEffect(() => {
    loadApplicationsData();
  }, [loadApplicationsData]);

  // Simplified filtering and sorting logic
  const filteredAndSortedApplications = useMemo(() => {
    const filtered = applications.filter(app => {
      // Search filter - searches in name, email, and other relevant fields
      const searchMatch = (() => {
        if (!filters.search) return true;
        const searchTerm = filters.search.toLowerCase();
        const name = getApplicationName(app).toLowerCase();
        const email = getApplicationEmail(app).toLowerCase();
        const phone = getApplicationPhone(app).toLowerCase();
        
        // Type-specific search fields
        let typeSpecificMatch = false;
        if (app.type === 'player') {
          typeSpecificMatch = app.schoolCommunity.toLowerCase().includes(searchTerm) ||
                            app.position.toLowerCase().includes(searchTerm);
        } else if (app.type === 'partner') {
          typeSpecificMatch = app.partnershipInterest.toLowerCase().includes(searchTerm);
        } else if (app.type === 'fan') {
          typeSpecificMatch = app.whyJoin.toLowerCase().includes(searchTerm);
        }
        
        return name.includes(searchTerm) || 
               email.includes(searchTerm) || 
               phone.includes(searchTerm) ||
               typeSpecificMatch;
      })();
      
      // Status filter
      const statusMatch = filters.status === 'all' || app.status === filters.status;
      
      // Type filter
      const typeMatch = filters.type === 'all' || app.type === filters.type;
      
      return searchMatch && statusMatch && typeMatch;
    });
    
    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;
      
      switch (sort.field) {
        case 'name':
          aValue = getApplicationName(a).toLowerCase();
          bValue = getApplicationName(b).toLowerCase();
          break;
        case 'email':
          aValue = getApplicationEmail(a).toLowerCase();
          bValue = getApplicationEmail(b).toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return filtered;
  }, [applications, filters, sort]);

  const handleStatusChange = async (application: Application, newStatus: 'approved' | 'rejected') => {
    try {
      let updateFunction;
      switch (application.type) {
        case 'player':
          updateFunction = applicationsAPI.updatePlayerStatus;
          break;
        case 'partner':
          updateFunction = applicationsAPI.updatePartnerStatus;
          break;
        case 'fan':
          updateFunction = applicationsAPI.updateFanStatus;
          break;
      }
      
      await updateFunction(application._id, newStatus, reviewNotes);
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app._id === application._id 
            ? { 
                ...app, 
                status: newStatus,
                reviewedAt: new Date().toISOString(),
                reviewedBy: { name: user?.name || '', email: user?.email || '' },
                reviewNotes 
              }
            : app
        )
      );
      
      // Update summary
      await loadApplicationsData();
      
      toast({
        title: "Success",
        description: `Application ${newStatus} successfully`,
      });
      
      setIsDetailDialogOpen(false);
      setReviewNotes('');
    } catch (error) {
      toast({
        title: "Error", 
        description: `Failed to ${newStatus} application`,
        variant: "destructive",
      });
    }
  };

  const openApplicationDetail = (application: Application) => {
    setSelectedApplication(application);
    setReviewNotes(application.reviewNotes || '');
    setIsDetailDialogOpen(true);
  };

  // Simplified clear filters function
  const clearAllFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      type: 'all'
    });
  };

  const handleSort = (field: SortState['field']) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
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

  const getApplicationName = (app: Application) => {
    switch (app.type) {
      case 'player':
      case 'fan':
        return app.fullName;
      case 'partner':
        return app.fullNameCompany;
    }
  };

  const getApplicationEmail = (app: Application) => {
    return app.email;
  };

  const getApplicationPhone = (app: Application) => {
    switch (app.type) {
      case 'player':
        return app.contact;
      case 'partner':
      case 'fan':
        return app.phone;
    }
  };

  const getSortIcon = (field: SortState['field']) => {
    if (sort.field !== field) return null;
    return sort.direction === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />;
  };

  // Simplified active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status !== 'all') count++;
    if (filters.type !== 'all') count++;
    return count;
  }, [filters]);

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
              <p className="text-muted-foreground text-sm sm:text-base">
                Review and manage incoming applications 
                {filteredAndSortedApplications.length !== applications.length && (
                  <span className="ml-1">
                    ({filteredAndSortedApplications.length} of {applications.length} shown)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Simplified Search and Filter Controls */}
        <Card className="mb-6">
          <CardContent className="p-4 sm:p-6 space-y-4">
            {/* Main search and basic filters only */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, phone, position, etc..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="w-[140px]" aria-label="Filter by status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="w-[120px]" aria-label="Filter by type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="player">Players</SelectItem>
                    <SelectItem value="partner">Partners</SelectItem>
                    <SelectItem value="fan">Fans</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Simplified active filters display */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {filters.search && (
                  <Badge variant="secondary" className="text-xs">
                    Search: {filters.search}
                  </Badge>
                )}
                {filters.status !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    Status: {filters.status}
                  </Badge>
                )}
                {filters.type !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    Type: {filters.type}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-6 px-2 text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}
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
              <p className="text-2xl font-bold mt-2">{summary.players.total}</p>
              <p className="text-xs text-muted-foreground">{summary.players.pending} pending</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Partner Applications</span>
              </div>
              <p className="text-2xl font-bold mt-2">{summary.partners.total}</p>
              <p className="text-xs text-muted-foreground">{summary.partners.pending} pending</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Fan Applications</span>
              </div>
              <p className="text-2xl font-bold mt-2">{summary.fans.total}</p>
              <p className="text-xs text-muted-foreground">{summary.fans.pending} pending</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Filtered Results</span>
              </div>
              <p className="text-2xl font-bold mt-2">{filteredAndSortedApplications.length}</p>
              <p className="text-xs text-muted-foreground">of {applications.length} total</p>
            </CardContent>
          </Card>
        </div>

        {/* Applications Table with sorting */}
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
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('name')}
                        className="h-auto p-0 font-medium"
                      >
                        Name
                        {getSortIcon('name')}
                      </Button>
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('email')}
                        className="h-auto p-0 font-medium"
                      >
                        Email
                        {getSortIcon('email')}
                      </Button>
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">Phone</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('status')}
                        className="h-auto p-0 font-medium"
                      >
                        Status
                        {getSortIcon('status')}
                      </Button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('createdAt')}
                        className="h-auto p-0 font-medium"
                      >
                        Submitted
                        {getSortIcon('createdAt')}
                      </Button>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedApplications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No applications found matching your filters.
                        {activeFiltersCount > 0 && (
                          <Button
                            variant="link"
                            onClick={clearAllFilters}
                            className="ml-2"
                          >
                            Clear filters
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedApplications.map((app) => (
                      <TableRow key={app._id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(app.type)}
                            <span className="capitalize">{app.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{getApplicationName(app)}</TableCell>
                        <TableCell className="hidden sm:table-cell">{getApplicationEmail(app)}</TableCell>
                        <TableCell className="hidden lg:table-cell">{getApplicationPhone(app)}</TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {format(new Date(app.createdAt), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openApplicationDetail(app)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Application Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review and update application status
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              {/* Application Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Type:</strong> {selectedApplication.type}</p>
                    <p><strong>Name:</strong> {getApplicationName(selectedApplication)}</p>
                    <p><strong>Email:</strong> {getApplicationEmail(selectedApplication)}</p>
                    <p><strong>Phone:</strong> {getApplicationPhone(selectedApplication)}</p>
                    <p><strong>Status:</strong> {getStatusBadge(selectedApplication.status)}</p>
                    <p><strong>Submitted:</strong> {format(new Date(selectedApplication.createdAt), 'PPpp')}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Additional Details</h4>
                  <div className="space-y-2 text-sm">
                    {selectedApplication.type === 'player' && (
                      <>
                        <p><strong>Age:</strong> {selectedApplication.age}</p>
                        <p><strong>Position:</strong> {selectedApplication.position}</p>
                        <p><strong>School/Community:</strong> {selectedApplication.schoolCommunity}</p>
                      </>
                    )}
                    {selectedApplication.type === 'partner' && (
                      <p><strong>Interest:</strong> {selectedApplication.partnershipInterest}</p>
                    )}
                    {selectedApplication.type === 'fan' && (
                      <p><strong>Why Join:</strong> {selectedApplication.whyJoin}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Photo if available */}
              {(selectedApplication.type === 'player' || selectedApplication.type === 'fan') && selectedApplication.photo && (
                <div>
                  <h4 className="font-semibold mb-2">Photo</h4>
                  <img 
                    src={selectedApplication.photo} 
                    alt="Application photo" 
                    className="w-24 h-24 object-cover rounded border"
                  />
                </div>
              )}

              {/* Review Notes */}
              <div>
                <h4 className="font-semibold mb-2">Review Notes</h4>
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add review notes..."
                  rows={3}
                />
              </div>

              {/* Previous Review Info */}
              {selectedApplication.reviewedBy && (
                <div className="bg-muted p-3 rounded">
                  <h4 className="font-semibold mb-2">Previous Review</h4>
                  <p className="text-sm"><strong>Reviewed by:</strong> {selectedApplication.reviewedBy.name}</p>
                  <p className="text-sm"><strong>Date:</strong> {selectedApplication.reviewedAt ? format(new Date(selectedApplication.reviewedAt), 'PPpp') : 'N/A'}</p>
                  {selectedApplication.reviewNotes && (
                    <p className="text-sm"><strong>Notes:</strong> {selectedApplication.reviewNotes}</p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              {selectedApplication.status === 'pending' && (
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleStatusChange(selectedApplication, 'approved')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve Application
                  </Button>
                  <Button
                    onClick={() => handleStatusChange(selectedApplication, 'rejected')}
                    variant="destructive"
                  >
                    Reject Application
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationsManagement;