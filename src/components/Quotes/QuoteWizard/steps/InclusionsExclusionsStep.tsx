
import { useState, useEffect } from "react";
import { InclusionExclusionManager } from "../../InclusionExclusion/InclusionExclusionManager";

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
    <InclusionExclusionManager
      inclusions={inclusions}
      exclusions={exclusions}
      onInclusionsChange={onInclusionsChange}
      onExclusionsChange={onExclusionsChange}
    />
  );
}
