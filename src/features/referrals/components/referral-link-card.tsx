/**
 * ReferralLinkCard - Display a referral link with actions
 */
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, QrCode, TrendingUp } from 'lucide-react';
import type { ReferralLink } from '../types';
import { useCopyReferralLink } from '../hooks';
import { formatDate } from '@/lib/utils';

interface ReferralLinkCardProps {
  link: ReferralLink;
  onViewQR?: (link: ReferralLink) => void;
}

export function ReferralLinkCard({ link, onViewQR }: ReferralLinkCardProps) {
  const copyLink = useCopyReferralLink();

  const statusColors = {
    ACTIVE: 'bg-green-500',
    INACTIVE: 'bg-gray-500',
    EXPIRED: 'bg-red-500',
    DELETED: 'bg-red-700',
  };

  const isExpired = new Date(link.expiresAt) < new Date();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-mono">{link.shortCode}</CardTitle>
            <CardDescription className="text-xs">
              Created {formatDate(link.createdAt)}
            </CardDescription>
          </div>
          <Badge className={statusColors[link.status]}>
            {link.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Full URL */}
        <div className="bg-muted p-3 rounded-md">
          <p className="text-sm font-mono truncate">{link.fullUrl}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{link.clicksCount}</p>
            <p className="text-xs text-muted-foreground">Clicks</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{link.conversionsCount}</p>
            <p className="text-xs text-muted-foreground">Conversions</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{link.conversionRate.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">Rate</p>
          </div>
        </div>

        {/* Total Commission */}
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-md">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Total Earned</span>
          </div>
          <span className="text-lg font-bold text-green-600">
            ${link.totalCommission.toFixed(2)}
          </span>
        </div>

        {/* Expiration Warning */}
        {isExpired && (
          <div className="text-xs text-red-600 dark:text-red-400">
            Expired on {formatDate(link.expiresAt)}
          </div>
        )}
        {!isExpired && (
          <div className="text-xs text-muted-foreground">
            Expires on {formatDate(link.expiresAt)}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => copyLink(link.fullUrl)}
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy Link
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewQR?.(link)}
        >
          <QrCode className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          asChild
        >
          <a href={link.fullUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}