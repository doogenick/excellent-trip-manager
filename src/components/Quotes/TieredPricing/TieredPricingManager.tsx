
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PriceTier {
  id: string;
  minPax: number;
  maxPax: number;
  pricePerPerson: number;
  singleSupplement: number;
}

interface TieredPricingManagerProps {
  priceTiers: PriceTier[];
  currency?: string;
  onPriceTiersChange: (tiers: PriceTier[]) => void;
  baseCostPerPerson?: number;
}

export function TieredPricingManager({
  priceTiers = [],
  currency = "USD",
  onPriceTiersChange,
  baseCostPerPerson = 0
}: TieredPricingManagerProps) {
  const [minPax, setMinPax] = useState('');
  const [maxPax, setMaxPax] = useState('');
  const [pricePerPerson, setPricePerPerson] = useState('');
  const [singleSupplement, setSingleSupplement] = useState('');

  const handleAddTier = () => {
    const minPaxNumber = parseInt(minPax);
    const maxPaxNumber = parseInt(maxPax);
    const priceNumber = parseFloat(pricePerPerson);
    const supplementNumber = parseFloat(singleSupplement);
    
    if (
      !isNaN(minPaxNumber) && 
      !isNaN(maxPaxNumber) && 
      !isNaN(priceNumber) && 
      minPaxNumber > 0 &&
      maxPaxNumber >= minPaxNumber
    ) {
      // Check for overlap with existing tiers
      const hasOverlap = priceTiers.some(tier => 
        (minPaxNumber >= tier.minPax && minPaxNumber <= tier.maxPax) ||
        (maxPaxNumber >= tier.minPax && maxPaxNumber <= tier.maxPax) ||
        (tier.minPax >= minPaxNumber && tier.minPax <= maxPaxNumber)
      );
      
      if (hasOverlap) {
        alert("This tier overlaps with an existing tier. Please adjust the number of passengers.");
        return;
      }
      
      const newTier: PriceTier = {
        id: `tier-${Date.now()}`,
        minPax: minPaxNumber,
        maxPax: maxPaxNumber,
        pricePerPerson: priceNumber,
        singleSupplement: isNaN(supplementNumber) ? 0 : supplementNumber
      };
      
      const newTiers = [...priceTiers, newTier].sort((a, b) => a.minPax - b.minPax);
      onPriceTiersChange(newTiers);
      
      // Reset form
      setMinPax('');
      setMaxPax('');
      setPricePerPerson('');
      setSingleSupplement('');
    }
  };

  const handleDeleteTier = (id: string) => {
    onPriceTiersChange(priceTiers.filter(tier => tier.id !== id));
  };

  const calculateMargin = (price: number): string => {
    if (!baseCostPerPerson || baseCostPerPerson <= 0) return "-";
    const margin = ((price - baseCostPerPerson) / price) * 100;
    return `${margin.toFixed(1)}%`;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tiered Pricing Structure</CardTitle>
        <CardDescription>
          Set different price points based on the number of travelers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-5 gap-4">
          <div>
            <label className="text-sm font-medium">Min Passengers</label>
            <Input
              type="number"
              min="1"
              value={minPax}
              onChange={(e) => setMinPax(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Max Passengers</label>
            <Input
              type="number"
              min={minPax || '1'}
              value={maxPax}
              onChange={(e) => setMaxPax(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Price Per Person</label>
            <div className="relative">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={pricePerPerson}
                onChange={(e) => setPricePerPerson(e.target.value)}
                className="pl-7"
              />
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Single Supplement</label>
            <div className="relative">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={singleSupplement}
                onChange={(e) => setSingleSupplement(e.target.value)}
                className="pl-7"
              />
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
            </div>
          </div>
          <div className="flex items-end">
            <Button onClick={handleAddTier} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Tier
            </Button>
          </div>
        </div>
        
        {priceTiers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Passengers</TableHead>
                <TableHead>Price Per Person</TableHead>
                <TableHead>Single Supplement</TableHead>
                {baseCostPerPerson > 0 && <TableHead>Margin</TableHead>}
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {priceTiers.map((tier) => (
                <TableRow key={tier.id}>
                  <TableCell className="font-medium">
                    {tier.minPax === tier.maxPax 
                      ? tier.minPax 
                      : `${tier.minPax} to ${tier.maxPax}`
                    }
                  </TableCell>
                  <TableCell>{formatCurrency(tier.pricePerPerson)}</TableCell>
                  <TableCell>{formatCurrency(tier.singleSupplement)}</TableCell>
                  {baseCostPerPerson > 0 && (
                    <TableCell>{calculateMargin(tier.pricePerPerson)}</TableCell>
                  )}
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteTier(tier.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete tier</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="border rounded-md p-8 text-center text-muted-foreground">
            <p>No price tiers defined yet.</p>
            <p className="text-sm">Add your first tier to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TieredPricingManager;
