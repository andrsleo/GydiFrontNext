'use client';

import { HostInbox } from '@/features/collaborations/components/inbox/host-inbox';

export default function HostInboxPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Inbox de colaboraciones</h1>
        <p className="text-sm text-muted-foreground">
          Pitches recibidos de creadores de contenido
        </p>
      </div>
      <HostInbox />
    </div>
  );
}
