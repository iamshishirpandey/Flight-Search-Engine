"use client";

import { FlightOffer } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plane } from "lucide-react";
import { format, parseISO } from "date-fns";

interface FlightResultsProps {
    flights: FlightOffer[];
    isLoading?: boolean;
}

export function FlightResults({ flights, isLoading }: FlightResultsProps) {
    if (isLoading) {
        return (
            <div className="space-y-6 w-full max-w-4xl mx-auto mt-12">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex flex-col md:flex-row bg-white rounded-sm overflow-hidden border border-[#E5E5E5] h-[200px] animate-pulse">
                        <div className="flex-1 p-8 flex flex-col justify-center gap-6">
                            <div className="flex justify-between">
                                <div className="h-4 w-24 bg-[#F5F3EF] rounded-sm"></div>
                                <div className="h-4 w-24 bg-[#F5F3EF] rounded-sm"></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="h-10 w-16 bg-[#F5F3EF] rounded-sm"></div>
                                <div className="flex-1 px-8">
                                    <div className="h-[1px] bg-[#E5E5E5] w-full"></div>
                                </div>
                                <div className="h-10 w-16 bg-[#F5F3EF] rounded-sm"></div>
                            </div>
                        </div>
                        <div className="w-48 bg-[#FAFAF8] p-6 flex flex-col justify-center items-center gap-4 border-l border-[#E5E5E5]">
                            <div className="h-8 w-24 bg-[#F5F3EF] rounded-sm"></div>
                            <div className="h-10 w-full bg-[#E5E5E5] rounded-sm"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (flights.length === 0) {
        return (
            <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 mx-auto border border-[#E5E5E5] flex items-center justify-center rounded-full mb-6 bg-[#FAFAF8]">
                    <Plane className="w-8 h-8 text-[#C5A059] opacity-50" />
                </div>
                <h3 className="font-serif text-2xl text-[#2C2C2C] mb-2">No Flights Found</h3>
                <p className="text-[#8C8C8C] uppercase tracking-widest text-xs">Try adjusting your filters or search dates</p>
                <div className="w-24 h-[1px] bg-[#C5A059] mx-auto mt-8 opacity-30"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full max-w-4xl mx-auto mt-12">
            {flights.map((flight) => (
                <div key={flight.id} className="relative group perspective-1000">
                    {/* Ticket Container */}
                    <div
                        className="flex flex-col md:flex-row bg-white rounded-sm overflow-hidden border border-[#E5E5E5] hover-lift"
                        style={{ animationDelay: `${flights.indexOf(flight) * 100}ms` }}
                    >

                        {/* Main Ticket Section (Left) */}
                        <div className="flex-1 p-6 md:p-8 relative bg-white flex flex-col justify-center gap-8">
                            {/* Decorative Gold Line - Animated */}
                            <div className="absolute top-0 left-0 w-full h-[2px] animate-gradient-border"></div>

                            {flight.itineraries.map((itinerary, index) => {
                                const firstSegment = itinerary.segments[0];
                                const lastSegment = itinerary.segments[itinerary.segments.length - 1];
                                const isReturn = index > 0;

                                return (
                                    <div key={index} className={isReturn ? "pt-6 border-t border-dashed border-[#E5E5E5]" : ""}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="text-xs font-bold text-[#C5A059] tracking-[0.2em] uppercase mb-1">
                                                    {isReturn ? "Return" : "Outbound"}
                                                </div>
                                                <div className="font-serif text-xl font-bold flex items-center gap-2">
                                                    <Badge variant="outline" className="rounded-none border-[#C5A059] text-[#C5A059] font-normal px-2 py-0.5">
                                                        {flight.airline}
                                                    </Badge>
                                                    <span className="text-[#8C8C8C] text-sm tracking-wider">
                                                        {firstSegment.carrierCode} {firstSegment.number}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center relative gap-4">
                                            {/* Departure */}
                                            <div>
                                                <div className="text-3xl md:text-4xl font-serif font-bold text-[#2C2C2C] mb-1">
                                                    {firstSegment.departure.iataCode}
                                                </div>
                                                <div className="text-xs text-[#8C8C8C] uppercase tracking-wider">
                                                    {format(parseISO(firstSegment.departure.at), "MMM d, HH:mm")}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Flight Path Visual */}
                                        <div className="flex-1 flex flex-col items-center px-4">
                                            <div className="flex items-center gap-4 w-full">
                                                <div className="h-[1px] flex-1 bg-[#E5E5E5]"></div>
                                                <Plane className={`text-[#C5A059] w-5 h-5 transition-transform group-hover:scale-110 ${isReturn ? "-rotate-90" : "rotate-90"}`} />
                                                <div className="h-[1px] flex-1 bg-[#E5E5E5]"></div>
                                            </div>
                                            <div className="mt-1 text-[10px] font-medium text-[#ACACAC] uppercase tracking-widest text-center">
                                                {itinerary.duration.replace("PT", "").toLowerCase()}
                                                {itinerary.segments.length > 1 && ` • ${itinerary.segments.length - 1} Stop`}
                                            </div>
                                        </div>

                                        {/* Arrival */}
                                        <div className="text-right">
                                            <div className="text-3xl md:text-4xl font-serif font-bold text-[#2C2C2C] mb-1">
                                                {lastSegment.arrival.iataCode}
                                            </div>
                                            <div className="text-xs text-[#8C8C8C] uppercase tracking-wider">
                                                {format(parseISO(lastSegment.arrival.at), "MMM d, HH:mm")}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Perforated Divider */}
                        <div className="relative w-8 bg-[#FAFAF8] hidden md:flex flex-col items-center justify-center">
                            <div className="absolute left-[-1px] top-0 bottom-0 border-l-2 border-dashed border-[#E5E5E5] h-full"></div>
                            {/* Semi Circles for aesthetics */}
                            <div className="absolute -top-3 w-6 h-6 bg-[#FAFAF8] rounded-full"></div>
                            <div className="absolute -bottom-3 w-6 h-6 bg-[#FAFAF8] rounded-full"></div>
                        </div>

                        {/* Ticket Stub / Price Action (Right) */}
                        <div className="w-full md:w-48 bg-[#FAFAF8] p-6 flex flex-col justify-between items-center md:border-l-0">
                            <div className="w-full text-center">
                                <div className="font-serif text-3xl font-bold text-[#2C2C2C] mb-1">
                                    {flight.price.currency === "EUR" ? "€" : "$"}
                                    {flight.price.total}
                                </div>
                                <div className="text-[10px] uppercase tracking-widest text-[#ACACAC]">Total Fare</div>
                            </div>

                            {/* Mock Barcode */}
                            <div className="w-full h-16 bg-[#C5A059] opacity-10 mt-4"
                                style={{ maskImage: 'repeating-linear-gradient(90deg, black, black 2px, transparent 2px, transparent 4px)' }}>
                            </div>
                        </div>

                    </div>
                </div>
            ))}
        </div>
    );
}
