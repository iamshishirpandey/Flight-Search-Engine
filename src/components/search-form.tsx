"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search, Plane } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
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
        <Card className="w-full max-w-4xl mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-md dark:bg-black/50">
            <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        {/* Origin */}
                        <div className="md:col-span-3 relative">
                            <div className="absolute left-3 top-3 text-muted-foreground">
                                <Plane className="h-5 w-5" />
                            </div>
                            <Input
                                placeholder="Where from? (e.g. JFK)"
                                className="pl-10 h-12 text-base"
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                                required
                            />
                        </div>

                        {/* Destination */}
                        <div className="md:col-span-3 relative">
                            <div className="absolute left-3 top-3 text-muted-foreground">
                                <Plane className="h-5 w-5" />
                            </div>
                            <Input
                                placeholder="Where to? (e.g. LHR)"
                                className="pl-10 h-12 text-base"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                required
                            />
                        </div>

                        {/* Date Picker */}
                        <div className="md:col-span-3">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full h-12 justify-start text-left font-normal text-base",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                        disabled={(date) => date < new Date()}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Class/Travelers */}
                        <div className="md:col-span-3">
                            <Select value={travelClass} onValueChange={setTravelClass}>
                                <SelectTrigger className="h-12 w-full text-base">
                                    <SelectValue placeholder="Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ECONOMY">Economy</SelectItem>
                                    <SelectItem value="PREMIUM_ECONOMY">Premium Economy</SelectItem>
                                    <SelectItem value="BUSINESS">Business</SelectItem>
                                    <SelectItem value="FIRST">First Class</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full md:w-auto md:self-end h-12 px-8 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            "Searching..."
                        ) : (
                            <>
                                <Search className="mr-2 h-5 w-5" />
                                Explore
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
