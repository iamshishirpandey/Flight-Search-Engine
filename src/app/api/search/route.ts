import { NextRequest, NextResponse } from 'next/server';
import { FlightOffer } from '@/lib/types';

// Mock Data


let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

interface AmadeusSegment {
    departure: { iataCode: string; at: string };
    arrival: { iataCode: string; at: string };
    carrierCode: string;
    number: string;
    duration: string;
}

interface AmadeusItinerary {
    duration: string;
    segments: AmadeusSegment[];
}

interface AmadeusOffer {
    id: string;
    validatingAirlineCodes?: string[];
    price: { currency: string; total: string };
    itineraries: AmadeusItinerary[];
}

async function getAmadeusToken() {
    const clientId = process.env.NEXT_PUBLIC_AMADEUS_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_AMADEUS_CLIENT_SECRET;

    if (!clientId || !clientSecret || clientId.includes('REPLACE')) {
        console.error('Amadeus API credentials missing or invalid.');
        return null;
    }

    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
        return cachedToken;
    }

    try {
        console.log('Fetching Amadeus token...');
        const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: clientId,
                client_secret: clientSecret,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Amadeus Token Error:', response.status, data);
            return null;
        }

        if (data.access_token) {
            cachedToken = data.access_token;
            tokenExpiry = Date.now() + (data.expires_in * 1000);
            return cachedToken;
        }
    } catch (error) {
        console.error('Failed to fetch Amadeus token:', error);
    }
    return null;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const date = searchParams.get('date');
    const returnDate = searchParams.get('returnDate');
    const adults = searchParams.get('adults') || '1';
    const travelClass = searchParams.get('travelClass');

    if (!origin || !destination || !date) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const token = await getAmadeusToken();

    if (!token) {
        return NextResponse.json({ error: 'Failed to authenticate with Amadeus API' }, { status: 401 });
    }

    try {
        let amadeusUrl = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${date}&adults=${adults}&nonStop=false&max=10`;

        if (returnDate) {
            amadeusUrl += `&returnDate=${returnDate}`;
        }

        if (travelClass) {
            amadeusUrl += `&travelClass=${travelClass}`;
        }

        const response = await fetch(amadeusUrl, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        // Transform Amadeus response to our FlightOffer interface
        const amadeusData = data.data || [];
        const dictionaries = data.dictionaries || {};

        const flightOffers: FlightOffer[] = amadeusData.map((offer: AmadeusOffer) => {
            const firstItinerary = offer.itineraries[0];
            const firstSegment = firstItinerary.segments[0];
            const lastSegment = firstItinerary.segments[firstItinerary.segments.length - 1];

            const airlineCode = offer.validatingAirlineCodes?.[0];
            const airlineName = dictionaries.carriers?.[airlineCode || ''] || airlineCode;

            return {
                id: offer.id,
                airline: airlineName || 'Unknown Airline',
                flightNumber: `${firstSegment.carrierCode} ${firstSegment.number}`,
                departure: {
                    iataCode: firstSegment.departure.iataCode,
                    at: firstSegment.departure.at
                },
                arrival: {
                    iataCode: lastSegment.arrival.iataCode,
                    at: lastSegment.arrival.at
                },
                duration: firstItinerary.duration,
                price: {
                    currency: offer.price.currency,
                    total: offer.price.total
                },
                itineraries: offer.itineraries.map((itinerary: AmadeusItinerary) => ({
                    duration: itinerary.duration,
                    segments: itinerary.segments.map((segment: AmadeusSegment) => ({
                        departure: {
                            iataCode: segment.departure.iataCode,
                            at: segment.departure.at
                        },
                        arrival: {
                            iataCode: segment.arrival.iataCode,
                            at: segment.arrival.at
                        },
                        carrierCode: segment.carrierCode,
                        number: segment.number,
                        duration: segment.duration
                    }))
                }))
            };
        });

        return NextResponse.json(flightOffers);
    } catch (error) {
        console.error('Amadeus API call failed:', error);
        return NextResponse.json({ error: 'Failed to fetch flight offers' }, { status: 500 });
    }
}
