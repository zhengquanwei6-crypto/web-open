import * as React from "react"
import { cn } from "../../utils/cn"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'glass';
  className?: string;
  children?: React.ReactNode;
  key?: React.Key;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-indigo-500/20 text-indigo-300": variant === "default",
          "border-transparent bg-white/10 text-slate-200": variant === "secondary",
          "text-slate-200": variant === "outline",
          "border-white/10 bg-white/5 text-slate-200 backdrop-blur-sm": variant === "glass"
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
