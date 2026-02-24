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
    code: 'AL',
    name: 'Albania',
    cities: ['Tirana', 'Durrës', 'Vlorë', 'Shkodër', 'Gjirokastër', 'Sarandë'],
  },
  {
    code: 'DZ',
    name: 'Algeria',
    cities: ['Algiers', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Tlemcen'],
  },
  {
    code: 'AO',
    name: 'Angola',
    cities: ['Luanda', 'Huambo', 'Lubango', 'Malanje', 'Benguela', 'Lobito'],
  },
  {
    code: 'AR',
    name: 'Argentina',
    cities: [
      'Buenos Aires',
      'Córdoba',
      'Rosario',
      'Mendoza',
      'Mar del Plata',
      'Bariloche',
      'Salta',
      'Tucumán',
      'Ushuaia',
      'Iguazú',
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
    code: 'AT',
    name: 'Austria',
    cities: ['Vienna', 'Salzburg', 'Innsbruck', 'Graz', 'Linz', 'Hallstatt', 'Kitzbühel'],
  },
  {
    code: 'AZ',
    name: 'Azerbaijan',
    cities: ['Baku', 'Ganja', 'Sumqayit', 'Mingachevir', 'Nakhchivan'],
  },
  {
    code: 'BS',
    name: 'Bahamas',
    cities: ['Nassau', 'Freeport', 'Paradise Island', 'Exuma', 'Harbour Island'],
  },
  {
    code: 'BH',
    name: 'Bahrain',
    cities: ['Manama', 'Riffa', 'Muharraq', 'Hamad Town', 'Isa Town'],
  },
  {
    code: 'BD',
    name: 'Bangladesh',
    cities: ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', "Cox's Bazar"],
  },
  {
    code: 'BB',
    name: 'Barbados',
    cities: ['Bridgetown', 'Holetown', 'Oistins', 'Speightstown', 'Bathsheba'],
  },
  {
    code: 'BY',
    name: 'Belarus',
    cities: ['Minsk', 'Gomel', 'Brest', 'Vitebsk', 'Grodno', 'Mogilev'],
  },
  {
    code: 'BE',
    name: 'Belgium',
    cities: ['Brussels', 'Bruges', 'Ghent', 'Antwerp', 'Liège', 'Leuven'],
  },
  {
    code: 'BZ',
    name: 'Belize',
    cities: ['Belize City', 'Belmopan', 'San Ignacio', 'Placencia', 'Ambergris Caye'],
  },
  {
    code: 'BO',
    name: 'Bolivia',
    cities: ['La Paz', 'Santa Cruz', 'Cochabamba', 'Sucre', 'Oruro', 'Potosí', 'Uyuni'],
  },
  {
    code: 'BA',
    name: 'Bosnia and Herzegovina',
    cities: ['Sarajevo', 'Banja Luka', 'Mostar', 'Tuzla', 'Zenica'],
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
    code: 'BG',
    name: 'Bulgaria',
    cities: ['Sofia', 'Plovdiv', 'Varna', 'Burgas', 'Ruse', 'Nessebar'],
  },
  {
    code: 'KH',
    name: 'Cambodia',
    cities: ['Phnom Penh', 'Siem Reap', 'Sihanoukville', 'Battambang', 'Kampot'],
  },
  {
    code: 'CM',
    name: 'Cameroon',
    cities: ['Yaoundé', 'Douala', 'Garoua', 'Bafoussam', 'Bamenda'],
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
      'Banff',
    ],
  },
  {
    code: 'CL',
    name: 'Chile',
    cities: ['Santiago', 'Valparaíso', 'Viña del Mar', 'Concepción', 'Punta Arenas', 'San Pedro de Atacama', 'Puerto Natales'],
  },
  {
    code: 'CN',
    name: 'China',
    cities: [
      'Beijing',
      'Shanghai',
      'Guangzhou',
      'Shenzhen',
      'Chengdu',
      "Xi'an",
      'Hangzhou',
      'Guilin',
      'Chongqing',
      'Lijiang',
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
    code: 'CR',
    name: 'Costa Rica',
    cities: ['San José', 'Liberia', 'Puerto Viejo', 'La Fortuna', 'Manuel Antonio', 'Tamarindo', 'Quepos'],
  },
  {
    code: 'HR',
    name: 'Croatia',
    cities: ['Zagreb', 'Dubrovnik', 'Split', 'Pula', 'Zadar', 'Hvar', 'Šibenik'],
  },
  {
    code: 'CU',
    name: 'Cuba',
    cities: ['Havana', 'Trinidad', 'Varadero', 'Santiago de Cuba', 'Cienfuegos', 'Viñales'],
  },
  {
    code: 'CY',
    name: 'Cyprus',
    cities: ['Nicosia', 'Limassol', 'Paphos', 'Larnaca', 'Famagusta', 'Ayia Napa'],
  },
  {
    code: 'CZ',
    name: 'Czech Republic',
    cities: ['Prague', 'Brno', 'Ostrava', 'Plzeň', 'Český Krumlov', 'Karlovy Vary'],
  },
  {
    code: 'CD',
    name: 'Democratic Republic of the Congo',
    cities: ['Kinshasa', 'Lubumbashi', 'Mbuji-Mayi', 'Kisangani', 'Bukavu'],
  },
  {
    code: 'DK',
    name: 'Denmark',
    cities: ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Billund', 'Elsinore'],
  },
  {
    code: 'DO',
    name: 'Dominican Republic',
    cities: ['Santo Domingo', 'Punta Cana', 'Santiago', 'Puerto Plata', 'La Romana', 'Samaná'],
  },
  {
    code: 'EC',
    name: 'Ecuador',
    cities: ['Quito', 'Guayaquil', 'Cuenca', 'Manta', 'Baños', 'Otavalo', 'Galápagos'],
  },
  {
    code: 'EG',
    name: 'Egypt',
    cities: ['Cairo', 'Alexandria', 'Luxor', 'Aswan', 'Hurghada', 'Sharm el-Sheikh', 'Giza'],
  },
  {
    code: 'SV',
    name: 'El Salvador',
    cities: ['San Salvador', 'Santa Ana', 'San Miguel', 'El Tunco', 'El Zonte'],
  },
  {
    code: 'EE',
    name: 'Estonia',
    cities: ['Tallinn', 'Tartu', 'Narva', 'Pärnu', 'Rakvere'],
  },
  {
    code: 'ET',
    name: 'Ethiopia',
    cities: ['Addis Ababa', 'Dire Dawa', 'Gondar', 'Hawassa', 'Bahir Dar', 'Lalibela'],
  },
  {
    code: 'FJ',
    name: 'Fiji',
    cities: ['Suva', 'Nadi', 'Lautoka', 'Savusavu', 'Taveuni'],
  },
  {
    code: 'FI',
    name: 'Finland',
    cities: ['Helsinki', 'Tampere', 'Turku', 'Oulu', 'Rovaniemi', 'Lapland'],
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
      'Provence',
    ],
  },
  {
    code: 'GE',
    name: 'Georgia',
    cities: ['Tbilisi', 'Batumi', 'Kutaisi', 'Sighnaghi', 'Mtskheta', 'Kazbegi'],
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
      'Nuremberg',
    ],
  },
  {
    code: 'GH',
    name: 'Ghana',
    cities: ['Accra', 'Kumasi', 'Tamale', 'Cape Coast', 'Takoradi'],
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
    code: 'GT',
    name: 'Guatemala',
    cities: ['Guatemala City', 'Antigua', 'Flores', 'Lake Atitlán', 'Quetzaltenango'],
  },
  {
    code: 'HT',
    name: 'Haiti',
    cities: ['Port-au-Prince', 'Cap-Haïtien', 'Jacmel', 'Les Cayes', 'Gonaïves'],
  },
  {
    code: 'HN',
    name: 'Honduras',
    cities: ['Tegucigalpa', 'San Pedro Sula', 'Roatán', 'La Ceiba', 'Copán'],
  },
  {
    code: 'HK',
    name: 'Hong Kong',
    cities: ['Central', 'Kowloon', 'Mong Kok', 'Causeway Bay', 'Tsim Sha Tsui', 'Lantau Island'],
  },
  {
    code: 'HU',
    name: 'Hungary',
    cities: ['Budapest', 'Debrecen', 'Pécs', 'Győr', 'Miskolc', 'Eger', 'Keszthely'],
  },
  {
    code: 'IS',
    name: 'Iceland',
    cities: ['Reykjavik', 'Akureyri', 'Keflavik', 'Selfoss', 'Höfn', 'Vík'],
  },
  {
    code: 'IN',
    name: 'India',
    cities: [
      'Mumbai',
      'Delhi',
      'Bangalore',
      'Goa',
      'Jaipur',
      'Agra',
      'Chennai',
      'Kolkata',
      'Kerala',
      'Udaipur',
      'Varanasi',
    ],
  },
  {
    code: 'ID',
    name: 'Indonesia',
    cities: [
      'Bali',
      'Jakarta',
      'Yogyakarta',
      'Lombok',
      'Surabaya',
      'Bandung',
      'Raja Ampat',
      'Labuan Bajo',
    ],
  },
  {
    code: 'IR',
    name: 'Iran',
    cities: ['Tehran', 'Isfahan', 'Shiraz', 'Mashhad', 'Tabriz', 'Yazd'],
  },
  {
    code: 'IQ',
    name: 'Iraq',
    cities: ['Baghdad', 'Erbil', 'Basra', 'Mosul', 'Sulaymaniyah', 'Najaf'],
  },
  {
    code: 'IE',
    name: 'Ireland',
    cities: ['Dublin', 'Cork', 'Galway', 'Limerick', 'Killarney', 'Dingle', 'Kilkenny'],
  },
  {
    code: 'IL',
    name: 'Israel',
    cities: ['Tel Aviv', 'Jerusalem', 'Haifa', 'Eilat', 'Herzliya', 'Nazareth', 'Dead Sea'],
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
      'Sicily',
      'Sardinia',
    ],
  },
  {
    code: 'CI',
    name: 'Ivory Coast',
    cities: ['Abidjan', 'Yamoussoukro', 'Bouaké', 'Daloa', 'San-Pédro'],
  },
  {
    code: 'JM',
    name: 'Jamaica',
    cities: ['Kingston', 'Montego Bay', 'Negril', 'Ocho Rios', 'Port Antonio', 'Falmouth'],
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
    code: 'JO',
    name: 'Jordan',
    cities: ['Amman', 'Petra', 'Aqaba', 'Wadi Rum', 'Jerash', 'Dead Sea'],
  },
  {
    code: 'KZ',
    name: 'Kazakhstan',
    cities: ['Almaty', 'Astana', 'Shymkent', 'Aktobe', 'Karaganda'],
  },
  {
    code: 'KE',
    name: 'Kenya',
    cities: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Diani Beach', 'Masai Mara'],
  },
  {
    code: 'XK',
    name: 'Kosovo',
    cities: ['Pristina', 'Prizren', 'Peja', 'Gjilan', 'Mitrovica'],
  },
  {
    code: 'KW',
    name: 'Kuwait',
    cities: ['Kuwait City', 'Hawalli', 'Salmiya', 'Fahaheel', 'Ahmadi'],
  },
  {
    code: 'KG',
    name: 'Kyrgyzstan',
    cities: ['Bishkek', 'Osh', 'Jalal-Abad', 'Karakol', 'Tokmok'],
  },
  {
    code: 'LA',
    name: 'Laos',
    cities: ['Vientiane', 'Luang Prabang', 'Pakse', 'Vang Vieng', 'Savannakhet'],
  },
  {
    code: 'LV',
    name: 'Latvia',
    cities: ['Riga', 'Daugavpils', 'Jūrmala', 'Liepāja', 'Sigulda'],
  },
  {
    code: 'LB',
    name: 'Lebanon',
    cities: ['Beirut', 'Byblos', 'Tripoli', 'Sidon', 'Baalbek', 'Faraya'],
  },
  {
    code: 'LY',
    name: 'Libya',
    cities: ['Tripoli', 'Benghazi', 'Misrata', 'Tobruk', 'Sabha'],
  },
  {
    code: 'LT',
    name: 'Lithuania',
    cities: ['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Trakai'],
  },
  {
    code: 'LU',
    name: 'Luxembourg',
    cities: ['Luxembourg City', 'Esch-sur-Alzette', 'Differdange', 'Dudelange', 'Vianden'],
  },
  {
    code: 'MO',
    name: 'Macao',
    cities: ['Macao Peninsula', 'Taipa', 'Cotai', 'Coloane'],
  },
  {
    code: 'MG',
    name: 'Madagascar',
    cities: ['Antananarivo', 'Toamasina', 'Nosy Be', 'Mahajanga', 'Antsirabe'],
  },
  {
    code: 'MY',
    name: 'Malaysia',
    cities: [
      'Kuala Lumpur',
      'Penang',
      'Langkawi',
      'Kota Kinabalu',
      'Malacca',
      'Johor Bahru',
      'Kuching',
    ],
  },
  {
    code: 'MT',
    name: 'Malta',
    cities: ["Valletta", "Sliema", "St. Julian's", 'Gozo', 'Mdina', 'Marsaskala'],
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
    code: 'MD',
    name: 'Moldova',
    cities: ['Chișinău', 'Bălți', 'Bender', 'Rîbnița', 'Cahul'],
  },
  {
    code: 'MN',
    name: 'Mongolia',
    cities: ['Ulaanbaatar', 'Darkhan', 'Erdenet', 'Kharakhorum', 'Gobi Desert'],
  },
  {
    code: 'ME',
    name: 'Montenegro',
    cities: ['Podgorica', 'Kotor', 'Budva', 'Bar', 'Herceg Novi', 'Tivat'],
  },
  {
    code: 'MA',
    name: 'Morocco',
    cities: [
      'Marrakech',
      'Casablanca',
      'Fès',
      'Chefchaouen',
      'Agadir',
      'Rabat',
      'Tangier',
      'Essaouira',
    ],
  },
  {
    code: 'MZ',
    name: 'Mozambique',
    cities: ['Maputo', 'Beira', 'Pemba', 'Nampula', 'Vilanculos', 'Bazaruto'],
  },
  {
    code: 'MM',
    name: 'Myanmar',
    cities: ['Yangon', 'Mandalay', 'Bagan', 'Inle Lake', 'Ngapali', 'Naypyidaw'],
  },
  {
    code: 'NP',
    name: 'Nepal',
    cities: ['Kathmandu', 'Pokhara', 'Chitwan', 'Lumbini', 'Nagarkot', 'Bhaktapur'],
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
    code: 'NI',
    name: 'Nicaragua',
    cities: ['Managua', 'Granada', 'León', 'San Juan del Sur', 'Ometepe'],
  },
  {
    code: 'NG',
    name: 'Nigeria',
    cities: ['Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt', 'Enugu'],
  },
  {
    code: 'KP',
    name: 'North Korea',
    cities: ['Pyongyang', 'Rason', 'Wonsan', 'Kaesong'],
  },
  {
    code: 'MK',
    name: 'North Macedonia',
    cities: ['Skopje', 'Ohrid', 'Bitola', 'Tetovo', 'Strumica'],
  },
  {
    code: 'NO',
    name: 'Norway',
    cities: ['Oslo', 'Bergen', 'Tromsø', 'Stavanger', 'Trondheim', 'Ålesund', 'Flåm'],
  },
  {
    code: 'OM',
    name: 'Oman',
    cities: ['Muscat', 'Salalah', 'Nizwa', 'Sur', 'Khasab', 'Wahiba Sands'],
  },
  {
    code: 'PK',
    name: 'Pakistan',
    cities: ['Karachi', 'Lahore', 'Islamabad', 'Peshawar', 'Quetta', 'Multan', 'Hunza'],
  },
  {
    code: 'PA',
    name: 'Panama',
    cities: ['Panama City', 'Bocas del Toro', 'Boquete', 'Colón', 'Santa Catalina'],
  },
  {
    code: 'PG',
    name: 'Papua New Guinea',
    cities: ['Port Moresby', 'Lae', 'Mount Hagen', 'Madang', 'Goroka'],
  },
  {
    code: 'PY',
    name: 'Paraguay',
    cities: ['Asunción', 'Ciudad del Este', 'San Lorenzo', 'Encarnación', 'Luque'],
  },
  {
    code: 'PE',
    name: 'Peru',
    cities: [
      'Lima',
      'Cusco',
      'Machu Picchu',
      'Arequipa',
      'Trujillo',
      'Iquitos',
      'Puno',
      'Huaraz',
    ],
  },
  {
    code: 'PH',
    name: 'Philippines',
    cities: [
      'Manila',
      'Cebu',
      'Boracay',
      'Palawan',
      'Davao',
      'Siargao',
      'Bohol',
      'Batangas',
    ],
  },
  {
    code: 'PL',
    name: 'Poland',
    cities: ['Warsaw', 'Kraków', 'Gdańsk', 'Wrocław', 'Poznań', 'Zakopane', 'Lublin'],
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
    code: 'PR',
    name: 'Puerto Rico',
    cities: ['San Juan', 'Ponce', 'Rincón', 'Vieques', 'Culebra', 'Fajardo'],
  },
  {
    code: 'QA',
    name: 'Qatar',
    cities: ['Doha', 'Al Wakrah', 'Al Khor', 'Lusail', 'Dukhan'],
  },
  {
    code: 'RO',
    name: 'Romania',
    cities: ['Bucharest', 'Cluj-Napoca', 'Timișoara', 'Brașov', 'Sibiu', 'Constanța', 'Sinaia'],
  },
  {
    code: 'RU',
    name: 'Russia',
    cities: [
      'Moscow',
      'Saint Petersburg',
      'Sochi',
      'Kazan',
      'Novosibirsk',
      'Ekaterinburg',
      'Lake Baikal',
    ],
  },
  {
    code: 'RW',
    name: 'Rwanda',
    cities: ['Kigali', 'Gisenyi', 'Butare', 'Musanze', 'Nyungwe'],
  },
  {
    code: 'WS',
    name: 'Samoa',
    cities: ['Apia', 'Salelologa', 'Lalomanu', "Savai'i"],
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    cities: ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Al Khobar', 'NEOM', 'AlUla'],
  },
  {
    code: 'SN',
    name: 'Senegal',
    cities: ['Dakar', 'Saint-Louis', 'Ziguinchor', 'Saly', 'Touba'],
  },
  {
    code: 'RS',
    name: 'Serbia',
    cities: ['Belgrade', 'Novi Sad', 'Niš', 'Kragujevac', 'Zlatibor', 'Kopaonik'],
  },
  {
    code: 'SG',
    name: 'Singapore',
    cities: ['Orchard Road', 'Marina Bay', 'Sentosa', 'Little India', 'Chinatown', 'Clarke Quay'],
  },
  {
    code: 'SK',
    name: 'Slovakia',
    cities: ['Bratislava', 'Košice', 'Banská Bystrica', 'Tatras', 'Bardejov'],
  },
  {
    code: 'SI',
    name: 'Slovenia',
    cities: ['Ljubljana', 'Bled', 'Piran', 'Maribor', 'Kranjska Gora', 'Bohinj'],
  },
  {
    code: 'ZA',
    name: 'South Africa',
    cities: [
      'Cape Town',
      'Johannesburg',
      'Durban',
      'Pretoria',
      'Stellenbosch',
      'Kruger Park',
      'Garden Route',
    ],
  },
  {
    code: 'KR',
    name: 'South Korea',
    cities: ['Seoul', 'Busan', 'Jeju', 'Incheon', 'Gyeongju', 'Gangwon', 'Suwon'],
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
      'Tenerife',
      'Lanzarote',
    ],
  },
  {
    code: 'LK',
    name: 'Sri Lanka',
    cities: ['Colombo', 'Kandy', 'Galle', 'Sigiriya', 'Nuwara Eliya', 'Trincomalee'],
  },
  {
    code: 'SE',
    name: 'Sweden',
    cities: ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Kiruna', 'Visby', 'Abisko'],
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
    code: 'SY',
    name: 'Syria',
    cities: ['Damascus', 'Aleppo', 'Latakia', 'Homs', 'Palmyra'],
  },
  {
    code: 'TW',
    name: 'Taiwan',
    cities: ['Taipei', 'Kaohsiung', 'Taichung', 'Tainan', 'Hualien', 'Kenting'],
  },
  {
    code: 'TJ',
    name: 'Tajikistan',
    cities: ['Dushanbe', 'Khujand', 'Kulob', 'Qurghonteppa', 'Iskanderkul'],
  },
  {
    code: 'TZ',
    name: 'Tanzania',
    cities: ['Dar es Salaam', 'Zanzibar', 'Arusha', 'Serengeti', 'Kilimanjaro', 'Stone Town'],
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
    code: 'TL',
    name: 'Timor-Leste',
    cities: ['Dili', 'Baucau', 'Maliana', 'Suai'],
  },
  {
    code: 'TO',
    name: 'Tonga',
    cities: ["Nuku'alofa", "Vava'u", "Ha'apai", 'Niuas'],
  },
  {
    code: 'TT',
    name: 'Trinidad and Tobago',
    cities: ['Port of Spain', 'San Fernando', 'Tobago', 'Chaguanas', 'Arima'],
  },
  {
    code: 'TN',
    name: 'Tunisia',
    cities: ['Tunis', 'Hammamet', 'Sousse', 'Djerba', 'Sfax', 'Carthage'],
  },
  {
    code: 'TR',
    name: 'Turkey',
    cities: [
      'Istanbul',
      'Ankara',
      'Cappadocia',
      'Antalya',
      'Bodrum',
      'Izmir',
      'Pamukkale',
      'Marmaris',
    ],
  },
  {
    code: 'TM',
    name: 'Turkmenistan',
    cities: ['Ashgabat', 'Turkmenbashi', 'Merv', 'Dashoguz'],
  },
  {
    code: 'UG',
    name: 'Uganda',
    cities: ['Kampala', 'Entebbe', 'Jinja', 'Fort Portal', 'Bwindi'],
  },
  {
    code: 'UA',
    name: 'Ukraine',
    cities: ['Kyiv', 'Lviv', 'Odessa', 'Kharkiv', 'Dnipro', 'Bukovel'],
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
  {
    code: 'GB',
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
      'New Orleans',
      'Honolulu',
    ],
  },
  {
    code: 'UY',
    name: 'Uruguay',
    cities: ['Montevideo', 'Punta del Este', 'Colonia del Sacramento', 'Salto', 'Maldonado'],
  },
  {
    code: 'UZ',
    name: 'Uzbekistan',
    cities: ['Tashkent', 'Samarkand', 'Bukhara', 'Khiva', 'Namangan'],
  },
  {
    code: 'VE',
    name: 'Venezuela',
    cities: ['Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Mérida', 'Los Roques'],
  },
  {
    code: 'VN',
    name: 'Vietnam',
    cities: [
      'Hanoi',
      'Ho Chi Minh City',
      'Hoi An',
      'Da Nang',
      'Ha Long Bay',
      'Nha Trang',
      'Hue',
      'Phu Quoc',
    ],
  },
  {
    code: 'YE',
    name: 'Yemen',
    cities: ["Sana'a", 'Aden', 'Taiz', 'Hodeidah', 'Socotra'],
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
