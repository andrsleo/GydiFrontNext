/**
 * Tests for Affiliate Connect Onboarding Modal
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AffiliateConnectOnboardingModal } from './affiliate-connect-onboarding-modal';
import { commissionsApi } from '../api/commissions.api';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('../api/commissions.api', () => ({
  commissionsApi: {
    initiateAffiliateOnboarding: vi.fn(),
    getConnectAccountStatus: vi.fn(),
  },
}));

// Mock window.location.href
delete (window as any).location;
window.location = { href: '' } as any;

describe('AffiliateConnectOnboardingModal', () => {
  let queryClient: QueryClient;
  const mockOnClose = vi.fn();

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    vi.clearAllMocks();

    // Default mock: account not yet onboarded
    vi.mocked(commissionsApi.getConnectAccountStatus).mockResolvedValue({
      hasAccount: false,
      onboardingCompleted: false,
      payoutsEnabled: false,
      verificationStatus: 'unverified',
      stripeAccountId: null,
    });
  });

  const renderModal = (open = true) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AffiliateConnectOnboardingModal open={open} onClose={mockOnClose} />
      </QueryClientProvider>
    );
  };

  it('renders modal when open is true', () => {
    renderModal(true);

    expect(screen.getByText('Conecta tu cuenta bancaria')).toBeInTheDocument();
    expect(
      screen.getByText(/Para recibir pagos de comisiones/i)
    ).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    renderModal(false);

    expect(screen.queryByText('Conecta tu cuenta bancaria')).not.toBeInTheDocument();
  });

  it('shows "Conectar cuenta bancaria" button', async () => {
    renderModal();

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /conectar cuenta bancaria/i });
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });
  });

  it('disables button and shows loading text during pending state', async () => {
    const user = userEvent.setup();

    // Mock slow API call
    vi.mocked(commissionsApi.initiateAffiliateOnboarding).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () =>
              resolve({
                url: 'https://connect.stripe.com/onboarding/123',
                stripeAccountId: 'acct_123',
                expiresAt: '2025-01-01T00:00:00Z',
              }),
            1000
          );
        })
    );

    renderModal();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /conectar cuenta bancaria/i })).toBeInTheDocument();
    });

    const button = screen.getByRole('button', { name: /conectar cuenta bancaria/i });
    await user.click(button);

    // Check loading state
    await waitFor(() => {
      expect(screen.getByText('Conectando...')).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  });

  it('calls mutation and redirects to Stripe URL on success', async () => {
    const user = userEvent.setup();
    const mockUrl = 'https://connect.stripe.com/onboarding/123';

    vi.mocked(commissionsApi.initiateAffiliateOnboarding).mockResolvedValue({
      url: mockUrl,
      stripeAccountId: 'acct_123',
      expiresAt: '2025-01-01T00:00:00Z',
    });

    renderModal();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /conectar cuenta bancaria/i })).toBeInTheDocument();
    });

    const button = screen.getByRole('button', { name: /conectar cuenta bancaria/i });
    await user.click(button);

    await waitFor(() => {
      expect(commissionsApi.initiateAffiliateOnboarding).toHaveBeenCalledTimes(1);
      expect(window.location.href).toBe(mockUrl);
    });
  });

  it('shows error toast on API failure', async () => {
    const user = userEvent.setup();

    vi.mocked(commissionsApi.initiateAffiliateOnboarding).mockRejectedValue(
      new Error('API Error')
    );

    renderModal();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /conectar cuenta bancaria/i })).toBeInTheDocument();
    });

    const button = screen.getByRole('button', { name: /conectar cuenta bancaria/i });
    await user.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Error al iniciar onboarding. Por favor intenta de nuevo.'
      );
    });
  });

  it('shows message if user is already onboarded', async () => {
    // Mock: user already onboarded
    vi.mocked(commissionsApi.getConnectAccountStatus).mockResolvedValue({
      hasAccount: true,
      onboardingCompleted: true,
      payoutsEnabled: true,
      verificationStatus: 'verified',
      stripeAccountId: 'acct_123',
    });

    renderModal();

    await waitFor(() => {
      expect(
        screen.getByText(/Ya completaste el proceso de onboarding/i)
      ).toBeInTheDocument();
    });

    // Connect button should not be visible
    expect(
      screen.queryByRole('button', { name: /conectar cuenta bancaria/i })
    ).not.toBeInTheDocument();
  });

  it('displays required information alert', () => {
    renderModal();

    expect(screen.getByText(/Información requerida:/i)).toBeInTheDocument();
    expect(screen.getByText(/SSN\/Tax ID, routing number/i)).toBeInTheDocument();
  });

  it('displays payout schedule information', () => {
    renderModal();

    expect(screen.getByText(/Calendario de pagos/i)).toBeInTheDocument();
    expect(screen.getByText('1 y 15')).toBeInTheDocument();
    expect(screen.getByText('$50 USD')).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', async () => {
    const user = userEvent.setup();

    renderModal();

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes', () => {
    renderModal();

    // Dialog should have proper role
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // Title should be accessible
    const title = screen.getByText('Conecta tu cuenta bancaria');
    expect(title).toBeInTheDocument();
  });
});
