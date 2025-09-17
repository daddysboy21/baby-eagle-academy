import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Users, Calendar, MapPin, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const Players = () => {
  const players = [
    {
      id: 1,
      name: "Mohamed Kamara",
      position: "Forward",
      age: 16,
      team: "U17 Team",
      goals: 12,
      assists: 8,
      bio: "A promising young striker with excellent finishing ability and pace. Mohamed has been with the academy for 3 years and is one of our top scorers.",
      achievements: ["Top Scorer U17 2024", "Player of the Month - March 2024"],
      community: "New Kru Town"
    },
    {
      id: 2,
      name: "Blessing Toe",
      position: "Midfielder", 
      age: 15,
      team: "U15 Team",
      goals: 6,
      assists: 15,
      bio: "A creative midfielder with exceptional vision and passing ability. Blessing is known for creating opportunities for teammates and controlling the tempo of the game.",
      achievements: ["Most Assists U15 2024", "Academy Leadership Award"],
      community: "Jamaica Road"
    },
    {
      id: 3,
      name: "Prince Johnson",
      position: "Goalkeeper",
      age: 17,
      team: "U17 Team", 
      saves: 89,
      cleanSheets: 14,
      bio: "A reliable goalkeeper with quick reflexes and strong communication skills. Prince has been instrumental in the team's defensive success.",
      achievements: ["Best Goalkeeper U17 2024", "Clean Sheet Record Holder"],
      community: "Waterside"
    },
    {
      id: 4,
      name: "Grace Wilson",
      position: "Defender",
      age: 16,
      team: "Girls U17 Team",
      goals: 3,
      assists: 7,
      bio: "A solid defender with excellent tackling and aerial ability. Grace is also a leader on and off the pitch, inspiring her teammates.",
      achievements: ["Defensive Player of the Year 2024", "Team Captain"],
      community: "Caldwell"
    },
    {
      id: 5,
      name: "Emmanuel Varney",
      position: "Winger",
      age: 14,
      team: "U15 Team",
      goals: 9,
      assists: 11,
      bio: "A speedy winger with great dribbling skills and the ability to create chances from wide positions. Emmanuel is one of our youngest talents.",
      achievements: ["Young Player of the Year 2024", "Most Improved Player"],
      community: "Paynesville"
    },
    {
      id: 6,
      name: "Mariam Konneh",
      position: "Forward",
      age: 15,
      team: "Girls U15 Team",
      goals: 18,
      assists: 5,
      bio: "A natural goal scorer with excellent positioning and finishing. Mariam is our top female scorer and a role model for younger players.",
      achievements: ["Top Female Scorer 2024", "Girls Team MVP"],
      community: "Red Light"
    }
  ];

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
            <h1 className="text-4xl font-bold text-foreground">Our Players</h1>
            <p className="text-muted-foreground mt-2">Meet the talented young athletes of Baby Eagle Football Academy</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player) => (
            <Dialog key={player.id}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{player.name}</CardTitle>
                      <Badge variant="secondary">{player.position}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Age {player.age}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {player.team}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-1 mb-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{player.community}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-lg text-primary">
                          {player.goals || player.saves || 0}
                        </div>
                        <div className="text-muted-foreground">
                          {player.position === "Goalkeeper" ? "Saves" : "Goals"}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-lg text-primary">
                          {player.assists || player.cleanSheets || 0}
                        </div>
                        <div className="text-muted-foreground">
                          {player.position === "Goalkeeper" ? "Clean Sheets" : "Assists"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl">{player.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{player.position}</Badge>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm">{player.team}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{player.community}</span>
                  </div>

                  <p className="text-sm leading-relaxed">{player.bio}</p>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Achievements</h4>
                    <ul className="space-y-1">
                      {player.achievements.map((achievement, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <Trophy className="w-3 h-3 text-primary" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="font-semibold text-xl text-primary">
                        {player.goals || player.saves || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {player.position === "Goalkeeper" ? "Total Saves" : "Goals Scored"}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-xl text-primary">
                        {player.assists || player.cleanSheets || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {player.position === "Goalkeeper" ? "Clean Sheets" : "Assists Made"}
                      </div>
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

export default Players;