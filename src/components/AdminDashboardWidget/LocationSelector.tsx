import { Button } from "@/components/ui/button";
import { LocationFilter, LOCATION_FILTERS } from "@/types";
import React from "react";

interface LocationSelectorProps {
  selectedLocation: LocationFilter;
  onLocationChange: (location: LocationFilter) => void;
}
export const LocationSelector = ({ selectedLocation, onLocationChange }: LocationSelectorProps) => {
  return (
    <div className="flex flex-wrap sm:flex-nowrap gap-2 mb-6">
      <Button
        className="w-full flex- sm:w-auto"
        variant={selectedLocation === LOCATION_FILTERS.ALL ? "default" : "outline"}
        onClick={() => onLocationChange(LOCATION_FILTERS.ALL)}
      >
        All
      </Button>
      <Button
        variant={selectedLocation === LOCATION_FILTERS.SPM ? "default" : "outline"}
        onClick={() => onLocationChange(LOCATION_FILTERS.SPM)}
        className="flex-1 sm:flex-none"
      >
        South Point Mall
      </Button>
      <Button
        variant={selectedLocation === LOCATION_FILTERS.JC ? "default" : "outline"}
        onClick={() => onLocationChange(LOCATION_FILTERS.JC)}
        className="flex-1 sm:flex-none"
      >
        AIPL Joy Central
      </Button>
    </div>
  );
};
