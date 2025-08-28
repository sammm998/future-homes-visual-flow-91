import { useEffect, useRef, ReactNode } from 'react'
import { gsap } from 'gsap'
import { cn } from "@/lib/utils"

interface GridMotionProps {
  /**
   * Array of items to display in the grid
   */
  items?: (string | ReactNode)[]
  /**
   * Color for the radial gradient background
   */
  gradientColor?: string
  /**
   * Additional CSS classes
   */
  className?: string
}

export function GridMotion({
  items = [],
  gradientColor = 'black',
  className
}: GridMotionProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const mouseXRef = useRef(window.innerWidth / 2)

  const totalItems = 28
  const defaultItems = Array.from({ length: totalItems }, (_, index) => `Item ${index + 1}`)
  const combinedItems = items.length > 0 ? items.slice(0, totalItems) : defaultItems

  useEffect(() => {
    let animationFrame: number
    let isAnimating = false
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseXRef.current = e.clientX
      
      // Throttle animation updates to prevent excessive rendering
      if (!isAnimating) {
        isAnimating = true
        animationFrame = requestAnimationFrame(updateMotion)
      }
    }

    const updateMotion = () => {
      const maxMoveAmount = 150 // Reduced from 300 for stability
      const baseDuration = 1.2 // Increased for smoother motion
      const inertiaFactors = [0.8, 0.6, 0.5, 0.4] // More conservative values

      rowRefs.current.forEach((row, index) => {
        if (row) {
          const direction = index % 2 === 0 ? 1 : -1
          const normalizedX = Math.max(0, Math.min(1, mouseXRef.current / window.innerWidth))
          const moveAmount = (normalizedX * maxMoveAmount - maxMoveAmount / 2) * direction
          
          // Use transform3d for better performance and add boundaries
          const clampedMove = Math.max(-maxMoveAmount, Math.min(maxMoveAmount, moveAmount))

          gsap.to(row, {
            x: clampedMove,
            duration: baseDuration + inertiaFactors[index % inertiaFactors.length],
            ease: 'power2.out',
            overwrite: 'auto',
            force3D: true, // Better performance
          })
        }
      })
      
      isAnimating = false
    }

    // Initial position setup
    rowRefs.current.forEach((row, index) => {
      if (row) {
        gsap.set(row, { x: 0, force3D: true })
      }
    })

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
      
      // Reset positions on cleanup
      rowRefs.current.forEach((row) => {
        if (row) {
          gsap.killTweensOf(row)
          gsap.set(row, { x: 0, clearProps: 'transform' })
        }
      })
    }
  }, [])

  return (
    <div className={cn("h-full w-full overflow-hidden", className)} ref={gridRef}>
      <section
        className="relative flex h-screen w-full items-center justify-center overflow-hidden"
        style={{
          background: `radial-gradient(circle, ${gradientColor} 0%, transparent 100%)`,
        }}
      >
        <div className="relative z-2 flex-none grid h-[150vh] w-[150vw] gap-4 grid-rows-[repeat(4,1fr)] grid-cols-[100%] -rotate-15 origin-center">
          {[...Array(4)].map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid gap-4 grid-cols-[repeat(7,1fr)] will-change-transform will-change-filter"
              ref={(el) => (rowRefs.current[rowIndex] = el)}
            >
              {[...Array(7)].map((_, itemIndex) => {
                const content = combinedItems[rowIndex * 7 + itemIndex]
                return (
                  <div key={itemIndex} className="relative">
                    <div className="relative h-full w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center text-foreground text-xl">
                      {typeof content === 'string' && content.startsWith('http') ? (
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${content})`,
                          }}
                        />
                      ) : (
                        <div className="p-4 text-center z-1">
                          {content}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <div className="relative pointer-events-none h-full w-full inset-0">
          <div className="rounded-none" />
        </div>
      </section>
    </div>
  )
}