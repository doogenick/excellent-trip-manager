import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FITTourType, VehicleType, CrewType } from "@/types/quotes";

interface FITDetailsStepProps {
  fitDetails: {
    fitType: FITTourType;
    vehicleType?: VehicleType;
    crewType?: CrewType;
    isSelfDrive: boolean;
    includesVehicle: boolean;
    includesAccommodation: boolean;
    includesMeals: boolean;
    includesActivities: boolean;
  };
  setFitDetails: (details: any) => void;
  onValidChange: (valid: boolean) => void;
}

const fitTypeOptions = [
  { value: 'SELF_DRIVE', label: 'Self Drive' },
  { value: 'PRIVATE_GUIDED', label: 'Private Guided' },
  { value: 'SUBCONTRACTED', label: 'Subcontracted' },
  { value: 'OUTSOURCED', label: 'Fully Outsourced' },
];

const vehicleTypeOptions = [
  { value: 'MINIVAN', label: 'Minivan' },
  { value: '4X4', label: '4x4 Vehicle' },
  { value: 'LUXURY_VEHICLE', label: 'Luxury Vehicle' },
];

const crewTypeOptions = [
  { value: 'DRIVER_ONLY', label: 'Driver Only' },
  { value: 'DRIVER_GUIDE', label: 'Driver/Guide' },
  { value: 'FULL_CREW', label: 'Full Crew' },
];

export function FITDetailsStep({ fitDetails, setFitDetails, onValidChange }: FITDetailsStepProps) {
  // Update parent on validation changes
  const handleChange = (updates: Partial<typeof fitDetails>) => {
    const newDetails = { ...fitDetails, ...updates };
    setFitDetails(newDetails);
    
    // Basic validation - at least one service must be included
    const isValid = (
      newDetails.includesVehicle ||
      newDetails.includesAccommodation ||
      newDetails.includesMeals ||
      newDetails.includesActivities
    );
    
    onValidChange(isValid);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>FIT Tour Details</CardTitle>
        <CardDescription>Configure the specific details for your FIT tour</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FIT Type */}
          <div className="space-y-2">
            <Label htmlFor="fitType">FIT Type</Label>
            <Select
              value={fitDetails.fitType}
              onValueChange={(value) => handleChange({ fitType: value as FITTourType })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select FIT type" />
              </SelectTrigger>
              <SelectContent>
                {fitTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Vehicle Type */}
          <div className="space-y-2">
            <Label htmlFor="vehicleType">Vehicle Type</Label>
            <Select
              value={fitDetails.vehicleType}
              onValueChange={(value) => handleChange({ vehicleType: value as VehicleType })}
              disabled={!fitDetails.includesVehicle}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                {vehicleTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Crew Type */}
          <div className="space-y-2">
            <Label htmlFor="crewType">Crew Type</Label>
            <Select
              value={fitDetails.crewType}
              onValueChange={(value) => handleChange({ crewType: value as CrewType })}
              disabled={fitDetails.isSelfDrive}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select crew type" />
              </SelectTrigger>
              <SelectContent>
                {crewTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Self Drive Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="selfDrive"
              checked={fitDetails.isSelfDrive}
              onCheckedChange={(checked) => {
                handleChange({ 
                  isSelfDrive: checked,
                  crewType: checked ? 'SELF_DRIVE' : 'DRIVER_GUIDE'
                });
              }}
            />
            <Label htmlFor="selfDrive">Self Drive</Label>
          </div>
        </div>

        {/* Included Services */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-4">Included Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Vehicle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="includesVehicle"
                checked={fitDetails.includesVehicle}
                onCheckedChange={(checked) => handleChange({ includesVehicle: checked })}
              />
              <Label htmlFor="includesVehicle">Vehicle</Label>
            </div>

            {/* Accommodation */}
            <div className="flex items-center space-x-2">
              <Switch
                id="includesAccommodation"
                checked={fitDetails.includesAccommodation}
                onCheckedChange={(checked) => handleChange({ includesAccommodation: checked })}
              />
              <Label htmlFor="includesAccommodation">Accommodation</Label>
            </div>

            {/* Meals */}
            <div className="flex items-center space-x-2">
              <Switch
                id="includesMeals"
                checked={fitDetails.includesMeals}
                onCheckedChange={(checked) => handleChange({ includesMeals: checked })}
              />
              <Label htmlFor="includesMeals">Meals</Label>
            </div>

            {/* Activities */}
            <div className="flex items-center space-x-2">
              <Switch
                id="includesActivities"
                checked={fitDetails.includesActivities}
                onCheckedChange={(checked) => handleChange({ includesActivities: checked })}
              />
              <Label htmlFor="includesActivities">Activities</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
