'use client';

import { useState } from 'react';
import { Plus, CalendarRange } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import {
  useSeasons,
  useSeasonRegions,
  useBatchCreateSeasons,
  useBatchReplaceGroup,
  useBatchDeleteSeasons,
} from '@/features/seasons/hooks/use-seasons';
import { SeasonTable } from '@/features/seasons/components/SeasonTable';
import { SeasonFormModal } from '@/features/seasons/components/SeasonFormModal';
import { SeasonDeleteDialog } from '@/features/seasons/components/SeasonDeleteDialog';
import type {
  CreateSeasonDefinitionRequest,
  GroupedSeason,
} from '@/features/seasons/types';

export function SeasonsAdminClient() {
  const { t } = useTranslation('seasons');

  const { data: seasons = [], isLoading } = useSeasons();
  const { data: regions = [] }            = useSeasonRegions();

  const batchCreate  = useBatchCreateSeasons();
  const batchReplace = useBatchReplaceGroup();
  const batchDelete  = useBatchDeleteSeasons();

  const [formOpen, setFormOpen]         = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupedSeason | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<GroupedSeason | null>(null);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  function handleEdit(group: GroupedSeason) {
    setEditingGroup(group);
    setFormOpen(true);
  }

  function handleDelete(group: GroupedSeason) {
    setDeletingGroup(group);
  }

  function handleFormSubmit(records: CreateSeasonDefinitionRequest[]) {
    if (editingGroup) {
      // Delete previous non-system records → create new ones
      const deleteIds = editingGroup.seasons
        .filter((s) => !s.isSystem)
        .map((s) => s.id);

      batchReplace.mutate(
        { deleteIds, create: records },
        {
          onSuccess: () => {
            setFormOpen(false);
            setEditingGroup(null);
          },
        }
      );
    } else {
      batchCreate.mutate(records, {
        onSuccess: () => {
          setFormOpen(false);
        },
      });
    }
  }

  function handleConfirmDelete() {
    if (!deletingGroup) return;
    const ids = deletingGroup.seasons
      .filter((s) => !s.isSystem)
      .map((s) => s.id);

    batchDelete.mutate(ids, {
      onSuccess: () => setDeletingGroup(null),
    });
  }

  const isMutating =
    batchCreate.isPending || batchReplace.isPending;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <CalendarRange className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold font-heading">{t('page.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('page.subtitle')}</p>
          </div>
        </div>
        <Button
          onClick={() => {
            setEditingGroup(null);
            setFormOpen(true);
          }}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('page.newSeason')}
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
          {t('page.loading')}
        </div>
      ) : seasons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <CalendarRange className="h-12 w-12 text-muted-foreground/40" />
          <p className="font-medium">{t('page.empty')}</p>
          <p className="text-sm text-muted-foreground max-w-sm">{t('page.emptySubtitle')}</p>
          <Button
            variant="outline"
            onClick={() => {
              setEditingGroup(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('page.newSeason')}
          </Button>
        </div>
      ) : (
        <SeasonTable
          seasons={seasons}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Form modal */}
      <SeasonFormModal
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingGroup(null);
        }}
        editingGroup={editingGroup}
        regions={regions}
        onSubmit={handleFormSubmit}
        isPending={isMutating}
      />

      {/* Delete dialog */}
      <SeasonDeleteDialog
        open={!!deletingGroup}
        onOpenChange={(open) => !open && setDeletingGroup(null)}
        group={deletingGroup}
        onConfirm={handleConfirmDelete}
        isPending={batchDelete.isPending}
      />
    </div>
  );
}
