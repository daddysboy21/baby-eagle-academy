import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Edit, Trash2, Users, ArrowLeft, Ruler, Weight, MapPin, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PlayerForm from './PlayerForm';
import { useEffect } from 'react';
import { playersAPI } from '@/services/api';

interface Player {
  _id?: string;
  id?: string;
  name: string;
  position: string;
  age: number;
  nationality: string;
  jerseyNumber: number;
  height: number;
  weight: number;
  previousClub?: string;
  bio?: string;
  status: 'active' | 'injured' | 'suspended';
  image?: string;
  createdAt: string;
}

const PlayerManagement = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditingPlayer(null);
    setIsEditDialogOpen(false);
  };

  const handlePlayerUpdated = (updated: Player) => {
    setPlayers(players.map(p => (p._id || p.id) === (updated._id || updated.id) ? updated : p));
    handleEditDialogClose();
    toast({ title: 'Player updated', description: `${updated.name} has been updated.` });
  };

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await playersAPI.getAll();
        setPlayers(data);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to fetch players', variant: 'destructive' });
      }
    };
    fetchPlayers();
  }, [toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'injured': return 'bg-red-500';
      case 'suspended': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const handleDeletePlayer = async (playerId: string) => {
    try {
      await playersAPI.delete(playerId);
      setPlayers(players.filter(player => (player._id || player.id) !== playerId));
      toast({
        title: "Player deleted",
        description: "Player has been removed from the team",
      });
    } catch (error) {
      toast({
        title: "Error deleting player",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 sm:mb-8">
          <Link to="/manage">
            <Button variant="outline" size="sm" className="w-fit">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Player Management</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Manage team players and their information</p>
          </div>
          
          <Link to="/manage/players/add">
            <Button size="sm" className="w-full sm:w-auto">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Player
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {players.map((player) => (
            <Card key={player._id || player.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-3">
                  {player.image && (
                    <img 
                      src={player.image} 
                      alt={player.name}
                      className="w-12 h-12 rounded-full object-cover border border-primary/20"
                    />
                  )}
                  <div className="flex-1">
                    <CardTitle className="text-base sm:text-lg">{player.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{player.position}</p>
                  </div>
                  <Badge className={`${getStatusColor(player.status)} text-white w-fit text-xs`}>
                    {player.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-primary">#{player.jerseyNumber}</div>
                    <div className="text-muted-foreground text-xs">Jersey</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-primary">{player.age}</div>
                    <div className="text-muted-foreground text-xs">Age</div>
                  </div>
                </div>

                {/* Physical Stats */}
                <div className="bg-muted/20 rounded p-2 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1">
                      <Ruler className="w-3 h-3" />
                      {player.height}m
                    </span>
                    <span className="flex items-center gap-1">
                      <Weight className="w-3 h-3" />
                      {player.weight}kg
                    </span>
                  </div>
                  <div className="text-center text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    {player.nationality}
                  </div>
                </div>

                {/* Previous Club */}
                {player.previousClub && (
                  <div className="bg-primary/5 rounded p-2">
                    <div className="flex items-center gap-2 text-xs">
                      <Building2 className="w-3 h-3 text-primary" />
                      <span className="text-muted-foreground">Previous:</span>
                      <span className="font-medium text-primary truncate">{player.previousClub}</span>
                    </div>
                  </div>
                )}

                {/* Bio */}
                {player.bio && (
                  <div className="text-xs text-muted-foreground">
                    <p className="line-clamp-2">{player.bio}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => handleEditPlayer(player)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeletePlayer(player._id || player.id || '')}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      
        {/* Edit Player Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-xs sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Player</DialogTitle>
              <DialogDescription>Update player information below.</DialogDescription>
            </DialogHeader>
            {editingPlayer && (
              <PlayerForm
                mode="edit"
                initialData={editingPlayer}
                onSuccess={handlePlayerUpdated}
                onCancel={handleEditDialogClose}
              />
            )}
          </DialogContent>
        </Dialog>
        
        {players.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-base sm:text-lg font-medium mb-2">No players found</h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">Add your first player to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerManagement;