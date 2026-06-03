import { apiClient } from '@/lib/api/client';

/**
 * Calendar API — host-managed blocked dates per property.
 * Returns flat string arrays of YYYY-MM-DD dates (unlike the legacy
 * calendar-blocks endpoint which returns date range objects).
 */
export const calendarApi = {
  /**
   * Get blocked dates for a property in a date range (public — shown in booking calendar).
   * Returns an array of YYYY-MM-DD strings.
   */
  async getBlockedDates(propertyId: string, from: string, to: string): Promise<string[]> {
    const { data } = await apiClient.get<string[]>(
      `/api/v1/properties/${propertyId}/calendar`,
      { params: { from, to } }
    );
    return data;
  },

  /**
   * Block a list of dates for a property (HOST only).
   */
  async blockDates(propertyId: string, dates: string[]): Promise<void> {
    await apiClient.post(`/api/v1/properties/${propertyId}/calendar`, { dates });
  },

  /**
   * Unblock a single date for a property (HOST only).
   */
  async unblockDate(propertyId: string, date: string): Promise<void> {
    await apiClient.delete(`/api/v1/properties/${propertyId}/calendar/${date}`);
  },
};
