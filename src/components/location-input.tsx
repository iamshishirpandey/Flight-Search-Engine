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
}

export function LocationInput({ value, onChange, label, placeholder = "Select city...", className }: LocationInputProps) {
    const [open, setOpen] = React.useState(false);

    const selectedAirport = airports.find((airport) => airport.code === value);

    return (
        <div className={className}>
            <label className="text-xs uppercase tracking-widest text-[#C5A059] font-bold mb-3 block pl-1">{label}</label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-full h-14 justify-start text-left font-normal text-lg border-0 border-b border-zinc-200 rounded-none pl-12 hover:bg-transparent hover:text-[#C5A059] focus-visible:ring-0 focus-visible:border-[#C5A059] transition-all font-serif relative",
                            !value && "text-muted-foreground"
                        )}
                    >
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors group-hover:text-[#C5A059] pl-3 pointer-events-none">
                            <Plane className="h-5 w-5" />
                        </div>
                        {selectedAirport ? (
                            <span className="truncate">
                                {selectedAirport.city} ({selectedAirport.code})
                            </span>
                        ) : (
                            <span className="text-zinc-300">{placeholder}</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0 rounded-none border-zinc-100 shadow-xl font-serif" align="start">
                    <Command>
                        <CommandInput placeholder="Search city or airport..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Suggestions">
                                {airports.map((airport) => (
                                    <CommandItem
                                        key={airport.code}
                                        value={`${airport.city} ${airport.name} ${airport.code}`}
                                        onSelect={() => {
                                            onChange(airport.code);
                                            setOpen(false);
                                        }}
                                        className="cursor-pointer aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800"
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{airport.city}</span>
                                                <span className="text-xs text-muted-foreground">{airport.name}</span>
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
