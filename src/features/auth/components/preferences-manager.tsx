'use client';

import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PreferencesManagerProps {
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
}

type PreferenceType = 'text' | 'number' | 'boolean';

interface PreferenceEntry {
  key: string;
  value: unknown;
  type: PreferenceType;
}

const COMMON_PREFERENCES = [
  { key: 'theme', label: 'Tema', type: 'text' as const, options: ['light', 'dark', 'auto'] },
  { key: 'currency', label: 'Moneda', type: 'text' as const, options: ['USD', 'MXN', 'EUR'] },
  { key: 'timezone', label: 'Zona Horaria', type: 'text' as const },
  { key: 'notifications_frequency', label: 'Frecuencia de Notificaciones', type: 'text' as const, options: ['instant', 'daily', 'weekly'] },
  { key: 'show_commission_earnings', label: 'Mostrar Ganancias de Comisión', type: 'boolean' as const },
  { key: 'auto_accept_referrals', label: 'Auto-aceptar Referidos', type: 'boolean' as const },
] as const;

export function PreferencesManager({ value, onChange }: PreferencesManagerProps) {
  const [preferences, setPreferences] = useState<Record<string, unknown>>(value || {});
  const [customKey, setCustomKey] = useState('');
  const [customValue, setCustomValue] = useState('');
  const [customType, setCustomType] = useState<PreferenceType>('text');

  useEffect(() => {
    setPreferences(value || {});
  }, [value]);

  const handleUpdate = (key: string, newValue: unknown) => {
    const newPreferences = { ...preferences, [key]: newValue };
    setPreferences(newPreferences);
    onChange(newPreferences);
  };

  const handleRemove = (key: string) => {
    const newPreferences = { ...preferences };
    delete newPreferences[key];
    setPreferences(newPreferences);
    onChange(newPreferences);
  };

  const handleAddCustom = () => {
    if (!customKey.trim()) return;

    let parsedValue: unknown = customValue;

    if (customType === 'number') {
      parsedValue = parseFloat(customValue) || 0;
    } else if (customType === 'boolean') {
      parsedValue = customValue.toLowerCase() === 'true';
    }

    const newPreferences = { ...preferences, [customKey]: parsedValue };
    setPreferences(newPreferences);
    onChange(newPreferences);

    // Reset form
    setCustomKey('');
    setCustomValue('');
    setCustomType('text');
  };

  const getPreferenceType = (value: unknown): PreferenceType => {
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    return 'text';
  };

  const renderPreferenceInput = (key: string, value: unknown, type: PreferenceType) => {
    const commonPref = COMMON_PREFERENCES.find((p) => p.key === key);

    if (type === 'boolean') {
      return (
        <Select
          value={String(value)}
          onValueChange={(val) => handleUpdate(key, val === 'true')}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Sí</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    if (commonPref && 'options' in commonPref && commonPref.options) {
      return (
        <Select value={String(value)} onValueChange={(val) => handleUpdate(key, val)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {commonPref.options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (type === 'number') {
      return (
        <Input
          type="number"
          value={String(value)}
          onChange={(e) => handleUpdate(key, parseFloat(e.target.value) || 0)}
        />
      );
    }

    return (
      <Input
        type="text"
        value={String(value)}
        onChange={(e) => handleUpdate(key, e.target.value)}
      />
    );
  };

  return (
    <div className="space-y-4">
      <Label>Preferencias del Usuario</Label>

      {/* Common Preferences */}
      <div className="space-y-3">
        {COMMON_PREFERENCES.map((pref) => {
          const currentValue = preferences[pref.key];
          const isSet = currentValue !== undefined;

          if (!isSet) {
            return (
              <div key={pref.key} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{pref.label}</p>
                  <p className="text-sm text-muted-foreground">No configurado</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const defaultValue =
                      pref.type === 'boolean' ? false : ('options' in pref && pref.options?.[0]) || '';
                    handleUpdate(pref.key, defaultValue);
                  }}
                >
                  Configurar
                </Button>
              </div>
            );
          }

          return (
            <div key={pref.key} className="flex items-center gap-2">
              <div className="w-[200px]">
                <Label className="text-sm">{pref.label}</Label>
              </div>

              <div className="flex-1">
                {renderPreferenceInput(pref.key, currentValue, pref.type)}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(pref.key)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>

      {/* Custom Preferences */}
      <div className="space-y-3 pt-4">
        <Label className="text-sm font-semibold">Preferencias Personalizadas</Label>

        {Object.entries(preferences)
          .filter(([key]) => !COMMON_PREFERENCES.some((p) => p.key === key))
          .map(([key, value]) => {
            const type = getPreferenceType(value);

            return (
              <div key={key} className="flex items-center gap-2">
                <div className="w-[200px]">
                  <Label className="text-sm">{key}</Label>
                </div>

                <div className="flex-1">
                  {renderPreferenceInput(key, value, type)}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(key)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          })}

        {/* Add Custom Preference Form */}
        <div className="flex items-end gap-2 rounded-lg border p-3">
          <div className="flex-1 space-y-2">
            <Label className="text-xs">Clave</Label>
            <Input
              type="text"
              placeholder="nombre_preferencia"
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
            />
          </div>

          <div className="flex-1 space-y-2">
            <Label className="text-xs">Valor</Label>
            <Input
              type="text"
              placeholder="valor"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
            />
          </div>

          <div className="w-[120px] space-y-2">
            <Label className="text-xs">Tipo</Label>
            <Select value={customType} onValueChange={(val) => setCustomType(val as PreferenceType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Texto</SelectItem>
                <SelectItem value="number">Número</SelectItem>
                <SelectItem value="boolean">Booleano</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleAddCustom}
            disabled={!customKey.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
