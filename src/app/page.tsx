"use client";

import * as React from "react";
import { SearchForm } from "@/components/search-form";
import { FlightResults } from "@/components/flight-results";
import { FlightOffer, SearchParams } from "@/lib/types";

export default function Home() {
  const [flights, setFlights] = React.useState<FlightOffer[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    setHasSearched(true);
    setFlights([]);

    try {
      const queryParams = new URLSearchParams({
        origin: params.origin,
        destination: params.destination,
        date: params.departureDate,
        adults: (params.adults || 1).toString(),
      });
      if (params.returnDate) queryParams.append("returnDate", params.returnDate);
      if (params.travelClass) queryParams.append("travelClass", params.travelClass);

      const response = await fetch(`/api/search?${queryParams.toString()}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setFlights(data);
      } else if (data.data && Array.isArray(data.data)) {
        // Fallback for mock data structure if ever used
        setFlights(data.data);
      } else {
        console.warn("Unexpected API response format:", data);
        setFlights([]);
      }
    } catch (error) {
      console.error("Failed to fetch flights:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAF8] flex flex-col">
      {/* Hero Section - Light Luxury */}
      <div className="relative w-full min-h-[650px] bg-gradient-to-b from-[#F5F3EF] to-[#FAFAF8] flex flex-col items-center justify-center p-8 text-center overflow-hidden">

        {/* Subtle Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C5A059' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>

        <div className="relative z-10 max-w-5xl space-y-8 w-full">
          {/* Logo/Brand Mark */}
          <div className="flex justify-center mb-2">
            <div className="w-14 h-14 border border-[#C5A059] flex items-center justify-center">
              <span className="text-[#C5A059] font-serif text-xl font-bold tracking-widest">S</span>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-serif font-light text-[#2C2C2C] tracking-tight">
              Spotter
            </h1>
            <p className="text-base md:text-lg text-[#8C8C8C] tracking-[0.25em] uppercase font-light">
              The Art of Private Aviation
            </p>
          </div>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#C5A059]/40"></div>
            <div className="w-1.5 h-1.5 rotate-45 bg-[#C5A059]"></div>
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#C5A059]/40"></div>
          </div>

          {/* Search Form Container */}
          <div className="w-full pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>
      </div>

      {/* Results Section - Light */}
      <div className="flex-1 w-full bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          {hasSearched ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-[1px] bg-[#C5A059]"></div>
                <h2 className="text-sm font-light tracking-[0.3em] uppercase text-[#2C2C2C]">
                  {flights.length > 0 ? `${flights.length} Flights Available` : "No Flights Found"}
                </h2>
                <div className="flex-1 h-[1px] bg-[#E5E5E5]"></div>
              </div>
              <FlightResults flights={flights} />
            </div>
          ) : (
            <div className="text-center mt-8 space-y-4">
              <div className="w-16 h-16 mx-auto border border-[#E5E5E5] flex items-center justify-center">
                <span className="text-3xl opacity-30">✈</span>
              </div>
              <p className="text-sm font-light tracking-widest uppercase text-[#8C8C8C]">
                Begin Your Journey
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
