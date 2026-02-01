"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Armchair, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { LocationInput } from "@/components/location-input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { SearchParams } from "@/lib/types";

interface SearchFormProps {
    onSearch: (params: SearchParams) => void;
    isLoading: boolean;
}

interface ValidationErrors {
    origin?: boolean;
    destination?: boolean;
    date?: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
    const [origin, setOrigin] = React.useState("");
    const [destination, setDestination] = React.useState("");
    const [date, setDate] = React.useState<Date>();
    const [returnDate, setReturnDate] = React.useState<Date>();
    const [travelClass, setTravelClass] = React.useState("ECONOMY");
    const [travelers, setTravelers] = React.useState("1");
    const [errors, setErrors] = React.useState<ValidationErrors>({});
    const [showErrors, setShowErrors] = React.useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        const newErrors: ValidationErrors = {
            origin: !origin,
            destination: !destination,
            date: !date,
        };

        setErrors(newErrors);
        setShowErrors(true);

        // Check if any errors exist
        if (newErrors.origin || newErrors.destination || newErrors.date) {
            return;
        }

        onSearch({
            origin: origin.toUpperCase(),
            destination: destination.toUpperCase(),
            departureDate: format(date!, "yyyy-MM-dd"),
            returnDate: returnDate ? format(returnDate, "yyyy-MM-dd") : undefined,
            adults: parseInt(travelers),
            travelClass: travelClass as SearchParams['travelClass'],
        });
    };

    // Clear error when field is filled
    React.useEffect(() => {
        if (showErrors) {
            setErrors(prev => ({
                ...prev,
                origin: !origin,
                destination: !destination,
                date: !date,
            }));
        }
    }, [origin, destination, date, showErrors]);

    return (
        <Card className="w-full max-w-5xl mx-auto border border-[#E5E5E5] bg-white overflow-hidden">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent"></div>
            <CardContent className="p-4 md:p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Row 1: Locations and Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border border-[#E5E5E5] divide-y md:divide-y-0 md:divide-x divide-[#E5E5E5] rounded-sm overflow-hidden">
                        {/* Origin */}
                        <div className={cn(
                            "md:col-span-4 relative group bg-white transition-colors",
                            showErrors && errors.origin && "bg-red-50/50 ring-1 ring-inset ring-red-300"
                        )}>
                            <LocationInput
                                label="From"
                                value={origin}
                                onChange={setOrigin}
                                placeholder="Origin City"
                                className="border-0"
                                hasError={showErrors && errors.origin}
                            />
                            {showErrors && errors.origin && (
                                <div className="absolute bottom-1 left-4 flex items-center gap-1 text-red-500 text-[10px] uppercase tracking-wider">
                                    <AlertCircle className="h-3 w-3" />
                                    Required
                                </div>
                            )}
                        </div>

                        {/* Destination */}
                        <div className={cn(
                            "md:col-span-4 relative group bg-white transition-colors",
                            showErrors && errors.destination && "bg-red-50/50 ring-1 ring-inset ring-red-300"
                        )}>
                            <LocationInput
                                label="To"
                                value={destination}
                                onChange={setDestination}
                                placeholder="Destination City"
                                className="border-0"
                                hasError={showErrors && errors.destination}
                            />
                            {showErrors && errors.destination && (
                                <div className="absolute bottom-1 left-4 flex items-center gap-1 text-red-500 text-[10px] uppercase tracking-wider">
                                    <AlertCircle className="h-3 w-3" />
                                    Required
                                </div>
                            )}
                        </div>

                        {/* Date Picker (Departure) */}
                        <div className={cn(
                            "md:col-span-2 group bg-white p-4 transition-colors",
                            showErrors && errors.date && "bg-red-50/50 ring-1 ring-inset ring-red-300"
                        )}>
                            <label className={cn(
                                "text-xs uppercase tracking-widest font-bold mb-2 block",
                                showErrors && errors.date ? "text-red-500" : "text-[#C5A059]"
                            )}>Departure</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"ghost"}
                                        className={cn(
                                            "w-full h-12 justify-start text-left font-normal text-lg border-0 pl-9 hover:bg-transparent hover:text-[#C5A059] transition-all font-serif relative text-[#2C2C2C]",
                                            !date && "text-[#ACACAC]"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute left-0 top-1/2 -translate-y-1/2",
                                            showErrors && errors.date ? "text-red-400" : "text-[#C5A059]"
                                        )}>
                                            <CalendarIcon className="h-5 w-5" />
                                        </div>
                                        {date ? format(date, "MMM dd") : <span>Select Date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 rounded-sm border-[#E5E5E5]" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                        disabled={(date) => date < new Date()}
                                        className="rounded-sm font-serif"
                                    />
                                </PopoverContent>
                            </Popover>
                            {showErrors && errors.date && (
                                <div className="flex items-center gap-1 text-red-500 text-[10px] uppercase tracking-wider mt-1">
                                    <AlertCircle className="h-3 w-3" />
                                    Required
                                </div>
                            )}
                        </div>

                        {/* Date Picker (Return) */}
                        <div className="md:col-span-2 group bg-white p-4">
                            <label className="text-xs uppercase tracking-widest text-[#C5A059] font-bold mb-2 block">Return</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"ghost"}
                                        className={cn(
                                            "w-full h-12 justify-start text-left font-normal text-lg border-0 pl-9 hover:bg-transparent hover:text-[#C5A059] transition-all font-serif relative text-[#2C2C2C]",
                                            !returnDate && "text-[#ACACAC]"
                                        )}
                                    >
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[#C5A059]">
                                            <CalendarIcon className="h-5 w-5" />
                                        </div>
                                        {returnDate ? format(returnDate, "MMM dd") : <span>One Way</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 rounded-sm border-[#E5E5E5] shadow-xl" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={returnDate}
                                        onSelect={setReturnDate}
                                        initialFocus
                                        disabled={(date) => date < new Date()}
                                        className="rounded-sm font-serif"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Row 2: Filters and Search Button */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-4 md:gap-6 pt-2">

                        {/* Filters (Left) */}
                        <div className="grid grid-cols-2 md:flex md:flex-row gap-4 md:gap-8 w-full md:w-auto">
                            {/* Travelers */}
                            <div className="group min-w-[160px]">
                                <label className="text-xs uppercase tracking-widest text-[#C5A059] font-bold mb-2 block">Travelers</label>
                                <div className="relative">
                                    <Select value={travelers} onValueChange={setTravelers}>
                                        <SelectTrigger className="w-full h-12 text-lg border-0 border-b border-[#E5E5E5] rounded-none pl-9 pr-4 focus:ring-0 focus:border-[#C5A059] font-serif bg-transparent text-[#2C2C2C] hover:border-[#C5A059] transition-colors">
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[#C5A059]">
                                                <Armchair className="h-5 w-5" />
                                            </div>
                                            <SelectValue placeholder="1 Adult" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-sm border-[#E5E5E5] bg-white font-serif text-[#2C2C2C] min-w-[180px]">
                                            <SelectItem value="1" className="text-base py-3 px-4 cursor-pointer hover:bg-[#F5F3EF] focus:bg-[#F5F3EF] focus:text-[#C5A059]">1 Adult</SelectItem>
                                            <SelectItem value="2" className="text-base py-3 px-4 cursor-pointer hover:bg-[#F5F3EF] focus:bg-[#F5F3EF] focus:text-[#C5A059]">2 Adults</SelectItem>
                                            <SelectItem value="3" className="text-base py-3 px-4 cursor-pointer hover:bg-[#F5F3EF] focus:bg-[#F5F3EF] focus:text-[#C5A059]">3 Adults</SelectItem>
                                            <SelectItem value="4" className="text-base py-3 px-4 cursor-pointer hover:bg-[#F5F3EF] focus:bg-[#F5F3EF] focus:text-[#C5A059]">4 Adults</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Cabin Class */}
                            <div className="group min-w-[200px]">
                                <label className="text-xs uppercase tracking-widest text-[#C5A059] font-bold mb-2 block">Cabin Class</label>
                                <div className="relative">
                                    <Select value={travelClass} onValueChange={setTravelClass}>
                                        <SelectTrigger className="w-full h-12 text-lg border-0 border-b border-[#E5E5E5] rounded-none pl-9 pr-4 focus:ring-0 focus:border-[#C5A059] font-serif bg-transparent text-[#2C2C2C] hover:border-[#C5A059] transition-colors">
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[#C5A059]">
                                                <Armchair className="h-5 w-5" />
                                            </div>
                                            <SelectValue placeholder="Class" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-sm border-[#E5E5E5] bg-white font-serif text-[#2C2C2C] min-w-[220px]">
                                            <SelectItem value="ECONOMY" className="text-base py-3 px-4 cursor-pointer hover:bg-[#F5F3EF] focus:bg-[#F5F3EF] focus:text-[#C5A059]">Economy</SelectItem>
                                            <SelectItem value="PREMIUM_ECONOMY" className="text-base py-3 px-4 cursor-pointer hover:bg-[#F5F3EF] focus:bg-[#F5F3EF] focus:text-[#C5A059]">Premium Economy</SelectItem>
                                            <SelectItem value="BUSINESS" className="text-base py-3 px-4 cursor-pointer hover:bg-[#F5F3EF] focus:bg-[#F5F3EF] focus:text-[#C5A059]">Business Class</SelectItem>
                                            <SelectItem value="FIRST" className="text-base py-3 px-4 cursor-pointer hover:bg-[#F5F3EF] focus:bg-[#F5F3EF] focus:text-[#C5A059]">First Class</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Search Button (Right) */}
                        <div className="w-full md:w-auto">
                            <Button
                                type="submit"
                                className="w-full md:w-auto px-12 h-12 text-sm tracking-[0.2em] font-medium bg-[#C5A059] hover:bg-[#B08D4C] text-white transition-all rounded-sm uppercase"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    "Searching..."
                                ) : (
                                    "Search Flights"
                                )}
                            </Button>
                        </div>
                    </div>


                </form>
            </CardContent>
        </Card>
    );
}
