"use client";

import * as React from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlightOffer } from "@/lib/types";

export interface FilterState {
    priceRange: [number, number];
    stops: string[]; // "0", "1", "2+"
    airlines: string[];
}

interface FilterSidebarProps {
    flights: FlightOffer[];
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
}

export function FilterSidebar({ flights, filters, onFilterChange }: FilterSidebarProps) {
    // Calculate derived data from flights for filter options
    const derivedData = React.useMemo(() => {
        if (flights.length === 0) return { minPrice: 0, maxPrice: 1000, airlines: [] };

        const prices = flights.map((f) => parseFloat(f.price.total));
        const minPrice = Math.floor(Math.min(...prices));
        const maxPrice = Math.ceil(Math.max(...prices));

        const airlines = Array.from(new Set(flights.map(f => f.airline))).sort();

        return { minPrice, maxPrice, airlines };
    }, [flights]);

    // Handle Price Change
    const handlePriceChange = (value: number[]) => {
        onFilterChange({ ...filters, priceRange: [value[0], value[1]] });
    };

    // Handle Stops Change
    const handleStopChange = (stop: string, checked: boolean) => {
        const newStops = checked
            ? [...filters.stops, stop]
            : filters.stops.filter((s) => s !== stop);
        onFilterChange({ ...filters, stops: newStops });
    };

    // Handle Airline Change
    const handleAirlineChange = (airline: string, checked: boolean) => {
        const newAirlines = checked
            ? [...filters.airlines, airline]
            : filters.airlines.filter((a) => a !== airline);
        onFilterChange({ ...filters, airlines: newAirlines });
    };

    if (flights.length === 0) return null;

    return (
        <Card className="w-full border border-[#E5E5E5] bg-white rounded-sm h-fit">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent"></div>
            <CardHeader className="pb-4">
                <CardTitle className="text-sm font-light tracking-[0.2em] uppercase text-[#C5A059]">
                    Filters
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Price Filter */}
                <div className="space-y-4">
                    <Label className="text-xs uppercase tracking-wider text-[#8C8C8C]">Price Range</Label>
                    <Slider
                        defaultValue={[derivedData.minPrice, derivedData.maxPrice]}
                        min={derivedData.minPrice}
                        max={derivedData.maxPrice}
                        step={1}
                        value={[
                            Math.max(derivedData.minPrice, filters.priceRange[0]),
                            Math.min(derivedData.maxPrice, filters.priceRange[1])
                        ]}
                        onValueChange={handlePriceChange}
                        className="my-4"
                    />
                    <div className="flex justify-between text-xs font-serif text-[#2C2C2C]">
                        <span>${filters.priceRange[0]}</span>
                        <span>${filters.priceRange[1]}</span>
                    </div>
                </div>

                {/* Stops Filter */}
                <div className="space-y-4">
                    <Label className="text-xs uppercase tracking-wider text-[#8C8C8C]">Stops</Label>
                    <div className="space-y-2">
                        {["0", "1", "2+"].map((stop) => (
                            <div key={stop} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`stop-${stop}`}
                                    checked={filters.stops.includes(stop)}
                                    onCheckedChange={(checked: boolean | "indeterminate") => handleStopChange(stop, checked === true)}
                                    className="border-[#E5E5E5] data-[state=checked]:bg-[#C5A059] data-[state=checked]:border-[#C5A059]"
                                />
                                <label
                                    htmlFor={`stop-${stop}`}
                                    className="text-sm font-light text-[#2C2C2C] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {stop === "0" ? "Non-stop" : stop === "1" ? "1 Stop" : "2+ Stops"}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Airlines Filter */}
                <div className="space-y-4">
                    <Label className="text-xs uppercase tracking-wider text-[#8C8C8C]">Airlines</Label>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-200">
                        {derivedData.airlines.map((airline) => (
                            <div key={airline} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`airline-${airline}`}
                                    checked={filters.airlines.includes(airline)}
                                    onCheckedChange={(checked: boolean | "indeterminate") => handleAirlineChange(airline, checked === true)}
                                    className="border-[#E5E5E5] data-[state=checked]:bg-[#C5A059] data-[state=checked]:border-[#C5A059]"
                                />
                                <label
                                    htmlFor={`airline-${airline}`}
                                    className="text-sm font-light text-[#2C2C2C] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 truncate"
                                >
                                    {airline}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
