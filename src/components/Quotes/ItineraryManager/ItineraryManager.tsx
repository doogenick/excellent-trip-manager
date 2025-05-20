
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Copy, Plus, Trash } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ItineraryItem {
  id: string;
  day: number;
  date: Date | string;
  startLocation: string;
  endLocation: string;
  activity: string;
  accommodation: string;
  accommodationType: string;
  distance?: string;
  duration?: string;
  meals: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
}

interface ItineraryManagerProps {
  itinerary: ItineraryItem[];
  onItineraryChange: (newItinerary: ItineraryItem[]) => void;
  startDate?: Date;
}

export function ItineraryManager({ itinerary = [], onItineraryChange, startDate = new Date() }: ItineraryManagerProps) {
  // Accommodation type options
  const accommodationTypes = [
    "Hotel",
    "Lodge",
    "Guesthouse",
    "Camping",
    "Homestay",
    "Resort",
    "Safari Camp",
    "Apartment",
    "Not included"
  ];

  const handleAddDay = () => {
    const newDay = itinerary.length + 1;
    
    // Calculate the date for the new day based on start date
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + newDay - 1);
    
    const newItem: ItineraryItem = {
      id: `day-${newDay}-${Date.now()}`,
      day: newDay,
      date: newDate,
      startLocation: newDay > 1 ? itinerary[newDay - 2]?.endLocation || "" : "",
      endLocation: "",
      activity: "",
      accommodation: "",
      accommodationType: "Hotel",
      meals: {
        breakfast: false,
        lunch: false,
        dinner: false
      }
    };
    
    onItineraryChange([...itinerary, newItem]);
  };

  const handleDuplicateDay = (index: number) => {
    const itemToDuplicate = itinerary[index];
    const newDay = itinerary.length + 1;
    
    // Create a new date for the duplicated day
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + newDay - 1);
    
    const newItem: ItineraryItem = {
      ...itemToDuplicate,
      id: `day-${newDay}-${Date.now()}`,
      day: newDay,
      date: newDate,
      startLocation: index > 0 ? itinerary[index - 1]?.endLocation || "" : itemToDuplicate.startLocation
    };
    
    const newItinerary = [...itinerary];
    newItinerary.push(newItem);
    
    // Renumber days
    newItinerary.forEach((item, i) => {
      item.day = i + 1;
      
      // Update date
      const itemDate = new Date(startDate);
      itemDate.setDate(startDate.getDate() + i);
      item.date = itemDate;
    });
    
    onItineraryChange(newItinerary);
  };

  const handleDeleteDay = (index: number) => {
    const newItinerary = [...itinerary];
    newItinerary.splice(index, 1);
    
    // Renumber days
    newItinerary.forEach((item, i) => {
      item.day = i + 1;
      
      // Update date
      const newDate = new Date(startDate);
      newDate.setDate(startDate.getDate() + i);
      item.date = newDate;
    });
    
    onItineraryChange(newItinerary);
  };

  const handleItemChange = (index: number, field: string, value: string | boolean | object) => {
    const newItinerary = [...itinerary];
    
    // For nested properties like meals
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      newItinerary[index] = {
        ...newItinerary[index],
        [parent]: {
          ...(newItinerary[index][parent as keyof ItineraryItem] as object),
          [child]: value
        }
      };
    } else {
      // For direct properties
      newItinerary[index] = {
        ...newItinerary[index],
        [field]: value
      };
    }
    
    // Auto-update start location of next day when end location changes
    if (field === 'endLocation' && index < newItinerary.length - 1) {
      newItinerary[index + 1] = {
        ...newItinerary[index + 1],
        startLocation: value as string
      };
    }
    
    onItineraryChange(newItinerary);
  };

  const formatDate = (date: Date | string) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>Itinerary</div>
          <Button variant="outline" size="sm" onClick={handleAddDay}>
            <Plus className="h-4 w-4 mr-2" />
            Add Day
          </Button>
        </CardTitle>
        <CardDescription>
          Create and manage the day-by-day itinerary for this tour
        </CardDescription>
      </CardHeader>
      <CardContent>
        {itinerary.length === 0 ? (
          <div className="text-center py-8 border rounded-md bg-muted/20">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Itinerary Days</h3>
            <p className="text-muted-foreground mb-4">
              Start building your tour itinerary by adding days.
            </p>
            <Button onClick={handleAddDay}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Day
            </Button>
          </div>
        ) : (
          <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Day</TableHead>
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead className="w-[15%]">Start Location</TableHead>
                  <TableHead className="w-[15%]">End Location</TableHead>
                  <TableHead className="w-[20%]">Activity</TableHead>
                  <TableHead className="w-[15%]">Accommodation</TableHead>
                  <TableHead className="w-[15%]">Accommodation Type</TableHead>
                  <TableHead className="w-[120px]">Meals</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itinerary.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      Day {item.day}
                    </TableCell>
                    <TableCell>
                      {formatDate(item.date)}
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={item.startLocation} 
                        onChange={(e) => handleItemChange(index, 'startLocation', e.target.value)}
                        placeholder="From"
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={item.endLocation} 
                        onChange={(e) => handleItemChange(index, 'endLocation', e.target.value)}
                        placeholder="To"
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={item.activity} 
                        onChange={(e) => handleItemChange(index, 'activity', e.target.value)}
                        placeholder="Activity description"
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={item.accommodation} 
                        onChange={(e) => handleItemChange(index, 'accommodation', e.target.value)}
                        placeholder="Accommodation name"
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={item.accommodationType} 
                        onValueChange={(value) => handleItemChange(index, 'accommodationType', value)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {accommodationTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center">
                                <Checkbox
                                  id={`breakfast-${item.id}`}
                                  checked={item.meals.breakfast}
                                  onCheckedChange={(checked) => 
                                    handleItemChange(index, 'meals.breakfast', checked === true)}
                                />
                                <label htmlFor={`breakfast-${item.id}`} className="ml-1 text-xs">B</label>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>Breakfast</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center">
                                <Checkbox
                                  id={`lunch-${item.id}`}
                                  checked={item.meals.lunch}
                                  onCheckedChange={(checked) => 
                                    handleItemChange(index, 'meals.lunch', checked === true)}
                                />
                                <label htmlFor={`lunch-${item.id}`} className="ml-1 text-xs">L</label>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>Lunch</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center">
                                <Checkbox
                                  id={`dinner-${item.id}`}
                                  checked={item.meals.dinner}
                                  onCheckedChange={(checked) => 
                                    handleItemChange(index, 'meals.dinner', checked === true)}
                                />
                                <label htmlFor={`dinner-${item.id}`} className="ml-1 text-xs">D</label>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>Dinner</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => handleDuplicateDay(index)}>
                                <Copy className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Duplicate Day</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteDay(index)}>
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete Day</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ItineraryManager;
