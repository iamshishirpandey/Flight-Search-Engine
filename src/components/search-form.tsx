"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Armchair } from "lucide-react";
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

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
    const [origin, setOrigin] = React.useState("");
    const [destination, setDestination] = React.useState("");
    const [date, setDate] = React.useState<Date>();
    const [returnDate, setReturnDate] = React.useState<Date>();
    const [travelClass, setTravelClass] = React.useState("ECONOMY");
    const [travelers, setTravelers] = React.useState("1");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!origin || !destination || !date) return;

        onSearch({
            origin: origin.toUpperCase(),
            destination: destination.toUpperCase(),
            departureDate: format(date, "yyyy-MM-dd"),
            returnDate: returnDate ? format(returnDate, "yyyy-MM-dd") : undefined,
            adults: parseInt(travelers),
            travelClass: travelClass as SearchParams['travelClass'],
        });
    };

    return (
        <Card className="w-full max-w-5xl mx-auto shadow-xl border border-[#E5E5E5] bg-white overflow-hidden">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent"></div>
            <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Row 1: Locations and Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border border-[#E5E5E5] divide-y md:divide-y-0 md:divide-x divide-[#E5E5E5] rounded-sm overflow-hidden">
                        {/* Origin */}
                        <div className="md:col-span-4 relative group bg-white">
                            <LocationInput
                                label="From"
                                value={origin}
                                onChange={setOrigin}
                                placeholder="Origin City"
                                className="border-0"
                            />
                        </div>

                        {/* Destination */}
                        <div className="md:col-span-4 relative group bg-white">
                            <LocationInput
                                label="To"
                                value={destination}
                                onChange={setDestination}
                                placeholder="Destination City"
                                className="border-0"
                            />
                        </div>

                        {/* Date Picker (Departure) */}
                        <div className="md:col-span-2 group bg-white p-3">
                            <label className="text-xs uppercase tracking-widest text-[#C5A059] font-bold mb-1 block pl-1">Departure</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"ghost"}
                                        className={cn(
                                            "w-full h-10 justify-start text-left font-normal text-base border-0 p-0 hover:bg-transparent hover:text-[#C5A059] transition-all font-serif relative text-[#2C2C2C]",
                                            !date && "text-[#ACACAC]"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4 text-[#C5A059]" />
                                            {date ? format(date, "MMM dd") : <span className="text-[#ACACAC]">Select Date</span>}
                                        </div>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 rounded-none border-zinc-100 shadow-xl" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                        disabled={(date) => date < new Date()}
                                        className="rounded-none font-serif"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Date Picker (Return) */}
                        <div className="md:col-span-2 group bg-white p-3">
                            <label className="text-xs uppercase tracking-widest text-[#C5A059] font-bold mb-1 block pl-1">Return</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"ghost"}
                                        className={cn(
                                            "w-full h-10 justify-start text-left font-normal text-base border-0 p-0 hover:bg-transparent hover:text-[#C5A059] transition-all font-serif relative text-[#2C2C2C]",
                                            !returnDate && "text-[#ACACAC]"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4 text-[#C5A059]" />
                                            {returnDate ? format(returnDate, "MMM dd") : <span className="text-[#ACACAC]">One Way</span>}
                                        </div>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 rounded-none border-zinc-100 shadow-xl" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={returnDate}
                                        onSelect={setReturnDate}
                                        initialFocus
                                        disabled={(date) => date < new Date()}
                                        className="rounded-none font-serif"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Row 2: Filters and Search Button */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 pt-2">

                        {/* Filters (Left) */}
                        <div className="flex flex-col md:flex-row gap-8 w-full md:w-auto">
                            {/* Travelers */}
                            <div className="group min-w-[140px]">
                                <label className="text-xs uppercase tracking-widest text-[#C5A059] font-bold mb-2 block">Travelers</label>
                                <div className="relative">
                                    <Select value={travelers} onValueChange={setTravelers}>
                                        <SelectTrigger className="w-full h-11 text-base border-0 border-b border-[#E5E5E5] rounded-none pl-0 focus:ring-0 focus:border-[#C5A059] font-serif bg-transparent text-[#2C2C2C]">
                                            <div className="flex items-center gap-2">
                                                <Armchair className="h-4 w-4 text-[#C5A059]" />
                                                <SelectValue placeholder="1 Adult" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="rounded-sm border-[#E5E5E5] bg-white shadow-lg font-serif text-[#2C2C2C]">
                                            <SelectItem value="1">1 Adult</SelectItem>
                                            <SelectItem value="2">2 Adults</SelectItem>
                                            <SelectItem value="3">3 Adults</SelectItem>
                                            <SelectItem value="4">4 Adults</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Cabin Class */}
                            <div className="group min-w-[180px]">
                                <label className="text-xs uppercase tracking-widest text-[#C5A059] font-bold mb-2 block">Cabin Class</label>
                                <div className="relative">
                                    <Select value={travelClass} onValueChange={setTravelClass}>
                                        <SelectTrigger className="w-full h-11 text-base border-0 border-b border-[#E5E5E5] rounded-none pl-0 focus:ring-0 focus:border-[#C5A059] font-serif bg-transparent text-[#2C2C2C]">
                                            <div className="flex items-center gap-2">
                                                <Armchair className="h-4 w-4 text-[#C5A059]" />
                                                <SelectValue placeholder="Class" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="rounded-sm border-[#E5E5E5] bg-white shadow-lg font-serif text-[#2C2C2C]">
                                            <SelectItem value="ECONOMY">Economy</SelectItem>
                                            <SelectItem value="PREMIUM_ECONOMY">Premium Economy</SelectItem>
                                            <SelectItem value="BUSINESS">Business Class</SelectItem>
                                            <SelectItem value="FIRST">First Class</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Search Button (Right) */}
                        <div className="w-full md:w-auto">
                            <Button
                                type="submit"
                                className="w-full md:w-auto px-12 h-12 text-sm tracking-[0.2em] font-medium bg-[#C5A059] hover:bg-[#B08D4C] text-white transition-all shadow-md rounded-sm uppercase"
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
