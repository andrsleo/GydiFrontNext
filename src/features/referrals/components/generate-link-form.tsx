/**
 * GenerateLinkForm - Form to create a new referral link
 */
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Info } from 'lucide-react';
import { createReferralLinkFormSchema, type GenerateReferralLinkFormData } from '../schemas';
import { useGenerateReferralLink } from '../hooks';

interface GenerateLinkFormProps {
  properties: Array<{ id: string; title: string }>;
  userPlan?: 'FREE' | 'PRO' | 'ELITE';
  onSuccess?: () => void;
}

export function GenerateLinkForm({ properties, userPlan = 'FREE', onSuccess }: GenerateLinkFormProps) {
  const generateLink = useGenerateReferralLink();

  const expirationDays = {
    FREE: 30,
    PRO: 90,
    ELITE: 365,
  }[userPlan];

  const form = useForm<GenerateReferralLinkFormData>({
    resolver: zodResolver(createReferralLinkFormSchema),
    defaultValues: {
      propertyId: '',
    },
  });

  const onSubmit = async (data: GenerateReferralLinkFormData) => {
    try {
      // SECURITY: affiliateId extracted from JWT on server-side
      // Expiration is calculated automatically by backend based on user plan
      await generateLink.mutateAsync({
        propertyId: data.propertyId,
      });

      form.reset();
      onSuccess?.();
    } catch (error) {
      // Error is handled by the mutation
      console.error('Generate link error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Link Duration</AlertTitle>
          <AlertDescription>
            Your <strong>{userPlan}</strong> plan links last <strong>{expirationDays} days</strong>.
            {userPlan === 'FREE' && ' Upgrade to PRO for 90-day links or ELITE for 1-year links.'}
            {userPlan === 'PRO' && ' Upgrade to ELITE for 1-year links.'}
          </AlertDescription>
        </Alert>

        <FormField
          control={form.control}
          name="propertyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a property" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the property you want to promote
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={generateLink.isPending}
        >
          {generateLink.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Generate Referral Link
        </Button>
      </form>
    </Form>
  );
}