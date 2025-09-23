import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Users, Calendar, Mail, Phone, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { staffAPI } from "@/services/api";

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await staffAPI.getAll();
        setStaff(data);
      } catch (err) {
        setError("Failed to load staff");
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "Technical": return "secondary";
      case "Medical": return "destructive";
      case "Administrative": return "outline";
      default: return "default";
    }
  };

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {staff.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">{member.name}</CardTitle>
                <div className="flex flex-col gap-2">
                  <Badge variant={getDepartmentColor(member.department)} className="w-fit text-xs">
                    {member.department}
                  </Badge>
                  <p className="text-xs sm:text-sm font-medium text-primary">{member.role}</p>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>{member.experience} years experience</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">{member.phone}</span>
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
                  {member.bio}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Staff;