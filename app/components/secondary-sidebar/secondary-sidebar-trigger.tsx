"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/app/components/ui/sheet"
import { Menu } from "lucide-react"

export const SecondarySidebarTrigger = ({ 
  children,
  open,
  onOpenChange
}: { 
  children: React.ReactNode,
  open?: boolean,
  onOpenChange?: (open: boolean) => void
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {/* <Button variant="ghost" size="icon"> */}
        <div className="ml-2 mr-4 my-3">
          <Menu size={16} className="cursor-pointer text-gray-400 hover:text-foreground transition" />
        </div>
        {/* </Button> */}
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <SheetHeader className="px-5 border-b">
          <SheetTitle className="text-left">Settings</SheetTitle>
        </SheetHeader>
        <div className="h-full">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  )
}
