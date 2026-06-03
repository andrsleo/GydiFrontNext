export interface CalendarDayDto {
  date: string;
  status: 'AVAILABLE' | 'BLOCKED' | 'RESERVED' | 'MAINTENANCE';
  effectivePrice: number | null;
  effectivePriceCurrency: string | null;
  priceSource: 'BASE' | 'SEASON_HIGH' | 'SEASON_MEDIUM' | 'SEASON_LOW' | 'CUSTOM' | null;
  customPrice: number | null;
  blockSource: 'MANUAL' | 'BOOKING' | 'MAINTENANCE' | 'SYSTEM' | null;
  bookingId: number | null;
}

export interface MoneyDto {
  amount: number;
  currency: string;
}

export interface SeasonPricingDto {
  high: number;
  medium: number;
  low: number;
}

export interface CalendarMonthResponse {
  propertyId: number;
  year: number;
  month: number;
  basePrice: MoneyDto;
  seasonPricing: SeasonPricingDto;
  days: CalendarDayDto[];
}

export interface PriceBreakdownResponse {
  checkIn: string;
  checkOut: string;
  nights: DayPriceDto[];
  total: MoneyDto;
}

export interface DayPriceDto {
  date: string;
  price: MoneyDto;
  priceSource: string;
  status: string;
}

export interface SeasonPricingResponse {
  propertyId: number;
  highMultiplier: number;
  mediumMultiplier: number;
  lowMultiplier: number;
}

export interface SeasonDefinitionDto {
  id: number;
  name: string;
  seasonType: 'HIGH' | 'MEDIUM' | 'LOW';
  country: string;
  region: string | null;
  startDate: string;
  endDate: string;
  recurrence: 'NONE' | 'YEARLY';
  isSystem: boolean;
}

export interface BlockDatesPayload {
  dates: string[];
  notes?: string;
}

export interface SetCustomPricePayload {
  date: string;
  amount: number;
  currency: string;
}

export interface UpdateSeasonPricingPayload {
  highMultiplier: number;
  mediumMultiplier: number;
  lowMultiplier: number;
}