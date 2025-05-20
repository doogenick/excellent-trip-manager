import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrailerDetails, TrailerType } from "@/types/quotes";
import { Plus, Trash, Edit } from "lucide-react";

// Default daily rates per trailer type
const defaultDailyRates = {
  [TrailerType.LUGGAGE]: 30,
  [TrailerType.CAMPING]: 75,
  [TrailerType.KITCHEN]: 60,
  [TrailerType.CUSTOM]: 50,
};

interface TrailerFormProps {
  trailers: TrailerDetails[];
  setTrailers: (trailers: TrailerDetails[]) => void;
}

export function TrailerForm({ trailers, setTrailers }: TrailerFormProps) {
  const [trailer, setTrailer] = useState<Partial<TrailerDetails>>({
    id: "",
    name: "",
    type: TrailerType.LUGGAGE,
    dailyRate: defaultDailyRates[TrailerType.LUGGAGE],
    collectionFee: 0,
    deliveryFee: 0
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  // Generate a unique ID for new trailers
  const generateId = () => {
    return `trailer-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  // Handle trailer type change
  const handleTrailerTypeChange = (type: TrailerType) => {
    setTrailer({
      ...trailer,
      type,
      dailyRate: defaultDailyRates[type]
    });
  };

  // Handle adding a new trailer
  const handleSaveTrailer = () => {
    if (editingId) {
      // Update existing trailer
      setTrailers(trailers.map(t => 
        t.id === editingId ? { ...trailer, id: editingId } as TrailerDetails : t
      ));
      setEditingId(null);
    } else {
      // Add new trailer
      const newTrailer: TrailerDetails = {
        ...trailer,
        id: generateId()
      } as TrailerDetails;
      
      setTrailers([...trailers, newTrailer]);
    }

    // Reset form
    setTrailer({
      id: "",
      name: "",
      type: TrailerType.LUGGAGE,
      dailyRate: defaultDailyRates[TrailerType.LUGGAGE],
      collectionFee: 0,
      deliveryFee: 0
    });
  };

  // Handle editing a trailer
  const handleEditTrailer = (trailerToEdit: TrailerDetails) => {
    setEditingId(trailerToEdit.id);
    setTrailer({
      ...trailerToEdit
    });
  };

  // Handle deleting a trailer
  const handleDeleteTrailer = (id: string) => {
    setTrailers(trailers.filter(trailer => trailer.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setTrailer({
        id: "",
        name: "",
        type: TrailerType.LUGGAGE,
        dailyRate: defaultDailyRates[TrailerType.LUGGAGE],
        collectionFee: 0,
        deliveryFee: 0
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Trailers List */}
      {trailers.length > 0 && (
        <Card>
          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Daily Rate</TableHead>
                  <TableHead>Collection Fee</TableHead>
                  <TableHead>Delivery Fee</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trailers.map((trailerItem) => (
                  <TableRow key={trailerItem.id}>
                    <TableCell className="font-medium">{trailerItem.name}</TableCell>
                    <TableCell>{trailerItem.type}</TableCell>
                    <TableCell>${trailerItem.dailyRate.toFixed(2)}</TableCell>
                    <TableCell>${(trailerItem.collectionFee || 0).toFixed(2)}</TableCell>
                    <TableCell>${(trailerItem.deliveryFee || 0).toFixed(2)}</TableCell>
                    <TableCell className="font-medium">
                      ${(trailerItem.dailyRate + (trailerItem.collectionFee || 0) + (trailerItem.deliveryFee || 0)).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEditTrailer(trailerItem)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteTrailer(trailerItem.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Trailer Form */}
      <Card>
        <CardContent className="pt-4 space-y-4">
          <h3 className="text-md font-medium mb-2">
            {editingId ? 'Edit Trailer' : 'Add New Trailer'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trailerName">Trailer Name</Label>
              <Input
                id="trailerName"
                value={trailer.name}
                onChange={(e) => setTrailer({ ...trailer, name: e.target.value })}
                placeholder="Enter a descriptive name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trailerType">Trailer Type</Label>
              <Select
                value={trailer.type}
                onValueChange={(value) => handleTrailerTypeChange(value as TrailerType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trailer type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TrailerType.LUGGAGE}>Luggage Trailer</SelectItem>
                  <SelectItem value={TrailerType.CAMPING}>Camping Trailer</SelectItem>
                  <SelectItem value={TrailerType.KITCHEN}>Kitchen Trailer</SelectItem>
                  <SelectItem value={TrailerType.CUSTOM}>Custom Trailer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trailerDailyRate">Daily Rate</Label>
              <Input
                id="trailerDailyRate"
                type="number"
                min="0"
                step="0.01"
                value={trailer.dailyRate}
                onChange={(e) => setTrailer({ ...trailer, dailyRate: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trailerCollectionFee">Collection Fee</Label>
              <Input
                id="trailerCollectionFee"
                type="number"
                min="0"
                step="0.01"
                value={trailer.collectionFee}
                onChange={(e) => setTrailer({ ...trailer, collectionFee: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trailerDeliveryFee">Delivery Fee</Label>
              <Input
                id="trailerDeliveryFee"
                type="number"
                min="0"
                step="0.01"
                value={trailer.deliveryFee}
                onChange={(e) => setTrailer({ ...trailer, deliveryFee: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex justify-end">
            {editingId && (
              <Button
                variant="outline"
                className="mr-2"
                onClick={() => {
                  setEditingId(null);
                  setTrailer({
                    id: "",
                    name: "",
                    type: TrailerType.LUGGAGE,
                    dailyRate: defaultDailyRates[TrailerType.LUGGAGE],
                    collectionFee: 0,
                    deliveryFee: 0
                  });
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={handleSaveTrailer}
              disabled={!trailer.name || !trailer.dailyRate}
            >
              <Plus className="h-4 w-4 mr-2" />
              {editingId ? 'Update Trailer' : 'Add Trailer'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
