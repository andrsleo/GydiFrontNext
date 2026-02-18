/**
 * Booking Filters Component
 *
 * Client component for filtering bookings by status and date range.
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FilterX } from 'lucide-react';
import type { BookingFilters as Filters, BookingStatus } from '../types';
import { BOOKING_STATUS_LABELS } from '../types';

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function BookingFilters({ filters, onChange }: Props) {
  const [localFilters, setLocalFilters] = useState<Filters>(filters);

  const handleStatusChange = (value: string) => {
    const newFilters = {
      ...localFilters,
      status: value === 'all' ? undefined : (value as BookingStatus),
    };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = {
      ...localFilters,
      startDate: e.target.value || undefined,
    };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = {
      ...localFilters,
      endDate: e.target.value || undefined,
    };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handleClearFilters = () => {
    const emptyFilters: Filters = {};
    setLocalFilters(emptyFilters);
    onChange(emptyFilters);
  };

  const hasActiveFilters =
    localFilters.status || localFilters.startDate || localFilters.endDate;

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="grid gap-4 md:grid-cols-4">
        {/* Status Filter */}
        <div className="space-y-2">
          <Label htmlFor="status">Estado</Label>
          <Select
            value={localFilters.status || 'all'}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {Object.entries(BOOKING_STATUS_LABELS).map(([status, label]) => (
                <SelectItem key={status} value={status}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Start Date Filter */}
        <div className="space-y-2">
          <Label htmlFor="startDate">Desde</Label>
          <Input
            id="startDate"
            type="date"
            value={localFilters.startDate || ''}
            onChange={handleStartDateChange}
          />
        </div>

        {/* End Date Filter */}
        <div className="space-y-2">
          <Label htmlFor="endDate">Hasta</Label>
          <Input
            id="endDate"
            type="date"
            value={localFilters.endDate || ''}
            onChange={handleEndDateChange}
          />
        </div>

        {/* Clear Filters Button */}
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
            className="w-full"
          >
            <FilterX className="mr-2 h-4 w-4" />
            Limpiar
          </Button>
        </div>
      </div>
    </div>
  );
}
