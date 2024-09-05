"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, text = "Loading...", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center h-screen", className)}
        {...props}
      >
        <div className="flex flex-col items-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{text}</p>
        </div>
      </div>
    )
  }
)
Loading.displayName = "Loading"

export { Loading }