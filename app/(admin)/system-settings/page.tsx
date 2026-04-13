import { verifySession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SettingsClient from './settings-client';
import { SystemSettingsService } from '@/domain/system/system-settings.service';
import { ErrorCode, isAppErrorCode } from '@/lib/errors';

async function SystemSettingsPage() {
  const session = await verifySession();
  if (!session) redirect('/');

  try {
    const categories = await SystemSettingsService.getCategorizedSettings(session.permissions);
    
    return (
      <SettingsClient 
        permissions={session.permissions} 
        categories={categories} 
      />
    );
  } catch (error) {
    if (isAppErrorCode(error, ErrorCode.FORBIDDEN)) {
      redirect('/unauthorized');
    }
    throw error;
  }
}

export default SystemSettingsPage;