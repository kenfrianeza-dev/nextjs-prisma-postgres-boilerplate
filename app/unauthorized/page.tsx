import Link from "next/link"
import { ShieldAlert } from "lucide-react"

import { Button } from "@/app/components/ui/button"

export default function Unauthorized() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="mt-8 text-4xl font-bold tracking-tighter text-foreground sm:text-5xl">
          Unauthorized Access
        </h1>
        <p className="mt-4 text-muted-foreground">
          You do not have permission to view this page. If you believe this is an error, please contact your administrator.
        </p>
        <div className="mt-8 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild size="lg" variant="default">
            <Link href="/">
              Go back home
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/dashboard">
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
