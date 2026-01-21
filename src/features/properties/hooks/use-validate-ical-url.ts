/**
 * Hook to validate iCal URLs using the backend API
 */

'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

interface ValidateICalUrlRequest {
    icalUrl: string;
}

interface ValidateICalUrlResponse {
    valid: boolean;
    message: string;
}

/**
 * Hook to validate an iCal URL
 * 
 * @example
 * ```tsx
 * const { mutate: validateICalUrl, isPending, data } = useValidateICalUrl();
 * 
 * validateICalUrl({ icalUrl: 'https://...' });
 *  
 * ```
 */
export function useValidateICalUrl() {
    return useMutation<ValidateICalUrlResponse, Error, ValidateICalUrlRequest>({
        mutationFn: async (request) => {
            const { data } = await apiClient.post<ValidateICalUrlResponse>(
                '/api/properties/validate-ical',
                request
            );
            return data;
        },
    });
}
