import { Container } from "@/app/components/container";
import { verifySession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { UserManagementService } from '@/domain/user-management/user-management.service';
import { ErrorCode, isAppErrorCode } from '@/lib/errors';

const PermissionsPage = async () => {
  const session = await verifySession();
  if (!session) redirect('/');

  try {
    await UserManagementService.getPermissions(session.permissions);
    
    return (
      <Container>Permissions page is working!</Container>
    );
  } catch (error) {
    if (isAppErrorCode(error, ErrorCode.FORBIDDEN)) {
      redirect('/unauthorized');
    }
    throw error;
  }
}

export default PermissionsPage;