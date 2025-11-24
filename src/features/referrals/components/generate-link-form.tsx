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
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { createReferralLinkFormSchema, type GenerateReferralLinkFormData } from '../schemas';
import { useGenerateReferralLink } from '../hooks';

interface GenerateLinkFormProps {
  properties: Array<{ id: string; title: string }>;
  onSuccess?: () => void;
}

export function GenerateLinkForm({ properties, onSuccess }: GenerateLinkFormProps) {
  const generateLink = useGenerateReferralLink();

  const form = useForm<GenerateReferralLinkFormData>({
    resolver: zodResolver(createReferralLinkFormSchema),
    defaultValues: {
      propertyId: '',
      expirationDays: 90,
    },
  });

  const onSubmit = async (data: GenerateReferralLinkFormData) => {
    try {
      // SECURITY: affiliateId extracted from JWT on server-side
      await generateLink.mutateAsync({
        propertyId: data.propertyId,
        expirationDays: data.expirationDays,
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

        <FormField
          control={form.control}
          name="expirationDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiration (days)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={365}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Link will expire after this many days (1-365)
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