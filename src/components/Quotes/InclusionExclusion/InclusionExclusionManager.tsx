
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash, ArrowDown, ArrowUp } from "lucide-react";

interface InclusionItem {
  id: string;
  text: string;
}

interface InclusionExclusionManagerProps {
  inclusions: InclusionItem[];
  exclusions: InclusionItem[];
  onInclusionsChange: (items: InclusionItem[]) => void;
  onExclusionsChange: (items: InclusionItem[]) => void;
}

export function InclusionExclusionManager({
  inclusions = [],
  exclusions = [],
  onInclusionsChange,
  onExclusionsChange
}: InclusionExclusionManagerProps) {
  const [newInclusion, setNewInclusion] = useState('');
  const [newExclusion, setNewExclusion] = useState('');

  const handleAddInclusion = () => {
    if (newInclusion.trim()) {
      const newItem: InclusionItem = {
        id: `inclusion-${Date.now()}`,
        text: newInclusion.trim()
      };
      onInclusionsChange([...inclusions, newItem]);
      setNewInclusion('');
    }
  };

  const handleAddExclusion = () => {
    if (newExclusion.trim()) {
      const newItem: InclusionItem = {
        id: `exclusion-${Date.now()}`,
        text: newExclusion.trim()
      };
      onExclusionsChange([...exclusions, newItem]);
      setNewExclusion('');
    }
  };

  const handleDeleteInclusion = (id: string) => {
    onInclusionsChange(inclusions.filter(item => item.id !== id));
  };

  const handleDeleteExclusion = (id: string) => {
    onExclusionsChange(exclusions.filter(item => item.id !== id));
  };

  const moveItem = (items: InclusionItem[], index: number, direction: 'up' | 'down'): InclusionItem[] => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === items.length - 1)
    ) {
      return items;
    }
    
    const newItems = [...items];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    
    return newItems;
  };

  const moveInclusion = (index: number, direction: 'up' | 'down') => {
    onInclusionsChange(moveItem(inclusions, index, direction));
  };

  const moveExclusion = (index: number, direction: 'up' | 'down') => {
    onExclusionsChange(moveItem(exclusions, index, direction));
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    addFunction: () => void
  ) => {
    if (e.key === 'Enter') {
      addFunction();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Inclusions & Exclusions</CardTitle>
        <CardDescription>
          Manage what's included and not included in the quote
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="inclusions">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inclusions">Inclusions ({inclusions.length})</TabsTrigger>
            <TabsTrigger value="exclusions">Exclusions ({exclusions.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="inclusions" className="space-y-4 pt-4">
            <div className="flex space-x-2">
              <Input
                value={newInclusion}
                onChange={(e) => setNewInclusion(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleAddInclusion)}
                placeholder="Add new inclusion (e.g. 'Airport transfers')"
              />
              <Button onClick={handleAddInclusion}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            
            <div className="border rounded-md p-4 space-y-2">
              {inclusions.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No inclusions added yet. Add items that are included in the quote price.
                </p>
              ) : (
                <ul className="space-y-2">
                  {inclusions.map((item, index) => (
                    <li 
                      key={item.id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <span>{item.text}</span>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          disabled={index === 0}
                          onClick={() => moveInclusion(index, 'up')}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          disabled={index === inclusions.length - 1}
                          onClick={() => moveInclusion(index, 'down')}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteInclusion(item.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="exclusions" className="space-y-4 pt-4">
            <div className="flex space-x-2">
              <Input
                value={newExclusion}
                onChange={(e) => setNewExclusion(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleAddExclusion)}
                placeholder="Add new exclusion (e.g. 'International flights')"
              />
              <Button onClick={handleAddExclusion}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            
            <div className="border rounded-md p-4 space-y-2">
              {exclusions.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No exclusions added yet. Add items that are not included in the quote price.
                </p>
              ) : (
                <ul className="space-y-2">
                  {exclusions.map((item, index) => (
                    <li 
                      key={item.id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <span>{item.text}</span>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          disabled={index === 0}
                          onClick={() => moveExclusion(index, 'up')}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          disabled={index === exclusions.length - 1}
                          onClick={() => moveExclusion(index, 'down')}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteExclusion(item.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default InclusionExclusionManager;
