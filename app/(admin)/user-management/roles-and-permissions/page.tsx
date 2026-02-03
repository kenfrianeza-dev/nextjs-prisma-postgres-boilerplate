import * as React from 'react';
import { Container, ContainerHeader } from "@/app/components/container";
import { verifySession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { UserManagementService } from '@/domain/user-management/user-management.service';
import { ErrorCode, isAppErrorCode } from '@/lib/errors';
import { RolesClient } from './roles-client';
import { Skeleton } from '@/app/components/ui/skeleton';

const RolesPageSkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-10 w-[300px]" />
      <Skeleton className="h-10 w-[120px]" />
    </div>
    <div className="border rounded-md overflow-hidden">
      <div className="p-4 bg-muted/50 border-b">
        <div className="flex gap-4">
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-4 border-b last:border-0">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const RolesPage = async () => {
  const session = await verifySession();
  if (!session) redirect('/');

  try {
    const roles = await UserManagementService.getRoles(session.permissions);
    const allPermissions = await UserManagementService.getPermissions(session.permissions);
    
    return (
      <Container className='space-y-4'>
        <ContainerHeader title="Roles & Permissions" description="Manage roles and their associated permissions." />
        <React.Suspense fallback={<RolesPageSkeleton />}>
          <RolesClient 
            roles={JSON.parse(JSON.stringify(roles))} 
            allPermissions={JSON.parse(JSON.stringify(allPermissions))}
            userPermissions={session.permissions}
          />
        </React.Suspense>
      </Container>
    );
  } catch (error) {
    if (isAppErrorCode(error, ErrorCode.FORBIDDEN)) {
      redirect('/unauthorized');
    }
    throw error;
  }
}

export default RolesPage;