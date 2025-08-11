
"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  value: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  onFilterChange: (filter: string) => void
  activeFilter: string
}

export function NavBar({ items, className, onFilterChange, activeFilter }: NavBarProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={cn(
        "sticky top-20 z-40 mb-8 w-full",
        className,
      )}
    >
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 bg-background/80 border border-border/50 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg mx-auto min-w-fit w-fit">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = activeFilter === item.value

            return (
              <button
                key={item.value}
                onClick={() => onFilterChange(item.value)}
                className={cn(
                  "relative cursor-pointer text-sm font-semibold px-3 md:px-4 py-2 rounded-full transition-colors whitespace-nowrap flex-shrink-0",
                  "text-foreground/70 hover:text-primary",
                  isActive && "text-primary",
                )}
              >
                <span className="hidden sm:inline text-xs md:text-sm">{item.name}</span>
                <span className="sm:hidden">
                  <Icon size={16} strokeWidth={2.5} />
                </span>
                {isActive && (
                  <motion.div
                    layoutId="lamp"
                    className="absolute inset-0 w-full bg-primary/10 rounded-full -z-10 border border-primary/20"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 md:w-8 h-1 bg-primary rounded-t-full">
                      <div className="absolute w-8 md:w-12 h-4 md:h-6 bg-primary/20 rounded-full blur-md -top-1 md:-top-2 -left-1 md:-left-2" />
                      <div className="absolute w-6 md:w-8 h-4 md:h-6 bg-primary/20 rounded-full blur-md -top-0.5 md:-top-1" />
                      <div className="absolute w-3 md:w-4 h-3 md:h-4 bg-primary/20 rounded-full blur-sm top-0 left-1.5 md:left-2" />
                    </div>
                  </motion.div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
