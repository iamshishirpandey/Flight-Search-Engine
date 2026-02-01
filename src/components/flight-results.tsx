"use client";

import { FlightOffer } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";
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
        <div className="space-y-4 w-full max-w-4xl mx-auto mt-8">
            {flights.map((flight) => (
                <Card key={flight.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            {/* Airline & Route Info */}
                            <div className="flex-1 space-y-4 w-full">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="font-semibold">
                                        {flight.airline} {flight.flightNumber}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                        {format(parseISO(flight.departure.at), "EEE, MMM d")}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">{format(parseISO(flight.departure.at), "HH:mm")}</div>
                                        <div className="text-sm font-medium text-muted-foreground">{flight.departure.iataCode}</div>
                                    </div>

                                    <div className="flex-1 flex flex-col items-center px-4">
                                        <div className="text-xs text-muted-foreground flex items-center mb-1">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {flight.duration.replace("PT", "").toLowerCase()}
                                        </div>
                                        <div className="w-full h-[2px] bg-border relative">
                                            <div className="absolute right-0 -top-[3px] w-2 h-2 rounded-full bg-border" />
                                            <div className="absolute left-0 -top-[3px] w-2 h-2 rounded-full bg-border" />
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {flight.itineraries[0].segments.length > 1
                                                ? `${flight.itineraries[0].segments.length - 1} stop`
                                                : "Non-stop"}
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-2xl font-bold">{format(parseISO(flight.arrival.at), "HH:mm")}</div>
                                        <div className="text-sm font-medium text-muted-foreground">{flight.arrival.iataCode}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Price & Action */}
                            <div className="flex flex-col items-end gap-2 min-w-[120px]">
                                <div className="text-3xl font-bold text-blue-600">
                                    {flight.price.currency === "EUR" ? "€" : "$"}
                                    {flight.price.total}
                                </div>
                                <Button className="w-full">
                                    Select <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
