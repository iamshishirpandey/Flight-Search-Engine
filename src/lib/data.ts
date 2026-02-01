export interface Airport {
    code: string;
    city: string;
    name: string;
    country: string;
}

export const airports: Airport[] = [
    { code: "JFK", city: "New York", name: "John F. Kennedy International Airport", country: "USA" },
    { code: "LHR", city: "London", name: "Heathrow Airport", country: "UK" },
    { code: "DXB", city: "Dubai", name: "Dubai International Airport", country: "UAE" },
    { code: "SIN", city: "Singapore", name: "Changi Airport", country: "Singapore" },
    { code: "HND", city: "Tokyo", name: "Haneda Airport", country: "Japan" },
    { code: "NRT", city: "Tokyo", name: "Narita International Airport", country: "Japan" },
    { code: "CDG", city: "Paris", name: "Charles de Gaulle Airport", country: "France" },
    { code: "AMS", city: "Amsterdam", name: "Amsterdam Airport Schiphol", country: "Netherlands" },
    { code: "FRA", city: "Frankfurt", name: "Frankfurt Airport", country: "Germany" },
    { code: "IST", city: "Istanbul", name: "Istanbul Airport", country: "Turkey" },
    { code: "LAX", city: "Los Angeles", name: "Los Angeles International Airport", country: "USA" },
    { code: "SYD", city: "Sydney", name: "Kingsford Smith Airport", country: "Australia" },
    { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj International Airport", country: "India" },
    { code: "DEL", city: "Delhi", name: "Indira Gandhi International Airport", country: "India" },
    { code: "KTM", city: "Kathmandu", name: "Tribhuvan International Airport", country: "Nepal" },
    { code: "BKK", city: "Bangkok", name: "Suvarnabhumi Airport", country: "Thailand" },
    { code: "HKG", city: "Hong Kong", name: "Hong Kong International Airport", country: "Hong Kong" },
    { code: "SFO", city: "San Francisco", name: "San Francisco International Airport", country: "USA" },
];
