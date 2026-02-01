import { NextRequest, NextResponse } from 'next/server';
import { FlightOffer } from '@/lib/types';

// Mock Data
const MOCK_FLIGHTS: FlightOffer[] = [
    {
        id: '1',
        airline: 'AA',
        flightNumber: '101',
        departure: { iataCode: 'JFK', at: '2024-06-01T10:00:00' },
        arrival: { iataCode: 'LHR', at: '2024-06-01T22:00:00' },
        duration: 'PT7H',
        price: { currency: 'USD', total: '500.00' },
        itineraries: [
            {
                duration: 'PT7H',
                segments: [
                    {
                        departure: { iataCode: 'JFK', at: '2024-06-01T10:00:00' },
                        arrival: { iataCode: 'LHR', at: '2024-06-01T22:00:00' },
                        carrierCode: 'AA',
                        number: '101',
                        duration: 'PT7H',
                    },
                ],
            },
        ],
    },
    {
        id: '2',
        airline: 'BA',
        flightNumber: '112',
        departure: { iataCode: 'JFK', at: '2024-06-01T18:00:00' },
        arrival: { iataCode: 'LHR', at: '2024-06-02T06:00:00' },
        duration: 'PT7H',
        price: { currency: 'USD', total: '620.00' },
        itineraries: [
            {
                duration: 'PT7H',
                segments: [
                    {
                        departure: { iataCode: 'JFK', at: '2024-06-01T18:00:00' },
                        arrival: { iataCode: 'LHR', at: '2024-06-02T06:00:00' },
                        carrierCode: 'BA',
                        number: '112',
                        duration: 'PT7H',
                    },
                ],
            },
        ],
    },
];

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

async function getAmadeusToken() {
    const clientId = process.env.NEXT_PUBLIC_AMADEUS_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_AMADEUS_CLIENT_SECRET;

    if (!clientId || !clientSecret || clientId.includes('REPLACE')) {
        console.warn('Amadeus API credentials missing or invalid. Using mock data.');
        return null;
    }

    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
        return cachedToken;
    }

    try {
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

    if (!origin || !destination || !date) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const token = await getAmadeusToken();

    if (!token) {
        // Return mock data if token fetch fails or no credentials
        return NextResponse.json({ data: MOCK_FLIGHTS });
    }

    try {
        const amadeusUrl = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${date}&adults=1&nonStop=false&max=10`;

        const response = await fetch(amadeusUrl, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        // Transform Amadeus response to our FlightOffer interface if needed
        // For now, we'll try to map it roughly or pass it through if it matches enough
        // Ideally validation/transformation happens here.

        return NextResponse.json(data);
    } catch (error) {
        console.error('Amadeus API call failed:', error);
        return NextResponse.json({ error: 'Failed to fetch flight offers' }, { status: 500 });
    }
}
