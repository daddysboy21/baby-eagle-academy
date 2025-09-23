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
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Our Staff</h1>
            <p className="text-muted-foreground mt-2">Meet the dedicated professionals behind Baby Eagle Football Academy</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <div className="flex flex-col gap-2">
                  <Badge variant={getDepartmentColor(member.department)} className="w-fit">
                    {member.department}
                  </Badge>
                  <p className="text-sm font-medium text-primary">{member.role}</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {member.experience} years experience
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{member.phone}</span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
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