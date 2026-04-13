import * as React from 'react';
import { Container, ContainerHeader } from "@/app/components/container";
import { verifySession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { UserManagementService } from '@/domain/user-management/user-management.service';
import { ErrorCode, isAppErrorCode } from '@/lib/errors';
import { UsersClient } from './users-client';
import { Skeleton } from '@/app/components/ui/skeleton';

const UsersPageSkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-10 w-[300px]" />
      <Skeleton className="h-10 w-[120px]" />
    </div>
    <div className="border rounded-md">
      <div className="p-4 border-b">
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

const UsersPage = async () => {
  const session = await verifySession();
  if (!session) redirect('/');

  try {
    const users = await UserManagementService.getUsers(session.permissions);
    const roles = await UserManagementService.getRoles(session.permissions);
    const allPermissions = await UserManagementService.getPermissions(session.permissions);

    return (
      <Container className='space-y-4'>
        <ContainerHeader title="Users" description="Manage users information and their roles." />
        <React.Suspense fallback={<UsersPageSkeleton />}>
          <UsersClient 
            users={users} 
            roles={roles}
            permissions={session.permissions}
            allPermissions={allPermissions}
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

export default UsersPage;