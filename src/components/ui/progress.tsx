"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  // Determine direction on client side only
  const getTransformStyle = (value: number | null | undefined) => {
    // Handle null or undefined values
    const numericValue = value ?? 0;
    
    if (typeof window === 'undefined') {
      // Server-side fallback - default to LTR
      return `translateX(-${100 - numericValue}%)`;
    }
    
    // Client-side - check document direction
    return `translateX(${document.documentElement.dir === 'rtl' ? '' : '-'}${100 - numericValue}%)`;
  };

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all"
        style={{ 
          transform: getTransformStyle(value)
        }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }