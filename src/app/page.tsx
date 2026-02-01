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

      if (data.data) {
        setFlights(data.data);
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
      <div className="relative w-full h-[500px] bg-sky-900 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-blue-600 mix-blend-multiply opacity-20"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center opacity-50"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-md">
            Explore the World
          </h1>
          <p className="text-lg md:text-xl text-zinc-100 drop-shadow-sm">
            Find the best flight deals for your next adventure.
          </p>
        </div>

        {/* Search Form Container - Overlapping the Hero */}
        <div className="absolute -bottom-24 w-full px-4">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </div>

      {/* Results Section */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 pt-32 pb-16">
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
