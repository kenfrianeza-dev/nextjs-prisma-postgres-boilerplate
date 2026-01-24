import Link from "next/link"
import { FileQuestion } from "lucide-react"

import { Button } from "@/app/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <FileQuestion className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="mt-8 text-4xl font-bold tracking-tighter text-foreground sm:text-5xl">
          Page Not Found
        </h1>
        <p className="mt-4 text-muted-foreground">
          The page you are looking for doesn't exist or has been moved. Check the URL or go back to the homepage.
        </p>
        <div className="mt-8 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild size="lg" >
            <Link href="/">
              Go back home
            </Link>
          </Button>
          {/* <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">
              Go to Dashboard
            </Link>
          </Button> */}
        </div>
      </div>
    </div>
  )
}
