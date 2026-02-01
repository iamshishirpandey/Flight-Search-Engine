"use client";

import { FlightOffer } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plane } from "lucide-react";
import { format, parseISO } from "date-fns";

interface FlightResultsProps {
    flights: FlightOffer[];
}

export function FlightResults({ flights }: FlightResultsProps) {
    if (flights.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                No flights found. Try adjusting your search.
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full max-w-4xl mx-auto mt-12">
            {flights.map((flight) => (
                <div key={flight.id} className="relative group perspective-1000">
                    {/* Ticket Container */}
                    <div className="flex flex-col md:flex-row bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-xl border border-zinc-100 dark:border-zinc-800 hover:shadow-2xl transition-all duration-300">

                        {/* Main Ticket Section (Left) */}
                        <div className="flex-1 p-6 md:p-8 relative bg-white dark:bg-zinc-900">
                            {/* Decorative Gold Line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-[#C5A059]"></div>

                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <div className="text-xs font-bold text-[#C5A059] tracking-[0.2em] uppercase mb-1">Airline</div>
                                    <div className="font-serif text-xl font-bold flex items-center gap-2">
                                        <Badge variant="outline" className="rounded-none border-[#C5A059] text-[#C5A059] font-normal px-2 py-0.5">
                                            {flight.airline}
                                        </Badge>
                                        <span className="text-zinc-600 dark:text-zinc-400 text-sm tracking-wider">{flight.flightNumber}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-[#C5A059] tracking-[0.2em] uppercase mb-1">Class</div>
                                    <div className="font-serif font-bold text-zinc-900 dark:text-white">Business</div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center relative">
                                {/* Departure */}
                                <div>
                                    <div className="text-4xl md:text-5xl font-serif font-bold text-zinc-900 dark:text-white mb-2">{flight.departure.iataCode}</div>
                                    <div className="text-sm text-zinc-500 uppercase tracking-wider">{format(parseISO(flight.departure.at), "MMM d, HH:mm")}</div>
                                </div>

                                {/* Flight Path Visual */}
                                <div className="flex-1 px-8 flex flex-col items-center">
                                    <div className="flex items-center gap-4 w-full">
                                        <div className="h-[1px] flex-1 bg-zinc-300 dark:bg-zinc-700"></div>
                                        <Plane className="rotate-90 text-[#C5A059] w-6 h-6" />
                                        <div className="h-[1px] flex-1 bg-zinc-300 dark:bg-zinc-700"></div>
                                    </div>
                                    <div className="mt-2 text-xs font-medium text-zinc-400 uppercase tracking-widest">
                                        {flight.duration.replace("PT", "").toLowerCase()}
                                    </div>
                                </div>

                                {/* Arrival */}
                                <div className="text-right">
                                    <div className="text-4xl md:text-5xl font-serif font-bold text-zinc-900 dark:text-white mb-2">{flight.arrival.iataCode}</div>
                                    <div className="text-sm text-zinc-500 uppercase tracking-wider">{format(parseISO(flight.arrival.at), "MMM d, HH:mm")}</div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-dashed border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                                <div className="flex gap-8">
                                    <div>
                                        <div className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Gate</div>
                                        <div className="font-mono text-lg font-bold">A12</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Boarding</div>
                                        <div className="font-mono text-lg font-bold">10:40</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Seat</div>
                                        <div className="font-mono text-lg font-bold">4A</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Perforated Divider */}
                        <div className="relative w-8 bg-[#F8F8F8] dark:bg-zinc-950 flex flex-col items-center justify-center">
                            <div className="absolute left-[-1px] top-0 bottom-0 border-l-2 border-dashed border-zinc-300 dark:border-zinc-800 h-full"></div>
                            {/* Semi Circles for aesthetics */}
                            <div className="absolute -top-3 w-6 h-6 bg-zinc-50 dark:bg-zinc-950 rounded-full"></div>
                            <div className="absolute -bottom-3 w-6 h-6 bg-zinc-50 dark:bg-zinc-950 rounded-full"></div>
                        </div>

                        {/* Ticket Stub / Price Action (Right) */}
                        <div className="w-full md:w-48 bg-[#F8F8F8] dark:bg-zinc-950 p-6 flex flex-col justify-between items-center border-l dark:border-l-zinc-800 md:border-l-0">
                            <div className="w-full text-center">
                                <div className="font-serif text-3xl font-bold text-zinc-900 dark:text-white mb-1">
                                    {flight.price.currency === "EUR" ? "€" : "$"}
                                    {flight.price.total}
                                </div>
                                <div className="text-[10px] uppercase tracking-widest text-zinc-400">Total Fare</div>
                            </div>

                            {/* Mock Barcode */}
                            <div className="w-full h-16 bg-zinc-900 dark:bg-zinc-200 opacity-10 my-4"
                                style={{ maskImage: 'repeating-linear-gradient(90deg, black, black 2px, transparent 2px, transparent 4px)' }}>
                            </div>

                            <Button className="w-full bg-[#C5A059] hover:bg-[#B08D4C] text-white rounded-none uppercase tracking-wider text-xs font-bold py-6">
                                Select <ArrowRight className="ml-2 w-3 h-3" />
                            </Button>
                        </div>

                    </div>
                </div>
            ))}
        </div>
    );
}
