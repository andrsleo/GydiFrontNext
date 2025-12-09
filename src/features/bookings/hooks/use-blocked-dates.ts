'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';


interface CalendarBlock {
    startDate: string; // ISO date string
    endDate: string;   // ISO date string
    source: string;    // AIRBNB, MANUAL, etc.
}

export function useBlockedDates(propertyId: string) {
    return useQuery({
        queryKey: ['property-calendar-blocks', propertyId],
        queryFn: async () => {
            const response = await apiClient.get<CalendarBlock[]>(
                `/api/properties/${propertyId}/calendar-blocks`
            );
            return response.data;
        },
        enabled: !!propertyId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
