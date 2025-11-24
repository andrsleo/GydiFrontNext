'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// TODO: Move to a shared config or env var
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function ReferralRedirectPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = searchParams.get('r');

        if (!token) {
            setError('Invalid referral link: Missing token');
            return;
        }

        const resolveReferral = async () => {
            try {
                // Collect tracking info
                // Note: IP and User-Agent are usually handled by the backend from the request headers,
                // but we can send client-side info if needed.
                // For now, we rely on backend to extract IP/UA from the request.

                // Ensure we hit the correct endpoint version
                const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
                const response = await fetch(`${baseUrl}/api/v1/referrals/resolve`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: token,
                        // Optional: client-side fingerprinting could go here
                        referer: document.referrer,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Failed to resolve referral link');
                }

                const data = await response.json();

                if (data.destinationUrl) {
                    // Redirect to the property page
                    window.location.href = data.destinationUrl;
                } else {
                    throw new Error('Invalid response from server');
                }

            } catch (err) {
                console.error('Referral resolution error:', err);
                setError('This referral link is invalid or has expired.');
            }
        };

        resolveReferral();
    }, [searchParams, router]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <h1 className="text-xl font-bold text-red-600 mb-4">Error</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-800">Redirecting...</h2>
                <p className="text-gray-500 mt-2">Please wait while we take you to the property.</p>
            </div>
        </div>
    );
}
