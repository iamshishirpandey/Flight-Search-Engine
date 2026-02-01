"use client";

import * as React from "react";
import { Check, Plane } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { airports } from "@/lib/data";

interface LocationInputProps {
    value: string;
    onChange: (value: string) => void;
    label: string;
    placeholder?: string;
    className?: string;
    hasError?: boolean;
}

export function LocationInput({ value, onChange, label, placeholder = "Select city...", className, hasError }: LocationInputProps) {
    const [open, setOpen] = React.useState(false);

    const selectedAirport = airports.find((airport) => airport.code === value);

    return (
        <div className={cn("p-4", className)}>
            <label className={cn(
                "text-xs uppercase tracking-widest font-bold mb-2 block",
                hasError ? "text-red-500" : "text-[#C5A059]"
            )}>{label}</label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-full h-12 justify-start text-left font-normal text-lg border-0 rounded-none pl-10 hover:bg-transparent hover:text-[#C5A059] focus-visible:ring-0 transition-all font-serif relative text-[#2C2C2C]",
                            !value && "text-[#ACACAC]"
                        )}
                    >
                        <div className={cn(
                            "absolute left-0 top-1/2 -translate-y-1/2 transition-colors pointer-events-none",
                            hasError ? "text-red-400" : "text-[#C5A059] group-hover:text-[#C5A059]"
                        )}>
                            <Plane className="h-5 w-5" />
                        </div>
                        {selectedAirport ? (
                            <span className="truncate">
                                {selectedAirport.city} ({selectedAirport.code})
                            </span>
                        ) : (
                            <span>{placeholder}</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0 border-[#E5E5E5] bg-white font-serif rounded-sm" align="start">
                    <Command className="bg-white">
                        <CommandInput placeholder="Search city or airport..." className="text-[#2C2C2C] placeholder:text-[#ACACAC]" />
                        <CommandList>
                            <CommandEmpty className="text-[#ACACAC] py-6 text-center text-sm">No results found.</CommandEmpty>
                            <CommandGroup heading="Suggestions" className="text-[#8C8C8C]">
                                {airports.map((airport) => (
                                    <CommandItem
                                        key={airport.code}
                                        value={`${airport.city} ${airport.name} ${airport.code}`}
                                        onSelect={() => {
                                            onChange(airport.code);
                                            setOpen(false);
                                        }}
                                        className="cursor-pointer aria-selected:bg-[#F5F3EF] text-[#2C2C2C]"
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{airport.city}</span>
                                                <span className="text-xs text-[#8C8C8C]">{airport.name}</span>
                                            </div>
                                            <span className="font-bold text-[#C5A059] ml-2">{airport.code}</span>
                                        </div>
                                        <Check
                                            className={cn(
                                                "ml-2 h-4 w-4 text-[#C5A059]",
                                                value === airport.code ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
