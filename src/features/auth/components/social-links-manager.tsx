'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Github, Linkedin, Twitter, Facebook, Instagram, Globe } from 'lucide-react';
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

interface SocialLinksManagerProps {
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
}

const SOCIAL_PLATFORMS = [
  { value: 'github', label: 'GitHub', icon: Github },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'twitter', label: 'Twitter/X', icon: Twitter },
  { value: 'facebook', label: 'Facebook', icon: Facebook },
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'website', label: 'Sitio Web', icon: Globe },
] as const;

export function SocialLinksManager({ value, onChange }: SocialLinksManagerProps) {
  const [links, setLinks] = useState<Record<string, string>>(value || {});

  useEffect(() => {
    setLinks(value || {});
  }, [value]);

  const handleAdd = () => {
    const newLinks = { ...links, '': '' };
    setLinks(newLinks);
  };

  const handleRemove = (key: string) => {
    const newLinks = { ...links };
    delete newLinks[key];
    setLinks(newLinks);
    onChange(newLinks);
  };

  const handlePlatformChange = (oldKey: string, newKey: string) => {
    if (oldKey === newKey) return;

    const newLinks = { ...links };
    const url = newLinks[oldKey];
    delete newLinks[oldKey];
    newLinks[newKey] = url;
    setLinks(newLinks);
    onChange(newLinks);
  };

  const handleUrlChange = (key: string, url: string) => {
    const newLinks = { ...links, [key]: url };
    setLinks(newLinks);
    onChange(newLinks);
  };

  const getIcon = (platform: string) => {
    const platformData = SOCIAL_PLATFORMS.find((p) => p.value === platform);
    return platformData ? platformData.icon : Globe;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Redes Sociales</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Agregar Red Social
        </Button>
      </div>

      <div className="space-y-3">
        {Object.entries(links).map(([platform, url]) => {
          const Icon = getIcon(platform);
          return (
            <div key={platform || 'new'} className="flex items-center gap-2">
              <div className="w-[180px]">
                <Select
                  value={platform}
                  onValueChange={(newPlatform) => handlePlatformChange(platform, newPlatform)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    {SOCIAL_PLATFORMS.map((p) => {
                      const PlatformIcon = p.icon;
                      return (
                        <SelectItem
                          key={p.value}
                          value={p.value}
                          disabled={platform !== p.value && p.value in links}
                        >
                          <div className="flex items-center gap-2">
                            <PlatformIcon className="h-4 w-4" />
                            {p.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="url"
                    value={url}
                    onChange={(e) => handleUrlChange(platform, e.target.value)}
                    placeholder={`URL de ${
                      SOCIAL_PLATFORMS.find((p) => p.value === platform)?.label || 'perfil'
                    }`}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(platform)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}

        {Object.keys(links).length === 0 && (
          <p className="text-sm text-muted-foreground">
            No hay redes sociales agregadas. Haz clic en &quot;Agregar Red Social&quot; para
            empezar.
          </p>
        )}
      </div>
    </div>
  );
}
