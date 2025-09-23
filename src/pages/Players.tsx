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
            <Card key={player.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
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
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    {player.nationality}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-lg text-primary">
                      #{player.jerseyNumber}
                    </div>
                    <div className="text-muted-foreground">Jersey Number</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg text-primary">
                      {player.status}
                    </div>
                    <div className="text-muted-foreground">Status</div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
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