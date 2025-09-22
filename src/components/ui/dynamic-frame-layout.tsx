
"use client"

import { useState } from "react"

interface Frame {
  id: number
  image: string
  title: string
  defaultPos: { x: number; y: number; w: number; h: number }
  mediaSize: number
  isHovered: boolean
  isButton?: boolean
}

interface FrameComponentProps {
  image: string
  title: string
  className?: string
  mediaSize: number
  isButton?: boolean
}

function FrameComponent({
  image,
  title,
  className = "",
  mediaSize,
  isButton = false,
}: FrameComponentProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        <img
          className="w-full h-full object-cover"
          src={image}
          alt={title}
        />
        <div className="absolute inset-0 hover:bg-black/10 transition-colors"></div>
      </div>
    </div>
  )
}

interface DynamicFrameLayoutProps {
  frames: Frame[]
  className?: string
  hoverSize?: number
  gapSize?: number
}

export function DynamicFrameLayout({ 
  frames, 
  className,
  gapSize = 4
}: DynamicFrameLayoutProps) {
  return (
    <div
      className={`grid grid-cols-3 grid-rows-3 w-full h-full ${className}`}
      style={{
        gap: `${gapSize}px`,
      }}
    >
      {frames.map((frame) => (
        <div
          key={frame.id}
          className="relative cursor-pointer"
        >
          <FrameComponent
            image={frame.image}
            title={frame.title}
            className="w-full h-full"
            mediaSize={frame.mediaSize}
            isButton={frame.isButton}
          />
        </div>
      ))}
    </div>
  )
}
