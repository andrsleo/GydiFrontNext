import { apiClient } from '@/lib/api/client';
import type {
  CalendarMonthResponse,
  PriceBreakdownResponse,
  SeasonPricingResponse,
  SeasonDefinitionDto,
  BlockDatesPayload,
  SetCustomPricePayload,
  UpdateSeasonPricingPayload,
} from '../types';

export const calendarApi = {
  getMonth: async (
    propertyId: number,
    year: number,
    month: number,
  ): Promise<CalendarMonthResponse> => {
    const { data } = await apiClient.get<CalendarMonthResponse>(
      `/api/v1/properties/${propertyId}/calendar?year=${year}&month=${month}`,
    );
    return data;
  },

  blockDates: async (propertyId: number, payload: BlockDatesPayload): Promise<void> => {
    await apiClient.post(`/api/v1/properties/${propertyId}/calendar/block`, payload);
  },

  unblockDate: async (propertyId: number, date: string): Promise<void> => {
    await apiClient.delete(`/api/v1/properties/${propertyId}/calendar/block?date=${date}`);
  },

  setCustomPrice: async (propertyId: number, payload: SetCustomPricePayload): Promise<void> => {
    await apiClient.post(`/api/v1/properties/${propertyId}/calendar/price`, payload);
  },

  removeCustomPrice: async (propertyId: number, date: string): Promise<void> => {
    await apiClient.delete(`/api/v1/properties/${propertyId}/calendar/price?date=${date}`);
  },

  getPriceRange: async (
    propertyId: number,
    checkIn: string,
    checkOut: string,
  ): Promise<PriceBreakdownResponse> => {
    const { data } = await apiClient.get<PriceBreakdownResponse>(
      `/api/v1/properties/${propertyId}/calendar/price-range?checkIn=${checkIn}&checkOut=${checkOut}`,
    );
    return data;
  },

  getSeasonPricing: async (propertyId: number): Promise<SeasonPricingResponse> => {
    const { data } = await apiClient.get<SeasonPricingResponse>(
      `/api/v1/properties/${propertyId}/season-pricing`,
    );
    return data;
  },

  updateSeasonPricing: async (
    propertyId: number,
    payload: UpdateSeasonPricingPayload,
  ): Promise<SeasonPricingResponse> => {
    const { data } = await apiClient.put<SeasonPricingResponse>(
      `/api/v1/properties/${propertyId}/season-pricing`,
      payload,
    );
    return data;
  },

  getSeasonsByCountry: async (country: string): Promise<SeasonDefinitionDto[]> => {
    const { data } = await apiClient.get<SeasonDefinitionDto[]>(
      `/api/v1/seasons?country=${encodeURIComponent(country)}`,
    );
    return data;
  },
};