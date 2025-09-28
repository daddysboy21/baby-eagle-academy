import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Users, Calendar, Mail, Phone, Award, User } from "lucide-react";
import { Link } from "react-router-dom";
import { staffAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface Staff {
  id: string;
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
  createdAt: string;
}

const Staff = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await staffAPI.getAll();
        setStaff(data);
      } catch (err) {
        setError("Failed to load staff");
        toast({
          title: "Error",
          description: "Failed to load staff members",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, [toast]);

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "Technical": return "bg-blue-500 text-white";
      case "Medical": return "bg-red-500 text-white";
      case "Administrative": return "bg-purple-500 text-white";
      case "Support": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading staff...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 sm:mb-8">
          <Link to="/">
            <Button variant="outline" size="sm" className="w-fit">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Our Staff</h1>
            <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">Meet the dedicated professionals behind Baby Eagle Football Academy</p>
          </div>
        </div>

        {staff.length === 0 && !loading ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No staff members found</h3>
            <p className="text-muted-foreground">Staff information will be displayed here once available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {staff.filter(member => member.status === 'active').map((member) => (
              <Dialog key={member.id}>
                <DialogTrigger asChild>
                  <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3 mb-2">
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-20 h-20 rounded-full object-cover border border-primary/20"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-500" />
                          </div>
                        )}
                        <div className="flex-1">
                          <CardTitle className="text-base sm:text-lg">{member.name}</CardTitle>
                          <p className="text-xs sm:text-sm font-medium text-primary">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={`${getDepartmentColor(member.department)} text-xs`}>
                          {member.department}
                        </Badge>
                        <Badge variant="outline" className={`${getStatusColor(member.status)} text-xs`}>
                          {member.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      {member.experience && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{member.experience} years experience</span>
                        </div>
                      )}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-muted-foreground truncate">{member.email}</span>
                        </div>
                        {member.phone && (
                          <div className="flex items-center gap-2 text-xs sm:text-sm">
                            <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground">{member.phone}</span>
                          </div>
                        )}
                      </div>
                      {member.bio && (
                        <div className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
                          {member.bio}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </DialogTrigger>
                
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-8 h-8 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-bold">{member.name}</h3>
                        <p className="text-base text-primary font-medium">{member.role}</p>
                      </div>
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge className={`${getDepartmentColor(member.department)}`}>
                        {member.department}
                      </Badge>
                      <Badge variant="outline" className={`${getStatusColor(member.status)}`}>
                        {member.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {member.experience && (
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm">{member.experience} years of experience</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm">{member.email}</span>
                      </div>
                      
                      {member.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm">{member.phone}</span>
                        </div>
                      )}
                      
                      {member.qualifications && (
                        <div className="flex items-start gap-3">
                          <Award className="w-5 h-5 text-muted-foreground mt-0.5" />
                          <div>
                            <h4 className="font-medium mb-1">Qualifications</h4>
                            <p className="text-sm text-muted-foreground">{member.qualifications}</p>
                          </div>
                        </div>
                      )}
                      
                      {member.bio && (
                        <div>
                          <h4 className="font-medium mb-2">Biography</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Staff;