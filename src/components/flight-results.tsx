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
                        <div className="flex-1 p-6 md:p-8 relative bg-white dark:bg-zinc-900 flex flex-col justify-center gap-8">
                            {/* Decorative Gold Line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-[#C5A059]"></div>

                            {flight.itineraries.map((itinerary, index) => {
                                const firstSegment = itinerary.segments[0];
                                const lastSegment = itinerary.segments[itinerary.segments.length - 1];
                                const isReturn = index > 0;

                                return (
                                    <div key={index} className={isReturn ? "pt-6 border-t border-dashed border-zinc-200 dark:border-zinc-800" : ""}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="text-xs font-bold text-[#C5A059] tracking-[0.2em] uppercase mb-1">
                                                    {isReturn ? "Return" : "Outbound"}
                                                </div>
                                                <div className="font-serif text-xl font-bold flex items-center gap-2">
                                                    <Badge variant="outline" className="rounded-none border-[#C5A059] text-[#C5A059] font-normal px-2 py-0.5">
                                                        {flight.airline}
                                                    </Badge>
                                                    <span className="text-zinc-600 dark:text-zinc-400 text-sm tracking-wider">
                                                        {firstSegment.carrierCode} {firstSegment.number}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center relative gap-4">
                                            {/* Departure */}
                                            <div>
                                                <div className="text-3xl md:text-4xl font-serif font-bold text-zinc-900 dark:text-white mb-1">
                                                    {firstSegment.departure.iataCode}
                                                </div>
                                                <div className="text-xs text-zinc-500 uppercase tracking-wider">
                                                    {format(parseISO(firstSegment.departure.at), "MMM d, HH:mm")}
                                                </div>
                                            </div>

                                            {/* Flight Path Visual */}
                                            <div className="flex-1 flex flex-col items-center px-4">
                                                <div className="flex items-center gap-4 w-full">
                                                    <div className="h-[1px] flex-1 bg-zinc-300 dark:bg-zinc-700"></div>
                                                    <Plane className={`text-[#C5A059] w-5 h-5 ${isReturn ? "-rotate-90" : "rotate-90"}`} />
                                                    <div className="h-[1px] flex-1 bg-zinc-300 dark:bg-zinc-700"></div>
                                                </div>
                                                <div className="mt-1 text-[10px] font-medium text-zinc-400 uppercase tracking-widest text-center">
                                                    {itinerary.duration.replace("PT", "").toLowerCase()}
                                                    {itinerary.segments.length > 1 && ` • ${itinerary.segments.length - 1} Stop`}
                                                </div>
                                            </div>

                                            {/* Arrival */}
                                            <div className="text-right">
                                                <div className="text-3xl md:text-4xl font-serif font-bold text-zinc-900 dark:text-white mb-1">
                                                    {lastSegment.arrival.iataCode}
                                                </div>
                                                <div className="text-xs text-zinc-500 uppercase tracking-wider">
                                                    {format(parseISO(lastSegment.arrival.at), "MMM d, HH:mm")}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
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
