'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { seasonsApi } from '../api/seasons.api';
import type { CreateSeasonDefinitionRequest, UpdateSeasonDefinitionRequest } from '../types';

export const seasonKeys = {
  all: ['seasons'] as const,
  list: () => [...seasonKeys.all, 'list'] as const,
  regions: () => [...seasonKeys.all, 'regions'] as const,
};

export function useSeasons() {
  return useQuery({
    queryKey: seasonKeys.list(),
    queryFn: () => seasonsApi.listAll(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSeasonRegions() {
  return useQuery({
    queryKey: seasonKeys.regions(),
    queryFn: () => seasonsApi.listRegions(),
    staleTime: 60 * 60 * 1000,
  });
}

export function useCreateSeason() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSeasonDefinitionRequest) => seasonsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: seasonKeys.list() });
      toast.success('Temporada creada');
    },
    onError: (error: any) => {
      toast.error('Error al crear temporada', {
        description: error?.response?.data?.message ?? 'Intenta de nuevo',
      });
    },
  });
}

/** Create multiple season records in one shot (used with multiselect form) */
export function useBatchCreateSeasons() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (records: CreateSeasonDefinitionRequest[]) =>
      Promise.all(records.map((r) => seasonsApi.create(r))),
    onSuccess: (_, records) => {
      queryClient.invalidateQueries({ queryKey: seasonKeys.list() });
      toast.success(
        records.length === 1
          ? 'Temporada creada'
          : `${records.length} temporadas creadas`
      );
    },
    onError: (error: any) => {
      toast.error('Error al crear temporadas', {
        description: error?.response?.data?.message ?? 'Intenta de nuevo',
      });
    },
  });
}

export function useUpdateSeason() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateSeasonDefinitionRequest }) =>
      seasonsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: seasonKeys.list() });
      toast.success('Temporada actualizada');
    },
    onError: (error: any) => {
      toast.error('Error al actualizar temporada', {
        description: error?.response?.data?.message ?? 'Intenta de nuevo',
      });
    },
  });
}

/** Delete all seasons in a group, then create new records (used for group edit) */
export function useBatchReplaceGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      deleteIds,
      create,
    }: {
      deleteIds: number[];
      create: CreateSeasonDefinitionRequest[];
    }) => {
      await Promise.all(deleteIds.map((id) => seasonsApi.delete(id)));
      return Promise.all(create.map((r) => seasonsApi.create(r)));
    },
    onSuccess: (_, { create }) => {
      queryClient.invalidateQueries({ queryKey: seasonKeys.list() });
      toast.success(
        create.length === 1
          ? 'Temporada actualizada'
          : `${create.length} temporadas actualizadas`
      );
    },
    onError: (error: any) => {
      toast.error('Error al actualizar', {
        description: error?.response?.data?.message ?? 'Intenta de nuevo',
      });
    },
  });
}

export function useDeleteSeason() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => seasonsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: seasonKeys.list() });
      toast.success('Temporada eliminada');
    },
    onError: (error: any) => {
      toast.error('Error al eliminar temporada', {
        description: error?.response?.data?.message ?? 'Intenta de nuevo',
      });
    },
  });
}

/** Delete all seasons in a group at once */
export function useBatchDeleteSeasons() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => Promise.all(ids.map((id) => seasonsApi.delete(id))),
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: seasonKeys.list() });
      toast.success(
        ids.length === 1
          ? 'Temporada eliminada'
          : `${ids.length} temporadas eliminadas`
      );
    },
    onError: (error: any) => {
      toast.error('Error al eliminar', {
        description: error?.response?.data?.message ?? 'Intenta de nuevo',
      });
    },
  });
}
