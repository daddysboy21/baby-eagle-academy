import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Users, Calendar, MapPin, Trophy, Ruler, Weight, Building2, Eye } from "lucide-react";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading players...</p>
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
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
          <Link to="/">
            <Button variant="outline" size="sm" className="w-fit">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Our Players</h1>
            <p className="text-muted-foreground mt-1 text-xs sm:text-sm">Meet the talented young athletes of Baby Eagle Football Academy</p>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1.5 sm:gap-2 lg:gap-3">
          {players.map((player) => (
            <Card key={player._id || player.id} className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] overflow-hidden h-fit">
              <CardHeader className="p-1.5 sm:p-2 pb-1">
                {player.image && (
                  <div className="flex justify-center mb-1.5">
                    <img 
                      src={player.image} 
                      alt={player.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover border border-primary/20"
                    />
                  </div>
                )}
                <div className="text-center space-y-0.5">
                  <CardTitle className="text-xs sm:text-xs font-semibold leading-tight line-clamp-2 h-8 flex items-center justify-center">{player.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs px-1 py-0.5 h-4">{player.position}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-1.5 sm:p-2 pt-0 space-y-1.5">
                {/* Jersey & Age */}
                <div className="grid grid-cols-2 gap-0.5 text-xs">
                  <div className="text-center">
                    <div className="font-semibold text-primary text-xs">#{player.jerseyNumber}</div>
                    <div className="text-muted-foreground text-xs">Jersey</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-primary text-xs">{player.age}</div>
                    <div className="text-muted-foreground text-xs">Age</div>
                  </div>
                </div>

                {/* Physical Stats - Ultra Compact */}
                <div className="bg-muted/20 rounded p-1 space-y-0.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-0.5">
                      <Ruler className="w-2 h-2" />
                      {player.height}m
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Weight className="w-2 h-2" />
                      {player.weight}kg
                    </span>
                  </div>
                  <div className="text-center text-xs text-muted-foreground truncate">
                    <MapPin className="w-2 h-2 inline mr-0.5" />
                    {player.nationality}
                  </div>
                </div>

                {/* Status */}
                <div className="text-center">
                  <Badge 
                    variant={player.status === 'active' ? 'default' : 'outline'} 
                    className="text-xs px-1.5 py-0.5 h-4"
                  >
                    {player.status}
                  </Badge>
                </div>

                {/* View Details Button - Ultra Compact */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full h-6 text-xs">
                      <Eye className="w-2 h-2 mr-0.5" />
                      Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-base">
                        {player.image && (
                          <img 
                            src={player.image} 
                            alt={player.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        {player.name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground text-xs">Position:</span>
                          <p className="font-medium">{player.position}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Jersey:</span>
                          <p className="font-medium">#{player.jerseyNumber}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Age:</span>
                          <p className="font-medium">{player.age} years</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Nationality:</span>
                          <p className="font-medium">{player.nationality}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Height:</span>
                          <p className="font-medium">{player.height}m</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Weight:</span>
                          <p className="font-medium">{player.weight}kg</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Status:</span>
                          <p className="font-medium capitalize">{player.status}</p>
                        </div>
                        {player.previousClub && (
                          <div className="col-span-2">
                            <span className="text-muted-foreground text-xs">Previous Club:</span>
                            <p className="font-medium">{player.previousClub}</p>
                          </div>
                        )}
                      </div>
                      {player.bio && (
                        <div>
                          <span className="text-muted-foreground text-xs">Biography:</span>
                          <p className="text-sm mt-1 leading-relaxed">{player.bio}</p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>

        {players.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-base font-medium text-muted-foreground mb-2">No Players Found</h3>
            <p className="text-sm text-muted-foreground">There are currently no players registered in the academy.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Players;