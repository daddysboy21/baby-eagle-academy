import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Users, Calendar, MapPin, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { playersAPI } from "@/services/api";

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await playersAPI.getAll();
        setPlayers(data);
      } catch (err) {
        setError("Failed to load players");
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

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
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Our Players</h1>
            <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">Meet the talented young athletes of Baby Eagle Football Academy</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {players.map((player) => (
            <Card key={player.id} className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <CardTitle className="text-base sm:text-lg">{player.name}</CardTitle>
                  <Badge variant="secondary" className="w-fit">{player.position}</Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    Age {player.age}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                    {player.nationality}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm mb-3">
                  <div className="text-center">
                    <div className="font-semibold text-base sm:text-lg text-primary">
                      #{player.jerseyNumber}
                    </div>
                    <div className="text-muted-foreground text-xs">Jersey Number</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-base sm:text-lg text-primary">
                      {player.status}
                    </div>
                    <div className="text-muted-foreground text-xs">Status</div>
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
                  {player.bio}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Players;