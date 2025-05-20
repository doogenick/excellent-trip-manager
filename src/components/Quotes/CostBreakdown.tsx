
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
import { useTourCalculatorState } from "@/hooks/tourCalculator/useTourCalculatorState";
import { useMemo } from "react";

export function CostBreakdown() {
  // Use the state hook directly instead of the full calculator hook
  const calculatorState = useTourCalculatorState();
  
  // Create calculation functions using the state
  const calculationFunctions = useMemo(() => {
    // Vehicle cost calculation
    const calculateVehicleCost = () => {
      const baseRate = calculatorState.selectedVehicle === "custom" 
        ? calculatorState.customDailyRate 
        : 200; // Default rate
      const baseCost = baseRate * calculatorState.tourDuration;
      const markup = baseCost * (calculatorState.vehicleMarkup / 100);
      return baseCost + markup;
    };

    // Fuel cost calculation
    const calculateFuelCost = () => {
      const fuelConsumption = calculatorState.selectedVehicle === "custom"
        ? calculatorState.customFuelConsumption
        : 6; // Default consumption
      const fuelNeeded = calculatorState.totalDistance / fuelConsumption;
      return fuelNeeded * calculatorState.fuelPrice;
    };

    // Accommodation cost calculation
    const calculateAccommodationCost = () => {
      const baseCost = calculatorState.averageAccommodationCost * 
        calculatorState.tourDuration * 
        calculatorState.currentPax;
      const markup = baseCost * (calculatorState.accommodationMarkup / 100);
      return baseCost + markup;
    };

    // Crew cost calculation
    const calculateCrewCost = () => {
      return calculatorState.crew.reduce((total, member) => {
        const dailyCost = member.dailyRate * calculatorState.tourDuration;
        const accommodationCost = member.accommodationRate * calculatorState.tourDuration;
        const mealCost = member.mealAllowance * calculatorState.tourDuration;
        return total + dailyCost + accommodationCost + mealCost;
      }, 0);
    };

    // Activity cost calculation
    const calculateActivityCost = () => {
      const baseCost = calculatorState.averageActivityCost * 
        calculatorState.includedActivities * 
        calculatorState.currentPax;
      const markup = baseCost * (calculatorState.activitiesMarkup / 100);
      return baseCost + markup;
    };

    // Meal cost calculation
    const calculateMealCost = () => {
      const baseCost = calculatorState.preparedMealsCost * 
        calculatorState.includedMeals * 
        calculatorState.currentPax;
      const markup = baseCost * (calculatorState.mealMarkup / 100);
      return baseCost + markup;
    };

    // Park fees calculation
    const calculateParkFeesCost = () => {
      const totalParkFees = calculatorState.parkFees.reduce((sum, fee) => sum + fee, 0);
      return totalParkFees * calculatorState.currentPax;
    };

    // Pre/post tour cost calculation
    const calculatePrePostTourCost = () => {
      const baseCost = calculatorState.prePostAccommodationCost * calculatorState.prePostNights;
      const markup = baseCost * (calculatorState.prePostMarkup / 100);
      return baseCost + markup;
    };

    // Fixed costs (vehicle, fuel, crew)
    const calculateFixedCosts = () => {
      return calculateVehicleCost() + calculateFuelCost() + calculateCrewCost();
    };

    // Per-person costs (accommodation, activities, meals)
    const calculatePerPersonCosts = () => {
      return (calculateAccommodationCost() + calculateActivityCost() + calculateMealCost() + calculateParkFeesCost()) / calculatorState.currentPax;
    };

    // Total tour cost
    const calculateTotalTourCost = () => {
      return calculateFixedCosts() + calculateAccommodationCost() + calculateMealCost() + calculateParkFeesCost() + calculateActivityCost();
    };

    // Cost per person
    const calculateCostPerPerson = () => {
      return calculateTotalTourCost() / calculatorState.currentPax;
    };

    // Daily cost per person
    const calculateDailyCostPerPerson = () => {
      return calculateCostPerPerson() / calculatorState.tourDuration;
    };

    // Profit calculation
    const calculateProfit = () => {
      // Simple profit calculation - in a real app, you would have more complex logic
      const totalCost = calculateTotalTourCost();
      // Assume a 20% markup for profit calculation
      return totalCost * 0.2;
    };

    return {
      calculateVehicleCost,
      calculateFuelCost,
      calculateAccommodationCost,
      calculateCrewCost,
      calculateActivityCost,
      calculateMealCost,
      calculateParkFeesCost,
      calculatePrePostTourCost,
      calculateFixedCosts,
      calculatePerPersonCosts,
      calculateTotalTourCost,
      calculateCostPerPerson,
      calculateDailyCostPerPerson,
      calculateProfit
    };
  }, [
    calculatorState.selectedVehicle,
    calculatorState.customDailyRate,
    calculatorState.customFuelConsumption,
    calculatorState.tourDuration,
    calculatorState.vehicleMarkup,
    calculatorState.totalDistance,
    calculatorState.fuelPrice,
    calculatorState.averageAccommodationCost,
    calculatorState.currentPax,
    calculatorState.accommodationMarkup,
    calculatorState.crew,
    calculatorState.averageActivityCost,
    calculatorState.includedActivities,
    calculatorState.activitiesMarkup,
    calculatorState.preparedMealsCost,
    calculatorState.includedMeals,
    calculatorState.mealMarkup,
    calculatorState.parkFees,
    calculatorState.prePostAccommodationCost,
    calculatorState.prePostNights,
    calculatorState.prePostMarkup
  ]);
  
  // Combine state and calculation functions
  const calculator = {
    ...calculatorState,
    ...calculationFunctions
  };
  
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
            {/* Tour Basics Section */}
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
            
            {/* Vehicle & Fuel Section */}
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
            
            {/* Crew Section */}
            <CrewSection 
              crew={calculator.crew}
              setCrew={calculator.setCrew}
              calculateCrewCost={calculator.calculateCrewCost}
              crewMealRates={calculator.crewMealRates}
              setCrewMealRates={calculator.setCrewMealRates}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Accommodation Section */}
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
            
            {/* Meals & Activities Section */}
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
              currentPax={calculator.currentPax}
            />
            
            {/* Pre/Post Tour Section */}
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
          
          {/* Cost Summary Section */}
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
          {/* Daily Breakdown Table */}
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
          {/* Group Size Analysis */}
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
