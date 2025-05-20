
import { useState, useEffect } from "react";
import { TieredPricingManager } from "../../TieredPricing/TieredPricingManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PriceTier {
  id: string;
  minPax: number;
  maxPax: number;
  pricePerPerson: number;
  singleSupplement: number;
}

interface PricingStepProps {
  priceTiers: PriceTier[];
  onPriceTiersChange: (tiers: PriceTier[]) => void;
  baseCostPerPerson: number;
  currency: string;
  onCurrencyChange: (currency: string) => void;
  onValidChange?: (isValid: boolean) => void;
}

export function PricingStep({ 
  priceTiers, 
  onPriceTiersChange,
  baseCostPerPerson,
  currency,
  onCurrencyChange,
  onValidChange
}: PricingStepProps) {
  const currencies = ["USD", "EUR", "GBP", "ZAR", "AUD", "CAD"];
  
  // The step is considered valid if there's at least one price tier
  useEffect(() => {
    if (onValidChange) {
      onValidChange(priceTiers.length > 0);
    }
  }, [priceTiers, onValidChange]);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quote Currency</CardTitle>
          <CardDescription>Select the currency for this quote</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={onCurrencyChange}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(curr => (
                    <SelectItem key={curr} value={curr}>{curr}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Base Cost Per Person</Label>
              <div className="relative">
                <Input
                  type="text"
                  value={baseCostPerPerson.toLocaleString('en-US', {
                    style: 'currency',
                    currency: currency,
                    minimumFractionDigits: 2
                  })}
                  readOnly
                  className="pl-7 bg-muted"
                />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : ''}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <TieredPricingManager
        priceTiers={priceTiers}
        currency={currency}
        onPriceTiersChange={onPriceTiersChange}
        baseCostPerPerson={baseCostPerPerson}
      />
    </div>
  );
}
