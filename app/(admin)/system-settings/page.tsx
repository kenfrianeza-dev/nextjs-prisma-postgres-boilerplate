import { verifySession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SettingsClient from './settings-client';

async function SystemSettingsPage() {
  const session = await verifySession();
  if (!session) redirect('/');

  return (
    <SettingsClient permissions={session.permissions} />
  );
}

export default SystemSettingsPage;