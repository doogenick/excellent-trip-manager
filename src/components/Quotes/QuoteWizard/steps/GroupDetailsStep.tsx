import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { GroupTourType, VehicleType, CrewType } from "@/types/quotes";

interface GroupDetailsStepProps {
  groupDetails: {
    groupType: GroupTourType;
    vehicleType: VehicleType;
    crewType: CrewType;
    includesCampingEquipment: boolean;
    includesCookingEquipment: boolean;
    includesParkFees: boolean;
    includesActivities: boolean;
    requiresSingleRooms: boolean;
    requiresDoubleRooms: boolean;
    requiresTwinRooms: boolean;
  };
  setGroupDetails: (details: any) => void;
  onValidChange: (valid: boolean) => void;
}

const groupTypeOptions = [
  { value: 'VEHICLE_ONLY', label: 'Vehicle Only' },
  { value: 'FULLY_INCLUDED', label: 'Fully Included' },
];

const vehicleTypeOptions = [
  { value: 'MINIBUS', label: 'Minibus (up to 22 pax)' },
  { value: 'COACH', label: 'Coach (23+ pax)' },
  { value: '4X4', label: '4x4 Vehicle' },
  { value: 'CUSTOM', label: 'Custom Vehicle' },
];

const crewTypeOptions = [
  { value: 'DRIVER_ONLY', label: 'Driver Only' },
  { value: 'DRIVER_GUIDE', label: 'Driver/Guide' },
  { value: 'FULL_CREW', label: 'Full Crew' },
];

export function GroupDetailsStep({ groupDetails, setGroupDetails, onValidChange }: GroupDetailsStepProps) {
  // Update parent on validation changes
  const handleChange = (updates: Partial<typeof groupDetails>) => {
    const newDetails = { ...groupDetails, ...updates };
    setGroupDetails(newDetails);
    
    // Basic validation - always valid for required fields
    onValidChange(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Group Tour Details</CardTitle>
        <CardDescription>Configure the specific details for your group tour</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Group Type */}
          <div className="space-y-2">
            <Label htmlFor="groupType">Group Type</Label>
            <Select
              value={groupDetails.groupType}
              onValueChange={(value) => handleChange({ groupType: value as GroupTourType })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select group type" />
              </SelectTrigger>
              <SelectContent>
                {groupTypeOptions.map((option) => (
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
              value={groupDetails.vehicleType}
              onValueChange={(value) => handleChange({ vehicleType: value as VehicleType })}
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
              value={groupDetails.crewType}
              onValueChange={(value) => handleChange({ crewType: value as CrewType })}
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
        </div>

        {/* Included Services */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-4">Included Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Camping Equipment */}
            <div className="flex items-center space-x-2">
              <Switch
                id="includesCampingEquipment"
                checked={groupDetails.includesCampingEquipment}
                onCheckedChange={(checked) => handleChange({ includesCampingEquipment: checked })}
                disabled={groupDetails.groupType === 'VEHICLE_ONLY'}
              />
              <Label htmlFor="includesCampingEquipment">Camping Equipment</Label>
            </div>

            {/* Cooking Equipment */}
            <div className="flex items-center space-x-2">
              <Switch
                id="includesCookingEquipment"
                checked={groupDetails.includesCookingEquipment}
                onCheckedChange={(checked) => handleChange({ includesCookingEquipment: checked })}
                disabled={groupDetails.groupType === 'VEHICLE_ONLY'}
              />
              <Label htmlFor="includesCookingEquipment">Cooking Equipment</Label>
            </div>

            {/* Park Fees */}
            <div className="flex items-center space-x-2">
              <Switch
                id="includesParkFees"
                checked={groupDetails.includesParkFees}
                onCheckedChange={(checked) => handleChange({ includesParkFees: checked })}
                disabled={groupDetails.groupType === 'VEHICLE_ONLY'}
              />
              <Label htmlFor="includesParkFees">Park Fees</Label>
            </div>

            {/* Activities */}
            <div className="flex items-center space-x-2">
              <Switch
                id="includesActivities"
                checked={groupDetails.includesActivities}
                onCheckedChange={(checked) => handleChange({ includesActivities: checked })}
                disabled={groupDetails.groupType === 'VEHICLE_ONLY'}
              />
              <Label htmlFor="includesActivities">Activities</Label>
            </div>
          </div>
        </div>

        {/* Room Requirements */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-4">Room Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Single Rooms */}
            <div className="flex items-center space-x-2">
              <Switch
                id="requiresSingleRooms"
                checked={groupDetails.requiresSingleRooms}
                onCheckedChange={(checked) => handleChange({ requiresSingleRooms: checked })}
                disabled={groupDetails.groupType === 'VEHICLE_ONLY'}
              />
              <Label htmlFor="requiresSingleRooms">Single Rooms</Label>
            </div>

            {/* Double Rooms */}
            <div className="flex items-center space-x-2">
              <Switch
                id="requiresDoubleRooms"
                checked={groupDetails.requiresDoubleRooms}
                onCheckedChange={(checked) => handleChange({ requiresDoubleRooms: checked })}
                disabled={groupDetails.groupType === 'VEHICLE_ONLY'}
              />
              <Label htmlFor="requiresDoubleRooms">Double Rooms</Label>
            </div>

            {/* Twin Rooms */}
            <div className="flex items-center space-x-2">
              <Switch
                id="requiresTwinRooms"
                checked={groupDetails.requiresTwinRooms}
                onCheckedChange={(checked) => handleChange({ requiresTwinRooms: checked })}
                disabled={groupDetails.groupType === 'VEHICLE_ONLY'}
              />
              <Label htmlFor="requiresTwinRooms">Twin Rooms</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
