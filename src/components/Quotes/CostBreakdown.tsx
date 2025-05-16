
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Users } from "lucide-react";
import { TourBasicsSection } from "./CostBreakdown/TourBasicsSection";
import { VehicleFuelSection } from "./CostBreakdown/VehicleFuelSection";
import { CrewSection } from "./CostBreakdown/CrewSection";
import { AccommodationSection } from "./CostBreakdown/AccommodationSection";
import { MealsActivitiesSection } from "./CostBreakdown/MealsActivitiesSection";
import { PrePostTourSection } from "./CostBreakdown/PrePostTourSection";
import { CostSummarySection } from "./CostBreakdown/CostSummarySection";
import { DailyBreakdownTable } from "./CostBreakdown/DailyBreakdownTable";
import { GroupSizeAnalysis } from "./CostBreakdown/GroupSizeAnalysis";
import { useTourCalculator } from "@/hooks/useTourCalculator";

export function CostBreakdown() {
  const calculator = useTourCalculator();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Cost Breakdown Calculator</h1>
          <p className="text-muted-foreground">Analyze tour costs and optimize pricing</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">Save Calculation</Button>
          <Button>Export PDF</Button>
        </div>
      </div>

      <Tabs defaultValue="calculator">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="calculator">
            <DollarSign className="h-4 w-4 mr-2" />
            Calculator
          </TabsTrigger>
          <TabsTrigger value="breakdown">
            <Calendar className="h-4 w-4 mr-2" />
            Daily Breakdown
          </TabsTrigger>
          <TabsTrigger value="comparison">
            <Users className="h-4 w-4 mr-2" />
            Group Size Analysis
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TourBasicsSection 
              tourDuration={calculator.tourDuration}
              setTourDuration={calculator.setTourDuration}
              totalDistance={calculator.totalDistance}
              setTotalDistance={calculator.setTotalDistance}
              currentPax={calculator.currentPax}
              setCurrentPax={calculator.setCurrentPax}
              minPax={calculator.minPax}
              setMinPax={calculator.setMinPax}
              maxPax={calculator.maxPax}
              setMaxPax={calculator.setMaxPax}
            />
            
            <VehicleFuelSection 
              selectedVehicle={calculator.selectedVehicle}
              setSelectedVehicle={calculator.setSelectedVehicle}
              vehicleMarkup={calculator.vehicleMarkup}
              setVehicleMarkup={calculator.setVehicleMarkup}
              fuelPrice={calculator.fuelPrice}
              setFuelPrice={calculator.setFuelPrice}
              calculateVehicleCost={calculator.calculateVehicleCost}
              calculateFuelCost={calculator.calculateFuelCost}
              currentPax={calculator.currentPax}
              customVehicleName={calculator.customVehicleName}
              setCustomVehicleName={calculator.setCustomVehicleName}
              customDailyRate={calculator.customDailyRate}
              setCustomDailyRate={calculator.setCustomDailyRate}
              customFuelConsumption={calculator.customFuelConsumption}
              setCustomFuelConsumption={calculator.setCustomFuelConsumption}
              vehicleNotes={calculator.vehicleNotes}
              setVehicleNotes={calculator.setVehicleNotes}
            />
            
            <CrewSection 
              crew={calculator.crew}
              setCrew={calculator.setCrew}
              calculateCrewCost={calculator.calculateCrewCost}
              crewMealRates={calculator.crewMealRates}
              setCrewMealRates={calculator.setCrewMealRates}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AccommodationSection 
              averageAccommodationCost={calculator.averageAccommodationCost}
              setAverageAccommodationCost={calculator.setAverageAccommodationCost}
              accommodationMarkup={calculator.accommodationMarkup}
              setAccommodationMarkup={calculator.setAccommodationMarkup}
              calculateAccommodationCost={calculator.calculateAccommodationCost}
              currentPax={calculator.currentPax}
              tourDuration={calculator.tourDuration}
              selectedRoomType={calculator.selectedRoomType}
              setSelectedRoomType={calculator.setSelectedRoomType}
              selectedMealBasis={calculator.selectedMealBasis}
              setSelectedMealBasis={calculator.setSelectedMealBasis}
            />
            
            <MealsActivitiesSection 
              includedMeals={calculator.includedMeals}
              setIncludedMeals={calculator.setIncludedMeals}
              preparedMealsCost={calculator.preparedMealsCost}
              setPreparedMealsCost={calculator.setPreparedMealsCost}
              mealMarkup={calculator.mealMarkup}
              setMealMarkup={calculator.setMealMarkup}
              includedActivities={calculator.includedActivities}
              setIncludedActivities={calculator.setIncludedActivities}
              averageActivityCost={calculator.averageActivityCost}
              setAverageActivityCost={calculator.setAverageActivityCost}
              activitiesMarkup={calculator.activitiesMarkup}
              setActivitiesMarkup={calculator.setActivitiesMarkup}
              tourDuration={calculator.tourDuration}
            />
            
            <PrePostTourSection 
              prePostNights={calculator.prePostNights}
              setPrePostNights={calculator.setPrePostNights}
              prePostAccommodationCost={calculator.prePostAccommodationCost}
              setPrePostAccommodationCost={calculator.setPrePostAccommodationCost}
              prePostMarkup={calculator.prePostMarkup}
              setPrePostMarkup={calculator.setPrePostMarkup}
              calculatePrePostTourCost={calculator.calculatePrePostTourCost}
            />
          </div>
          
          <CostSummarySection 
            calculateVehicleCost={calculator.calculateVehicleCost}
            calculateFuelCost={calculator.calculateFuelCost}
            calculateCrewCost={calculator.calculateCrewCost}
            calculateAccommodationCost={calculator.calculateAccommodationCost}
            calculateActivityCost={calculator.calculateActivityCost}
            calculateMealCost={calculator.calculateMealCost}
            calculateTotalTourCost={calculator.calculateTotalTourCost}
            calculateFixedCosts={calculator.calculateFixedCosts}
            calculatePerPersonCosts={calculator.calculatePerPersonCosts}
            calculateCostPerPerson={calculator.calculateCostPerPerson}
            calculateDailyCostPerPerson={calculator.calculateDailyCostPerPerson}
            calculateProfit={calculator.calculateProfit}
            currentPax={calculator.currentPax}
            tourDuration={calculator.tourDuration}
            calculateParkFeesCost={calculator.calculateParkFeesCost}
          />
        </TabsContent>
        
        <TabsContent value="breakdown">
          <DailyBreakdownTable 
            tourDuration={calculator.tourDuration}
            averageAccommodationCost={calculator.averageAccommodationCost}
            accommodationMarkup={calculator.accommodationMarkup}
            preparedMealsCost={calculator.preparedMealsCost}
            mealMarkup={calculator.mealMarkup}
            averageActivityCost={calculator.averageActivityCost}
            activitiesMarkup={calculator.activitiesMarkup}
            calculateVehicleCost={calculator.calculateVehicleCost}
            calculateCrewCost={calculator.calculateCrewCost}
            currentPax={calculator.currentPax}
            selectedRoomType={calculator.selectedRoomType}
            selectedMealBasis={calculator.selectedMealBasis}
            parkFees={calculator.parkFees}
            setParkFees={calculator.setParkFees}
          />
        </TabsContent>
        
        <TabsContent value="comparison">
          <GroupSizeAnalysis 
            minPax={calculator.minPax}
            maxPax={calculator.maxPax}
            currentPax={calculator.currentPax}
            calculateFixedCosts={calculator.calculateFixedCosts}
            calculateAccommodationCost={calculator.calculateAccommodationCost}
            calculateActivityCost={calculator.calculateActivityCost}
            calculateMealCost={calculator.calculateMealCost}
            tourDuration={calculator.tourDuration}
            calculateParkFeesCost={calculator.calculateParkFeesCost}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
