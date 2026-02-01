export interface FlightOffer {
    id: string;
    airline: string;
    flightNumber: string;
    departure: {
        iataCode: string;
        at: string; // ISO date string
    };
    arrival: {
        iataCode: string;
        at: string; // ISO date string
    };
    duration: string;
    price: {
        currency: string;
        total: string;
    };
    itineraries: {
        duration: string;
        segments: {
            departure: { iataCode: string; at: string };
            arrival: { iataCode: string; at: string };
            carrierCode: string;
            number: string;
            duration: string;
        }[];
    }[];
}

export interface SearchParams {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    adults?: number;
    travelClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
}
