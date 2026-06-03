'use client';

import { Pencil, Trash2, Globe, MapPin, Flag, Map } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTranslation } from '@/hooks/use-translation';
import type { SeasonDefinitionDto, SeasonScope, SeasonType, GroupedSeason } from '../types';

// ─── Props ─────────────────────────────────────────────────────────────────────

interface SeasonTableProps {
  seasons: SeasonDefinitionDto[];
  onEdit: (group: GroupedSeason) => void;
  onDelete: (group: GroupedSeason) => void;
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<SeasonType, string> = {
  HIGH:   'bg-red-100 text-red-700 border-red-200',
  MEDIUM: 'bg-amber-100 text-amber-700 border-amber-200',
  LOW:    'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const SCOPE_ICONS: Record<SeasonScope, React.ReactNode> = {
  GLOBAL:    <Globe   className="h-3 w-3" />,
  REGION:    <Map     className="h-3 w-3" />,
  COUNTRY:   <Flag    className="h-3 w-3" />,
  SUBREGION: <MapPin  className="h-3 w-3" />,
};

// ─── Grouping ─────────────────────────────────────────────────────────────────

function seasonGroupKey(s: SeasonDefinitionDto): string {
  return `${s.name}|${s.seasonType}|${s.scope}|${s.startDate}|${s.endDate}|${s.recurrence}`;
}

function groupSeasons(seasons: SeasonDefinitionDto[]): GroupedSeason[] {
  const map: Record<string, GroupedSeason> = {};

  for (const s of seasons) {
    const key = seasonGroupKey(s);
    if (map[key]) {
      map[key].seasons.push(s);
    } else {
      map[key] = { key, representative: s, seasons: [s] };
    }
  }

  return Object.values(map);
}

// ─── Location helpers ─────────────────────────────────────────────────────────

function singleLocationLabel(s: SeasonDefinitionDto): string {
  if (s.scope === 'GLOBAL') return '—';
  if (s.scope === 'REGION') return s.regionCode ?? '—';
  if (s.scope === 'COUNTRY') return s.country ?? '—';
  return [s.country, s.region].filter(Boolean).join(' / ') || '—';
}

function LocationBadges({ group }: { group: GroupedSeason }) {
  const rep = group.representative;

  if (rep.scope === 'GLOBAL') {
    return <span className="text-muted-foreground text-sm">—</span>;
  }

  const labels = group.seasons.map(singleLocationLabel);
  const MAX_VISIBLE = 3;

  return (
    <div className="flex flex-wrap gap-1">
      {labels.slice(0, MAX_VISIBLE).map((label, i) => (
        <Badge key={i} variant="outline" className="text-xs font-normal">
          {label}
        </Badge>
      ))}
      {labels.length > MAX_VISIBLE && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="text-xs font-normal cursor-pointer">
              +{labels.length - MAX_VISIBLE}
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[200px] text-xs">
            {labels.slice(MAX_VISIBLE).join(', ')}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

// ─── Action buttons ───────────────────────────────────────────────────────────

function ActionButtons({
  group,
  onEdit,
  onDelete,
  editLabel,
  deleteLabel,
  editSystemLabel,
  deleteSystemLabel,
}: {
  group: GroupedSeason;
  onEdit: (g: GroupedSeason) => void;
  onDelete: (g: GroupedSeason) => void;
  editLabel: string;
  deleteLabel: string;
  editSystemLabel: string;
  deleteSystemLabel: string;
}) {
  const allSystem = group.seasons.every((s) => s.isSystem);

  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            disabled={allSystem}
            onClick={() => !allSystem && onEdit(group)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        {allSystem && <TooltipContent>{editSystemLabel}</TooltipContent>}
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-destructive hover:text-destructive"
            disabled={allSystem}
            onClick={() => !allSystem && onDelete(group)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        {allSystem && <TooltipContent>{deleteSystemLabel}</TooltipContent>}
      </Tooltip>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function SeasonTable({ seasons, onEdit, onDelete }: SeasonTableProps) {
  const { t } = useTranslation('seasons');
  const groups = groupSeasons(seasons);

  const editSystemLabel   = t('tooltip.editSystem');
  const deleteSystemLabel = t('tooltip.deleteSystem');

  return (
    <TooltipProvider>
      {/* Desktop table */}
      <div className="hidden md:block rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('table.name')}</TableHead>
              <TableHead>{t('table.type')}</TableHead>
              <TableHead>{t('table.scope')}</TableHead>
              <TableHead>{t('table.location')}</TableHead>
              <TableHead>{t('table.startDate')}</TableHead>
              <TableHead>{t('table.endDate')}</TableHead>
              <TableHead>{t('table.recurrence')}</TableHead>
              <TableHead className="w-[80px]">{t('table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group) => {
              const rep = group.representative;
              return (
                <TableRow key={group.key}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {rep.name}
                      {group.seasons.every((s) => s.isSystem) && (
                        <Badge variant="outline" className="text-xs shrink-0">
                          {t('badge.system')}
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={`text-xs border ${TYPE_COLORS[rep.seasonType]}`}
                      variant="outline"
                    >
                      {t(`type.${rep.seasonType}`)}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      {SCOPE_ICONS[rep.scope]}
                      {t(`scope.${rep.scope}`)}
                    </div>
                  </TableCell>

                  <TableCell>
                    <LocationBadges group={group} />
                  </TableCell>

                  <TableCell className="text-sm">{rep.startDate}</TableCell>
                  <TableCell className="text-sm">{rep.endDate}</TableCell>
                  <TableCell className="text-sm">{t(`recurrence.${rep.recurrence}`)}</TableCell>

                  <TableCell>
                    <ActionButtons
                      group={group}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      editLabel={t('form.titleEdit')}
                      deleteLabel={t('delete.confirm')}
                      editSystemLabel={editSystemLabel}
                      deleteSystemLabel={deleteSystemLabel}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {groups.map((group) => {
          const rep = group.representative;
          const allSystem = group.seasons.every((s) => s.isSystem);
          return (
            <div key={group.key} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-sm">{rep.name}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    {SCOPE_ICONS[rep.scope]}
                    <span>{t(`scope.${rep.scope}`)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-wrap justify-end">
                  {allSystem && (
                    <Badge variant="outline" className="text-xs">{t('badge.system')}</Badge>
                  )}
                  <Badge
                    className={`text-xs border ${TYPE_COLORS[rep.seasonType]}`}
                    variant="outline"
                  >
                    {t(`type.${rep.seasonType}`)}
                  </Badge>
                </div>
              </div>

              <LocationBadges group={group} />

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{rep.startDate} → {rep.endDate}</span>
                <span>{t(`recurrence.${rep.recurrence}`)}</span>
              </div>

              {!allSystem && (
                <div className="flex items-center gap-2 pt-1 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8 text-xs"
                    onClick={() => onEdit(group)}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    {t('form.titleEdit')}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8 text-xs text-destructive hover:text-destructive"
                    onClick={() => onDelete(group)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    {t('delete.confirm')}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
