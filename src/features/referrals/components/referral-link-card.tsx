/**
 * ReferralLinkCard - Display a referral link with actions
 */
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, QrCode, TrendingUp, RefreshCw, AlertTriangle, XCircle } from 'lucide-react';
import type { ReferralLink } from '../types';
import { useCopyReferralLink, useRenewReferralLink } from '../hooks';
import { formatDate } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/format';
import { differenceInDays } from 'date-fns';

interface ReferralLinkCardProps {
  link: ReferralLink;
  onViewQR?: (link: ReferralLink) => void;
}

export function ReferralLinkCard({ link, onViewQR }: ReferralLinkCardProps) {
  const copyLink = useCopyReferralLink();
  const { mutate: renewLink, isPending: isRenewing } = useRenewReferralLink();

  const statusColors = {
    ACTIVE: 'bg-green-500',
    INACTIVE: 'bg-gray-500',
    EXPIRED: 'bg-red-500',
    DELETED: 'bg-red-700',
  };

  const now = new Date();
  const expirationDate = new Date(link.expiresAt);
  const daysUntilExpiration = differenceInDays(expirationDate, now);

  const isExpired = daysUntilExpiration < 0;
  const isExpiringSoon = daysUntilExpiration >= 0 && daysUntilExpiration <= 7;
  const isActive = daysUntilExpiration > 7;

  const handleRenew = () => {
    renewLink(link.id);
  };

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
          <div className="flex flex-col gap-2 items-end">
            <Badge className={statusColors[link.status]}>
              {link.status}
            </Badge>
            {isExpired && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                Expired {Math.abs(daysUntilExpiration)} days ago
              </Badge>
            )}
            {isExpiringSoon && (
              <Badge variant="warning" className="flex items-center gap-1 bg-yellow-500">
                <AlertTriangle className="h-3 w-3" />
                Expires in {daysUntilExpiration} days
              </Badge>
            )}
            {isActive && (
              <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-800">
                Expires in {daysUntilExpiration} days
              </Badge>
            )}
          </div>
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
            <p className="text-2xl font-bold">{link.conversionRate?.toFixed(1)}%</p>
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
            {formatCurrency(link.totalCommission ?? 0, 'USD')}
          </span>
        </div>

        {/* Expiration Info */}
        <div className={`text-xs ${isExpired ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
          {isExpired ? 'Expired on' : 'Expires on'} {formatDate(link.expiresAt)}
        </div>

        {/* Renewal Notice */}
        {isExpired && (
          <div className="p-3 bg-red-50 dark:bg-red-950 rounded-md border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-200">
              This link has expired. Renew it to continue using it.
            </p>
          </div>
        )}
        {isExpiringSoon && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-md border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              This link will expire soon. Consider renewing it.
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 flex-wrap">
        {isExpired ? (
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={handleRenew}
            disabled={isRenewing}
          >
            {isRenewing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Renewing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Renew Link
              </>
            )}
          </Button>
        ) : (
          <>
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

            {isExpiringSoon && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRenew}
                disabled={isRenewing}
                className="w-full mt-2"
              >
                {isRenewing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Renewing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Renew Now
                  </>
                )}
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}