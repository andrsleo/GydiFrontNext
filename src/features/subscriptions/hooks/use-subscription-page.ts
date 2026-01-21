/**
 * Custom hook for subscription page state and logic
 */

'use client';

import { useState } from 'react';
import type { PaymentMethodResponse } from '../types';
import { useSubscription } from './use-subscription';
import { usePaymentMethods, useDeletePaymentMethod, useSetDefaultPaymentMethod } from './use-payment-methods';
import { usePlans } from './use-plans';

export function useSubscriptionPage() {
  const [dialogs, setDialogs] = useState({
    changePlan: false,
    cancel: false,
    addPayment: false,
    deletePayment: false,
  });

  const [methodToDelete, setMethodToDelete] = useState<PaymentMethodResponse | null>(null);
  const [methodIdToSetDefault, setMethodIdToSetDefault] = useState<number | null>(null);

  // Queries
  const {
    data: subscription,
    isLoading: subscriptionLoading,
    error: subscriptionError,
  } = useSubscription();

  const {
    data: paymentMethods,
    isLoading: paymentMethodsLoading,
  } = usePaymentMethods();

  const { data: plans } = usePlans();

  // Mutations
  const { mutate: deletePaymentMethod, isPending: isDeleting } = useDeletePaymentMethod();
  const { mutate: setDefaultPaymentMethod, isPending: isSettingDefault } = useSetDefaultPaymentMethod();

  // Dialog handlers
  const openDialog = (dialog: keyof typeof dialogs) => {
    setDialogs(prev => ({ ...prev, [dialog]: true }));
  };

  const closeDialog = (dialog: keyof typeof dialogs) => {
    setDialogs(prev => ({ ...prev, [dialog]: false }));
  };

  // Payment method handlers
  const handleDeleteClick = (id: number) => {
    const method = paymentMethods?.find((pm) => pm.id === id);
    if (method) {
      setMethodToDelete(method);
      openDialog('deletePayment');
    }
  };

  const handleConfirmDelete = () => {
    if (methodToDelete) {
      deletePaymentMethod(methodToDelete.id, {
        onSuccess: () => {
          closeDialog('deletePayment');
          setMethodToDelete(null);
        },
      });
    }
  };

  const handleSetDefault = (id: number) => {
    setMethodIdToSetDefault(id);
    setDefaultPaymentMethod(id, {
      onSettled: () => {
        setMethodIdToSetDefault(null);
      },
    });
  };

  return {
    // State
    dialogs,
    methodToDelete,
    methodIdToSetDefault,

    // Data
    subscription,
    subscriptionLoading,
    subscriptionError,
    paymentMethods,
    paymentMethodsLoading,
    plans,

    // Mutation states
    isDeleting,
    isSettingDefault,

    // Handlers
    openDialog,
    closeDialog,
    handleDeleteClick,
    handleConfirmDelete,
    handleSetDefault,
  };
}
