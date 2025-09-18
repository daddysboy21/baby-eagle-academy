import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Edit, Trash2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Player {
  id: string;
  name: string;
  position: string;
  age: number;
  nationality: string;
  jerseyNumber: number;
  status: 'active' | 'injured' | 'suspended';
  createdAt: string;
}

// Mock data - replace with API calls
const mockPlayers: Player[] = [
  { id: '1', name: 'John Doe', position: 'Forward', age: 23, nationality: 'Ghana', jerseyNumber: 9, status: 'active', createdAt: '2024-01-01' },
  { id: '2', name: 'Michael Smith', position: 'Midfielder', age: 25, nationality: 'Nigeria', jerseyNumber: 10, status: 'active', createdAt: '2024-01-15' },
  { id: '3', name: 'David Wilson', position: 'Defender', age: 22, nationality: 'Ghana', jerseyNumber: 4, status: 'injured', createdAt: '2024-02-01' },
];

const PlayerManagement = () => {
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const { toast } = useToast();

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
      // TODO: Replace with your backend API call
      setPlayers(players.filter(player => player.id !== playerId));
      
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Player Management</h2>
          <p className="text-muted-foreground">Manage team players and their information</p>
        </div>
        
        <Link to="/manage/players/add">
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Player
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((player) => (
          <Card key={player.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{player.name}</CardTitle>
                <Badge className={`${getStatusColor(player.status)} text-white`}>
                  {player.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Position:</span>
                  <span className="text-sm font-medium">{player.position}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Jersey #:</span>
                  <span className="text-sm font-medium">{player.jerseyNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Age:</span>
                  <span className="text-sm font-medium">{player.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Nationality:</span>
                  <span className="text-sm font-medium">{player.nationality}</span>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeletePlayer(player.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {players.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No players found</h3>
          <p className="text-muted-foreground mb-4">Add your first player to get started</p>
        </div>
      )}
    </div>
  );
};

export default PlayerManagement;