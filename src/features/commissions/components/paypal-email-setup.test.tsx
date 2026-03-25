/**
 * Tests for PayPal Email Setup component
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import { PayPalEmailSetup } from './paypal-email-setup';
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
    getPayoutStatus: vi.fn(),
    savePayPalEmail: vi.fn(),
  },
}));

describe('PayPalEmailSetup', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <PayPalEmailSetup />
      </QueryClientProvider>
    );

  it('shows loading state while fetching status', () => {
    vi.mocked(commissionsApi.getPayoutStatus).mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getByText(/Verificando metodo de pago/i)).toBeInTheDocument();
  });

  it('shows email form when PayPal is not configured', async () => {
    vi.mocked(commissionsApi.getPayoutStatus).mockResolvedValue({
      hasAccount: false,
      paypalEmailConfigured: false,
      paypalEmail: null,
      onboardingCompleted: false,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Configura tu metodo de pago/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Guardar email de PayPal/i })).toBeInTheDocument();
    });
  });

  it('shows configured state when PayPal email is saved', async () => {
    vi.mocked(commissionsApi.getPayoutStatus).mockResolvedValue({
      hasAccount: true,
      paypalEmailConfigured: true,
      paypalEmail: 'user@example.com',
      onboardingCompleted: true,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Metodo de pago configurado/i)).toBeInTheDocument();
      expect(screen.getByText(/PayPal: user@example.com/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Cambiar email/i })).toBeInTheDocument();
    });
  });

  it('shows form again when "Cambiar email" is clicked', async () => {
    const user = userEvent.setup();

    vi.mocked(commissionsApi.getPayoutStatus).mockResolvedValue({
      hasAccount: true,
      paypalEmailConfigured: true,
      paypalEmail: 'user@example.com',
      onboardingCompleted: true,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Cambiar email/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Cambiar email/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Guardar email de PayPal/i })).toBeInTheDocument();
    });
  });

  it('validates email format before submitting', async () => {
    const user = userEvent.setup();

    vi.mocked(commissionsApi.getPayoutStatus).mockResolvedValue({
      hasAccount: false,
      paypalEmailConfigured: false,
      paypalEmail: null,
      onboardingCompleted: false,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Guardar email de PayPal/i })).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('tu@paypal.com');
    await user.type(input, 'not-an-email');

    await user.click(screen.getByRole('button', { name: /Guardar email de PayPal/i }));

    await waitFor(() => {
      expect(screen.getByText(/Ingresa un email de PayPal valido/i)).toBeInTheDocument();
    });

    expect(commissionsApi.savePayPalEmail).not.toHaveBeenCalled();
  });

  it('calls savePayPalEmail with correct payload on valid submit', async () => {
    const user = userEvent.setup();

    vi.mocked(commissionsApi.getPayoutStatus).mockResolvedValue({
      hasAccount: false,
      paypalEmailConfigured: false,
      paypalEmail: null,
      onboardingCompleted: false,
    });

    vi.mocked(commissionsApi.savePayPalEmail).mockResolvedValue({
      message: 'PayPal email saved successfully',
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Guardar email de PayPal/i })).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('tu@paypal.com');
    await user.type(input, 'affiliate@paypal.com');

    await user.click(screen.getByRole('button', { name: /Guardar email de PayPal/i }));

    await waitFor(() => {
      expect(commissionsApi.savePayPalEmail).toHaveBeenCalledWith({
        paypalEmail: 'affiliate@paypal.com',
      });
      expect(toast.success).toHaveBeenCalledWith('Email de PayPal guardado correctamente');
    });
  });

  it('shows error toast on API failure', async () => {
    const user = userEvent.setup();

    vi.mocked(commissionsApi.getPayoutStatus).mockResolvedValue({
      hasAccount: false,
      paypalEmailConfigured: false,
      paypalEmail: null,
      onboardingCompleted: false,
    });

    vi.mocked(commissionsApi.savePayPalEmail).mockRejectedValue(new Error('API Error'));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Guardar email de PayPal/i })).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('tu@paypal.com');
    await user.type(input, 'affiliate@paypal.com');

    await user.click(screen.getByRole('button', { name: /Guardar email de PayPal/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Error al guardar el email de PayPal. Por favor intenta de nuevo.'
      );
    });
  });

  it('shows payout schedule info', async () => {
    vi.mocked(commissionsApi.getPayoutStatus).mockResolvedValue({
      hasAccount: false,
      paypalEmailConfigured: false,
      paypalEmail: null,
      onboardingCompleted: false,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/dias 1 y 15 de cada mes/i)).toBeInTheDocument();
    });
  });
});
