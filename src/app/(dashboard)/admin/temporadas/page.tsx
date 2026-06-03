import { Metadata } from 'next';
import { SeasonsAdminClient } from './seasons-admin-client';

export const metadata: Metadata = {
  title: 'Temporadas | Admin GYDI',
  description: 'Configura temporadas alta, media y baja por alcance geográfico',
};

export default function TemporadasAdminPage() {
  return <SeasonsAdminClient />;
}
