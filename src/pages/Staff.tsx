import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Users, Calendar, Mail, Phone, Award } from "lucide-react";
import { Link } from "react-router-dom";

const Staff = () => {
  const staff = [
    {
      id: 1,
      name: "Kafumba Kenneh",
      position: "CEO/President",
      department: "Management",
      experience: "5 years",
      email: "kafumba@babyeaglefa.com",
      phone: "+231779137667",
      bio: "Kafumba has been leading the academy since 2021, focusing on strategic development and community partnerships. His vision has transformed the academy into one of Liberia's premier youth football institutions.",
      qualifications: ["CAF C License", "Sports Management Diploma", "Community Leadership Certificate"],
      achievements: ["Led academy to Third Division promotion", "Established 15+ community partnerships", "Mentored 200+ young athletes"]
    },
    {
      id: 2,
      name: "Abdullah L. Bility",
      position: "Founder & Technical Advisor",
      department: "Management", 
      experience: "6 years",
      email: "abdullah@babyeaglefa.com",
      phone: "+231881111888",
      bio: "Co-founder of Baby Eagle Football Academy with a passion for youth development. Abdullah continues to provide technical guidance and maintains the academy's founding principles.",
      qualifications: ["CAF B License", "Youth Development Certificate", "Coaching Methodology"],
      achievements: ["Founded the academy in 2018", "Developed training curriculum", "Established academy philosophy"]
    },
    {
      id: 3,
      name: "Foday Sanoe",
      position: "Vice President",
      department: "Management",
      experience: "6 years", 
      email: "foday@babyeaglefa.com",
      phone: "+231776043008",
      bio: "Co-founder and Vice President, Foday oversees daily operations and player development programs. His hands-on approach ensures quality training and player welfare.",
      qualifications: ["CAF C License", "Player Development Certificate", "First Aid Certification"],
      achievements: ["Co-founded the academy", "Developed welfare programs", "Mentored coaching staff"]
    },
    {
      id: 4,
      name: "Coach Marcus Doe",
      position: "Head Coach",
      department: "Technical Staff",
      experience: "8 years",
      email: "marcus@babyeaglefa.com", 
      phone: "+231555123456",
      bio: "An experienced coach with a proven track record in youth development. Marcus focuses on technical skills development and tactical understanding.",
      qualifications: ["CAF A License", "UEFA Youth Development", "Sports Psychology"],
      achievements: ["Led team to regional championships", "Developed 50+ professional players", "Coach of the Year 2023"]
    },
    {
      id: 5,
      name: "Sarah Kpangbah",
      position: "Assistant Coach",
      department: "Technical Staff",
      experience: "4 years",
      email: "sarah@babyeaglefa.com",
      phone: "+231555789012", 
      bio: "A dedicated coach specializing in fundamental skills and player mentorship. Sarah is passionate about developing well-rounded athletes.",
      qualifications: ["CAF C License", "Youth Coaching Certificate", "Child Protection Training"],
      achievements: ["Improved player retention by 40%", "Established girls' program", "Community Coach Award 2024"]
    },
    {
      id: 6,
      name: "Dr. James Wilson",
      position: "Head Medic",
      department: "Medical Staff",
      experience: "10 years",
      email: "drwilson@babyeaglefa.com",
      phone: "+231555345678",
      bio: "A qualified sports medicine doctor ensuring player health and injury prevention. Dr. Wilson has worked with several professional clubs in West Africa.",
      qualifications: ["Medical Degree", "Sports Medicine Specialist", "FIFA Medical Certificate"],
      achievements: ["Reduced injury rates by 60%", "Implemented nutrition programs", "Medical Excellence Award"]
    },
    {
      id: 7,
      name: "Grace Mulbah",
      position: "Finance Manager",
      department: "Administration",
      experience: "6 years",
      email: "grace@babyeaglefa.com",
      phone: "+231555901234",
      bio: "An experienced financial manager overseeing the academy's budget and funding initiatives. Grace ensures transparent financial operations.",
      qualifications: ["Accounting Degree", "CPA Certification", "Non-profit Management"],
      achievements: ["Secured $50K+ in grants", "Implemented financial transparency", "Cost reduction of 25%"]
    },
    {
      id: 8,
      name: "Peter Kollie",
      position: "Goalkeeper Coach",
      department: "Technical Staff",
      experience: "7 years",
      email: "peter@babyeaglefa.com",
      phone: "+231555567890",
      bio: "Former professional goalkeeper specializing in developing young keepers. Peter's expertise has produced several talented goalkeepers.",
      qualifications: ["Goalkeeper Coaching License", "Former Professional Player", "Youth Development"],
      achievements: ["Trained 3 national team keepers", "Goalkeeper Academy Excellence", "Technical Innovation Award"]
    }
  ];

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "Management": return "default";
      case "Technical Staff": return "secondary";
      case "Medical Staff": return "destructive";
      case "Administration": return "outline";
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
            <Dialog key={member.id}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <div className="flex flex-col gap-2">
                      <Badge variant={getDepartmentColor(member.department)} className="w-fit">
                        {member.department}
                      </Badge>
                      <p className="text-sm font-medium text-primary">{member.position}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {member.experience} experience
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
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">{member.name}</DialogTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={getDepartmentColor(member.department)}>
                      {member.department}
                    </Badge>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm font-medium">{member.position}</span>
                  </div>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{member.phone}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">About</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Qualifications</h4>
                    <ul className="space-y-1">
                      {member.qualifications.map((qualification, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <Award className="w-3 h-3 text-primary" />
                          {qualification}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Key Achievements</h4>
                    <ul className="space-y-1">
                      {member.achievements.map((achievement, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <Users className="w-3 h-3 text-primary" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-center">
                      <div className="font-semibold text-lg text-primary">{member.experience}</div>
                      <div className="text-xs text-muted-foreground">Total Experience</div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Staff;