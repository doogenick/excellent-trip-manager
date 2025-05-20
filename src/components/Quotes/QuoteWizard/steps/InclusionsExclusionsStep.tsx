
import { useState, useEffect } from "react";
import { InclusionExclusionManager } from "../../InclusionExclusion/InclusionExclusionManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface InclusionItem {
  id: string;
  text: string;
}

interface InclusionsExclusionsStepProps {
  inclusions: InclusionItem[];
  exclusions: InclusionItem[];
  onInclusionsChange: (items: InclusionItem[]) => void;
  onExclusionsChange: (items: InclusionItem[]) => void;
  onValidChange?: (isValid: boolean) => void;
}

export function InclusionsExclusionsStep({ 
  inclusions, 
  exclusions, 
  onInclusionsChange,
  onExclusionsChange,
  onValidChange 
}: InclusionsExclusionsStepProps) {
  
  // The step is considered valid if there's at least one inclusion
  useEffect(() => {
    if (onValidChange) {
      onValidChange(inclusions.length > 0);
    }
  }, [inclusions, onValidChange]);
  
  return (
    <div className="space-y-6">
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">What's included in your quote?</CardTitle>
          <CardDescription>
            Add services, items, and features that are included in the quoted price. 
            You must add at least one inclusion before proceeding.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Common inclusions: transportation, accommodation, meals, activities, guides, permits, etc.
          </p>
        </CardContent>
      </Card>
      
      <InclusionExclusionManager
        inclusions={inclusions}
        exclusions={exclusions}
        onInclusionsChange={onInclusionsChange}
        onExclusionsChange={onExclusionsChange}
      />
    </div>
  );
}
