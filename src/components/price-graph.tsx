"use client";

import * as React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { FlightOffer } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PriceGraphProps {
    flights: FlightOffer[];
}

export function PriceGraph({ flights }: PriceGraphProps) {
    const data = React.useMemo(() => {
        if (flights.length === 0) return [];

        const prices = flights.map((f) => parseFloat(f.price.total));
        const minPrice = Math.floor(Math.min(...prices));
        const maxPrice = Math.ceil(Math.max(...prices));

        // Create buckets
        const bucketCount = 20; // Number of bars
        const range = maxPrice - minPrice;
        const bucketSize = range / bucketCount || 100; // distinct bars even if range is 0

        const buckets = Array.from({ length: bucketCount }, (_, i) => {
            const start = minPrice + i * bucketSize;
            const end = start + bucketSize;
            return {
                name: `$${Math.floor(start)}`,
                fullRange: `$${Math.floor(start)} - $${Math.floor(end)}`,
                count: 0,
                priceStart: start,
                priceEnd: end,
            };
        });

        prices.forEach((price) => {
            const bucketIndex = Math.min(
                Math.floor((price - minPrice) / bucketSize),
                bucketCount - 1
            );
            if (buckets[bucketIndex]) {
                buckets[bucketIndex].count++;
            }
        });

        return buckets.filter(b => b.count > 0); // Optional: filter empty buckets? Or keep them for scale? Keeping empty buckets is better for distribution visualization.
        // Actually, let's keep all buckets for a proper histogram look.
        return buckets;
    }, [flights]);

    if (flights.length === 0) return null;

    return (
        <Card className="w-full border border-[#E5E5E5] bg-white rounded-sm overflow-hidden mb-6">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent"></div>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-light tracking-[0.2em] uppercase text-[#C5A059]">
                    Price Trend
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[200px] w-full pl-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <XAxis
                            dataKey="name"
                            stroke="#8C8C8C"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            interval="preserveStartEnd"
                            minTickGap={30}
                        />
                        <Tooltip
                            cursor={{ fill: '#F5F3EF' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-white border border-[#E5E5E5] p-2 rounded-sm">
                                            <p className="text-[#2C2C2C] font-medium text-xs font-serif">{data.fullRange}</p>
                                            <p className="text-[#C5A059] text-xs uppercase tracking-wider">{data.count} Flights</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill="#C5A059" fillOpacity={0.8} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
