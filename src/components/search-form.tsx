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
    const [travelClass, setTravelClass] = React.useState("ECONOMY");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!origin || !destination || !date) return;

        onSearch({
            origin: origin.toUpperCase(),
            destination: destination.toUpperCase(),
            departureDate: format(date, "yyyy-MM-dd"),
            travelClass: travelClass as SearchParams['travelClass'],
        });
    };

    return (
        <Card className="w-full max-w-5xl mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur-xl dark:bg-zinc-900/95 overflow-hidden ring-1 ring-zinc-900/5">
            <div className="h-1 bg-gradient-to-r from-[#C5A059] via-[#E6C685] to-[#C5A059]"></div>
            <CardContent className="p-8 md:p-10">
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Origin */}
                        <div className="md:col-span-3 relative group">
                            <LocationInput
                                label="From"
                                value={origin}
                                onChange={setOrigin}
                                placeholder="Origin City"
                            />
                        </div>

                        {/* Destination */}
                        <div className="md:col-span-3 relative group">
                            <LocationInput
                                label="To"
                                value={destination}
                                onChange={setDestination}
                                placeholder="Destination City"
                            />
                        </div>

                        {/* Date Picker */}
                        <div className="md:col-span-3 group">
                            <label className="text-xs uppercase tracking-widest text-[#C5A059] font-bold mb-3 block pl-1">Departure</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"ghost"}
                                        className={cn(
                                            "w-full h-14 justify-start text-left font-normal text-lg border-0 border-b border-zinc-200 rounded-none pl-12 hover:bg-transparent hover:text-[#C5A059] focus-visible:ring-0 focus-visible:border-[#C5A059] transition-all font-serif relative",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-[#C5A059] pl-3">
                                            <CalendarIcon className="h-5 w-5" />
                                        </div>
                                        {date ? format(date, "PPP") : <span>Select Date</span>}
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

                        {/* Class/Travelers */}
                        <div className="md:col-span-3 group relative">
                            <label className="text-xs uppercase tracking-widest text-[#C5A059] font-bold mb-3 block pl-1">Cabin Class</label>
                            <div className="relative">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-[#C5A059] pl-3 pointer-events-none z-10">
                                    <Armchair className="h-5 w-5" />
                                </div>
                                <Select value={travelClass} onValueChange={setTravelClass}>
                                    <SelectTrigger className="w-full !h-14 text-lg border-0 border-b border-zinc-200 rounded-none pl-12 focus:ring-0 focus:border-[#C5A059] font-serif bg-transparent data-[placeholder]:text-zinc-300">
                                        <SelectValue placeholder="Class" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none border-zinc-100 shadow-xl font-serif">
                                        <SelectItem value="ECONOMY">Economy</SelectItem>
                                        <SelectItem value="PREMIUM_ECONOMY">Premium Economy</SelectItem>
                                        <SelectItem value="BUSINESS">Business Class</SelectItem>
                                        <SelectItem value="FIRST">First Class</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center mt-4">
                        <Button
                            type="submit"
                            className="w-full md:w-auto px-16 h-14 text-lg tracking-widest font-bold bg-[#C5A059] hover:bg-[#B08D4C] text-white transition-all shadow-lg rounded-none uppercase"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                "Searching..."
                            ) : (
                                "Search Flights"
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
