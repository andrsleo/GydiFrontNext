/**
 * Countries and Cities Data
 * Popular tourist destinations for vacation rentals
 */

export interface Country {
  code: string;
  name: string;
  cities: string[];
}

export const COUNTRIES_CITIES: Country[] = [
  {
    code: 'US',
    name: 'United States',
    cities: [
      'New York',
      'Los Angeles',
      'Miami',
      'Las Vegas',
      'San Francisco',
      'Orlando',
      'Chicago',
      'Boston',
      'Seattle',
      'San Diego',
      'Austin',
      'Nashville',
    ],
  },
  {
    code: 'MX',
    name: 'Mexico',
    cities: [
      'Cancún',
      'Playa del Carmen',
      'Tulum',
      'Ciudad de México',
      'Guadalajara',
      'Monterrey',
      'Puerto Vallarta',
      'Los Cabos',
      'Oaxaca',
      'Mérida',
      'Mazatlán',
    ],
  },
  {
    code: 'ES',
    name: 'Spain',
    cities: [
      'Madrid',
      'Barcelona',
      'Valencia',
      'Sevilla',
      'Málaga',
      'Bilbao',
      'Granada',
      'Ibiza',
      'Palma de Mallorca',
      'San Sebastián',
    ],
  },
  {
    code: 'FR',
    name: 'France',
    cities: [
      'Paris',
      'Nice',
      'Lyon',
      'Marseille',
      'Bordeaux',
      'Cannes',
      'Monaco',
      'Toulouse',
      'Strasbourg',
      'Nantes',
    ],
  },
  {
    code: 'IT',
    name: 'Italy',
    cities: [
      'Rome',
      'Milan',
      'Venice',
      'Florence',
      'Naples',
      'Turin',
      'Bologna',
      'Verona',
      'Pisa',
      'Amalfi',
    ],
  },
  {
    code: 'UK',
    name: 'United Kingdom',
    cities: [
      'London',
      'Manchester',
      'Edinburgh',
      'Birmingham',
      'Liverpool',
      'Glasgow',
      'Oxford',
      'Cambridge',
      'Brighton',
      'Bath',
    ],
  },
  {
    code: 'CA',
    name: 'Canada',
    cities: [
      'Toronto',
      'Vancouver',
      'Montreal',
      'Calgary',
      'Ottawa',
      'Edmonton',
      'Quebec City',
      'Winnipeg',
      'Victoria',
      'Halifax',
    ],
  },
  {
    code: 'BR',
    name: 'Brazil',
    cities: [
      'Rio de Janeiro',
      'São Paulo',
      'Salvador',
      'Brasília',
      'Fortaleza',
      'Recife',
      'Florianópolis',
      'Curitiba',
      'Porto Alegre',
      'Manaus',
    ],
  },
  {
    code: 'AR',
    name: 'Argentina',
    cities: [
      'Buenos Aires',
      'Córdoba',
      'Rosario',
      'Mendoza',
      'Bariloche',
      'Salta',
      'Mar del Plata',
      'Ushuaia',
      'Iguazú',
    ],
  },
  {
    code: 'CO',
    name: 'Colombia',
    cities: [
      'Bogotá',
      'Medellín',
      'Cartagena',
      'Cali',
      'Barranquilla',
      'Santa Marta',
      'Pereira',
      'San Andrés',
      'Bucaramanga',
    ],
  },
  {
    code: 'JP',
    name: 'Japan',
    cities: [
      'Tokyo',
      'Osaka',
      'Kyoto',
      'Hiroshima',
      'Yokohama',
      'Sapporo',
      'Fukuoka',
      'Nagoya',
      'Kobe',
      'Nara',
    ],
  },
  {
    code: 'TH',
    name: 'Thailand',
    cities: [
      'Bangkok',
      'Phuket',
      'Chiang Mai',
      'Pattaya',
      'Krabi',
      'Koh Samui',
      'Hua Hin',
      'Ayutthaya',
      'Chiang Rai',
    ],
  },
  {
    code: 'GR',
    name: 'Greece',
    cities: [
      'Athens',
      'Santorini',
      'Mykonos',
      'Thessaloniki',
      'Crete',
      'Rhodes',
      'Corfu',
      'Zakynthos',
      'Paros',
    ],
  },
  {
    code: 'PT',
    name: 'Portugal',
    cities: [
      'Lisbon',
      'Porto',
      'Algarve',
      'Madeira',
      'Coimbra',
      'Braga',
      'Évora',
      'Sintra',
      'Cascais',
    ],
  },
  {
    code: 'AU',
    name: 'Australia',
    cities: [
      'Sydney',
      'Melbourne',
      'Brisbane',
      'Perth',
      'Adelaide',
      'Gold Coast',
      'Cairns',
      'Darwin',
      'Hobart',
    ],
  },
  {
    code: 'NZ',
    name: 'New Zealand',
    cities: [
      'Auckland',
      'Wellington',
      'Christchurch',
      'Queenstown',
      'Rotorua',
      'Dunedin',
      'Taupo',
      'Nelson',
    ],
  },
  {
    code: 'DE',
    name: 'Germany',
    cities: [
      'Berlin',
      'Munich',
      'Frankfurt',
      'Hamburg',
      'Cologne',
      'Stuttgart',
      'Dresden',
      'Leipzig',
      'Heidelberg',
    ],
  },
  {
    code: 'NL',
    name: 'Netherlands',
    cities: [
      'Amsterdam',
      'Rotterdam',
      'The Hague',
      'Utrecht',
      'Eindhoven',
      'Groningen',
      'Maastricht',
      'Leiden',
    ],
  },
  {
    code: 'CH',
    name: 'Switzerland',
    cities: [
      'Zurich',
      'Geneva',
      'Basel',
      'Bern',
      'Lucerne',
      'Lausanne',
      'Interlaken',
      'Zermatt',
      'St. Moritz',
    ],
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    cities: [
      'Dubai',
      'Abu Dhabi',
      'Sharjah',
      'Ajman',
      'Ras Al Khaimah',
      'Fujairah',
      'Al Ain',
    ],
  },
];

/**
 * Get cities for a specific country
 */
export function getCitiesByCountry(countryName: string): string[] {
  const country = COUNTRIES_CITIES.find(
    (c) => c.name.toLowerCase() === countryName.toLowerCase()
  );
  return country?.cities || [];
}

/**
 * Get country by name
 */
export function getCountryByName(countryName: string): Country | undefined {
  return COUNTRIES_CITIES.find(
    (c) => c.name.toLowerCase() === countryName.toLowerCase()
  );
}

/**
 * Search countries by query
 */
export function searchCountries(query: string): Country[] {
  const lowerQuery = query.toLowerCase();
  return COUNTRIES_CITIES.filter((c) =>
    c.name.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Search cities within a country
 */
export function searchCities(countryName: string, query: string): string[] {
  const cities = getCitiesByCountry(countryName);
  const lowerQuery = query.toLowerCase();
  return cities.filter((city) => city.toLowerCase().includes(lowerQuery));
}