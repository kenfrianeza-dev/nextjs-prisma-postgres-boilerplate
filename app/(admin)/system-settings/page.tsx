import { Container } from '@/app/components/container';
import { MenuItems } from '@/app/components/secondary-sidebar/secondary-sidebar';
import { verifySession, getUserRoles } from '@/lib/auth';
import { Palette, Settings } from 'lucide-react';
import { redirect } from 'next/navigation';

const menuItems: MenuItems[] = [
  { title: "General", description: "Manage your account settings", icon: Settings },
  { title: "Appearance", description: "Customize your theme", icon: Palette },
];

async function SystemSettingsPage() {
  const session = await verifySession();
  if (!session) redirect('/');

  return (
    <Container menuItems={menuItems}>
      <div className='space-y-4'>
        <div>
          <h2 className="text-lg font-bold">
            General
          </h2>
          <p className="text-muted-foreground text-sm">
            General settings.
          </p>
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl animate-pulse" />
            <div className="bg-muted/50 aspect-video rounded-xl animate-pulse" />
            <div className="bg-muted/50 aspect-video rounded-xl animate-pulse" />
          </div>
          <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min animate-pulse" />
        </div>
      </div>
    </Container>
  );
}

export default SystemSettingsPage;