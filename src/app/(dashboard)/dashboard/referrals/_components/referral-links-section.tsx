/**
 * ReferralLinksSection - Display and manage referral links
 */
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useReferralLinks } from '@/features/referrals/hooks';
import { ReferralLinkCard, GenerateLinkForm } from '@/features/referrals/components';
import type { ReferralLink } from '@/features/referrals/types';

// Mock properties - Replace with real data
const MOCK_PROPERTIES = [
  { id: '1', title: 'Beach House in Miami' },
  { id: '2', title: 'Mountain Cabin in Colorado' },
  { id: '3', title: 'City Apartment in NYC' },
];

export function ReferralLinksSection() {
  const { data: links, isLoading, error } = useReferralLinks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<ReferralLink | null>(null);

  if (isLoading) {
    return <div>Loading referral links...</div>;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Links</CardTitle>
          <CardDescription>{error.message}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const activeLinks = links?.filter((link) => link.status === 'ACTIVE') || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>My Referral Links</CardTitle>
            <CardDescription>
              {activeLinks.length} active link{activeLinks.length !== 1 ? 's' : ''}
            </CardDescription>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Link
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Referral Link</DialogTitle>
                <DialogDescription>
                  Create a new referral link for a property
                </DialogDescription>
              </DialogHeader>
              <GenerateLinkForm
                properties={MOCK_PROPERTIES}
                onSuccess={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {links && links.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {links.map((link) => (
              <ReferralLinkCard
                key={link.id}
                link={link}
                onViewQR={(link) => setSelectedLink(link)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No referral links yet. Create your first one!
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Link
            </Button>
          </div>
        )}
      </CardContent>

      {/* QR Code Dialog */}
      {selectedLink && (
        <Dialog open={!!selectedLink} onOpenChange={() => setSelectedLink(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>QR Code</DialogTitle>
              <DialogDescription>
                Scan this QR code to access the referral link
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center p-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(selectedLink.fullUrl)}`}
                alt="QR Code"
                className="rounded-lg"
              />
            </div>
            <p className="text-sm text-center text-muted-foreground font-mono">
              {selectedLink.shortCode}
            </p>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}