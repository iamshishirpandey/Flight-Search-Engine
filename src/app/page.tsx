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
      });
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
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      {/* Hero Section */}
      <div className="relative w-full min-h-[600px] bg-sky-900 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-blue-600 mix-blend-multiply opacity-20"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center opacity-50"></div>

        <div className="relative z-10 max-w-4xl space-y-8 w-full">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-7xl font-serif font-bold text-white tracking-tight drop-shadow-lg">
              Explore the World
            </h1>
            <p className="text-lg md:text-2xl text-zinc-100 drop-shadow-md font-light tracking-wide">
              Experience the art of travel.
            </p>
          </div>

          {/* Search Form Container - Centered in Hero */}
          <div className="w-full pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-16">
        {hasSearched ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">
              {flights.length > 0 ? `Found ${flights.length} flights` : "No flights found"}
            </h2>
            <FlightResults flights={flights} />
          </div>
        ) : (
          <div className="text-center mt-12 space-y-4 opacity-50">
            <div className="text-6xl">✈️</div>
            <p className="text-xl font-medium">Where will you go next?</p>
          </div>
        )}
      </div>
    </main>
  );
}
