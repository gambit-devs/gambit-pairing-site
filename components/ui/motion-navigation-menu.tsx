"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { AnimatePresence, motion } from "motion/react"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Highlight, HighlightItem } from "@/components/ui/highlight"

type ContentRecord = {
  children: React.ReactNode
  className?: string
  highlightClassName?: string
  innerClassName?: string
}

type MotionNavigationMenuContextValue = {
  activeValue: string
  viewport: boolean
  glide: boolean
  viewportX: number | null
  openValue: (value: string) => void
  closeMenu: () => void
  registerContent: (value: string, content: ContentRecord) => () => void
  updateViewportPosition: () => void
}

type MotionNavigationMenuItemContextValue = {
  value?: string
}

const MotionNavigationMenuContext =
  React.createContext<MotionNavigationMenuContextValue | null>(null)

const MotionNavigationMenuItemContext =
  React.createContext<MotionNavigationMenuItemContextValue | null>(null)

const MotionNavigationMenuContentContext = React.createContext(false)

// Dropdown timing. Opening and closing fade; switching between menus glides.
const openTransition = {
  type: "tween" as const,
  duration: 0.18,
  ease: "easeOut" as const,
}

const closeTransition = {
  type: "tween" as const,
  duration: 0.12,
  ease: "easeIn" as const,
}

// Switching between menus glides the panel with CSS, which applies in the same frame as the change.
const glideDuration = "200ms"
const glideEase = "ease-out"

// Each menu's content finishes fading out before the next one fades in.
const contentExitTransition = {
  type: "tween" as const,
  duration: 0.07,
  ease: "easeIn" as const,
}

// Zero-duration transition for hovers and anything that should snap.
const instantTransition = {
  type: "tween" as const,
  duration: 0,
}

const openedViewport = { opacity: 1, y: 0, transition: openTransition }
const closedViewport = { opacity: 0, y: -6, transition: closeTransition }

const contentVariants = {
  initial: { opacity: 0 },
  active: { opacity: 1, transition: openTransition },
  exit: { opacity: 0, transition: contentExitTransition },
}

type MotionNavigationMenuProps = Omit<
  React.ComponentPropsWithRef<"nav">,
  "onValueChange"
> & {
  viewport?: boolean
  viewportClassName?: string
  value?: string
  onValueChange?: (value: string) => void
}

function MotionNavigationMenu({
  className,
  children,
  viewport = true,
  viewportClassName,
  value,
  onValueChange,
  onPointerLeave,
  onKeyDown,
  ref,
  ...props
}: MotionNavigationMenuProps) {
  const rootRef = React.useRef<HTMLElement | null>(null)
  const frameRef = React.useRef<number | null>(null)
  const lastActiveValueRef = React.useRef(value ?? "")
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState("")
  const [viewportX, setViewportX] = React.useState<number | null>(null)
  const [glide, setGlide] = React.useState(false)
  const [contentByValue, setContentByValue] = React.useState<
    Record<string, ContentRecord>
  >({})

  const activeValue = value ?? internalValue

  // Reads the trigger and content sizes, then places the panel under the open trigger.
  const measureViewportX = React.useCallback(() => {
    const root = rootRef.current

    if (!root) {
      return
    }

    const rootRect = root.getBoundingClientRect()
    const activeTrigger = root.querySelector<HTMLElement>(
      '[data-slot="navigation-menu-trigger"][data-state="open"]'
    )

    // Keep the panel where it was while it fades out.
    if (!activeTrigger) {
      return
    }

    const triggerRect = activeTrigger.getBoundingClientRect()
    const idealX = triggerRect.left - rootRect.left + triggerRect.width / 2

    const measureEl = root.querySelector<HTMLElement>(
      '[data-slot="navigation-menu-measure"]'
    )
    const viewportEl = root.querySelector<HTMLElement>(
      '[data-slot="navigation-menu-viewport"]'
    )
    const contentWidth =
      (measureEl ? measureEl.offsetWidth : 0) ||
      (viewportEl ? viewportEl.offsetWidth : 0)
    const half = contentWidth / 2

    if (contentWidth > 0) {
      // Find the nearest clipping ancestor to use as the boundary
      let boundary: DOMRect | null = null
      let ancestor = root.parentElement
      while (ancestor && ancestor !== document.body) {
        const style = window.getComputedStyle(ancestor)
        const overflow = style.overflow + style.overflowX
        if (/hidden|clip|scroll|auto/.test(overflow)) {
          boundary = ancestor.getBoundingClientRect()
          break
        }
        ancestor = ancestor.parentElement
      }
      if (!boundary) {
        boundary = document.documentElement.getBoundingClientRect()
      }

      const margin = 8
      const dropLeft = rootRect.left + idealX - half
      const dropRight = rootRect.left + idealX + half

      let adjustment = 0
      if (dropLeft < boundary.left + margin) {
        adjustment = boundary.left + margin - dropLeft
      } else if (dropRight > boundary.right - margin) {
        adjustment = boundary.right - margin - dropRight
      }

      setViewportX(idealX + adjustment)
    } else {
      setViewportX(idealX)
    }
  }, [])

  const updateViewportPosition = React.useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current)
    }

    frameRef.current = requestAnimationFrame(measureViewportX)
  }, [measureViewportX])

  const setRootRef = React.useCallback(
    (node: HTMLElement | null) => {
      rootRef.current = node

      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    },
    [ref]
  )

  const setActiveValue = React.useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setInternalValue(nextValue)
      }

      onValueChange?.(nextValue)
    },
    [isControlled, onValueChange]
  )

  const openValue = React.useCallback(
    (nextValue: string) => {
      if (!nextValue || nextValue === lastActiveValueRef.current) {
        return
      }

      // Moving from one open menu to another glides the panel; opening fresh does not.
      setGlide(lastActiveValueRef.current !== "")
      lastActiveValueRef.current = nextValue
      setActiveValue(nextValue)
      updateViewportPosition()
    },
    [setActiveValue, updateViewportPosition]
  )

  const closeMenu = React.useCallback(() => {
    lastActiveValueRef.current = ""
    setActiveValue("")
    updateViewportPosition()
  }, [setActiveValue, updateViewportPosition])

  const registerContent = React.useCallback(
    (value: string, content: ContentRecord) => {
      setContentByValue((current) => {
        const previous = current[value]

        if (
          previous?.children === content.children &&
          previous?.className === content.className &&
          previous?.innerClassName === content.innerClassName
        ) {
          return current
        }

        return { ...current, [value]: content }
      })

      return () => {
        setContentByValue((current) => {
          if (!current[value]) {
            return current
          }

          const next = { ...current }
          delete next[value]
          return next
        })
      }
    },
    []
  )

  React.useEffect(() => {
    if (value === undefined) {
      return
    }

    if (!value) {
      lastActiveValueRef.current = ""
      return
    }

    openValue(value)
  }, [openValue, value])

  // Measure before paint so a newly opened panel never shows at a stale position.
  React.useLayoutEffect(() => {
    measureViewportX()
  }, [activeValue, measureViewportX])

  React.useLayoutEffect(() => {
    const root = rootRef.current

    if (!root || typeof ResizeObserver === "undefined") {
      return () => {
        if (frameRef.current !== null) {
          cancelAnimationFrame(frameRef.current)
        }
      }
    }

    const observer = new ResizeObserver(updateViewportPosition)
    observer.observe(root)

    return () => {
      observer.disconnect()

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [updateViewportPosition])

  React.useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        !rootRef.current.contains(event.target)
      ) {
        closeMenu()
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [closeMenu])

  const contextValue = React.useMemo(
    () => ({
      activeValue,
      viewport,
      glide,
      viewportX,
      openValue,
      closeMenu,
      registerContent,
      updateViewportPosition,
    }),
    [
      activeValue,
      closeMenu,
      openValue,
      registerContent,
      updateViewportPosition,
      viewport,
      glide,
      viewportX,
    ]
  )

  return (
    <MotionNavigationMenuContext.Provider value={contextValue}>
      <nav
        ref={setRootRef}
        data-slot="navigation-menu"
        data-viewport={viewport}
        className={cn(
          "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
          className
        )}
        onPointerLeave={(event) => {
          onPointerLeave?.(event)
          closeMenu()
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event)

          if (event.key === "Escape") {
            closeMenu()
          }
        }}
        {...props}
      >
        {children}
        {viewport && (
          <MotionNavigationMenuViewport
            className={viewportClassName}
            contentByValue={contentByValue}
          />
        )}
      </nav>
    </MotionNavigationMenuContext.Provider>
  )
}

function MotionNavigationMenuList({
  className,
  highlightClassName,
  ...props
}: React.ComponentPropsWithRef<"ul"> & {
  highlightClassName?: string
}) {
  return (
    <Highlight
      mode="parent"
      controlledItems
      hover
      transition={instantTransition}
      exitDelay={0}
      className={cn(
        "pointer-events-none rounded-md bg-accent",
        highlightClassName
      )}
      style={{ zIndex: -1 }}
      containerClassName="relative"
    >
      <ul
        data-slot="navigation-menu-list"
        className={cn(
          "group relative z-10 flex flex-1 list-none items-center justify-center gap-1",
          className
        )}
        {...props}
      />
    </Highlight>
  )
}

function MotionNavigationMenuItem({
  className,
  value,
  ...props
}: React.ComponentPropsWithRef<"li"> & {
  value?: string
}) {
  const itemContextValue = React.useMemo(() => ({ value }), [value])

  return (
    <MotionNavigationMenuItemContext.Provider value={itemContextValue}>
      <li
        data-slot="navigation-menu-item"
        data-value={value}
        className={cn("relative", className)}
        {...props}
      />
    </MotionNavigationMenuItemContext.Provider>
  )
}

const motionNavigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium outline-none hover:bg-accent hover:text-accent-foreground hover:brightness-95 focus:bg-accent focus:text-accent-foreground focus:brightness-95 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:brightness-95"
)

function MotionNavigationMenuTrigger({
  className,
  children,
  onPointerEnter,
  onFocus,
  onClick,
  ...props
}: React.ComponentPropsWithRef<"button">) {
  const context = React.useContext(MotionNavigationMenuContext)
  const itemContext = React.useContext(MotionNavigationMenuItemContext)
  const value = itemContext?.value
  const isOpen = !!value && context?.activeValue === value

  return (
    <HighlightItem asChild>
      <button
        type="button"
        data-slot="navigation-menu-trigger"
        data-state={isOpen ? "open" : "closed"}
        aria-expanded={isOpen}
        className={cn(motionNavigationMenuTriggerStyle(), "group", className)}
        onPointerEnter={(event) => {
          onPointerEnter?.(event)

          if (value) {
            context?.openValue(value)
          }
        }}
        onFocus={(event) => {
          onFocus?.(event)

          if (value) {
            context?.openValue(value)
          }
        }}
        onClick={(event) => {
          onClick?.(event)

          if (value) {
            context?.openValue(value)
          }
        }}
        {...props}
      >
        {children}{" "}
        <motion.span
          aria-hidden="true"
          animate={{
            rotate: isOpen ? 180 : 0,
            y: isOpen ? 1 : 0,
          }}
          transition={instantTransition}
          className="relative top-0 ml-1.5 inline-flex"
        >
          <ChevronDownIcon className="stroke-2.5 size-3.5" aria-hidden="true" />
        </motion.span>
      </button>
    </HighlightItem>
  )
}

function MotionNavigationMenuContent({
  className,
  highlightClassName,
  innerClassName,
  children,
}: React.ComponentPropsWithRef<"div"> & {
  highlightClassName?: string
  innerClassName?: string
}) {
  const context = React.useContext(MotionNavigationMenuContext)
  const itemContext = React.useContext(MotionNavigationMenuItemContext)
  const value = itemContext?.value
  const isOpen = !!value && context?.activeValue === value

  React.useLayoutEffect(() => {
    if (!context || !value || !context.viewport) {
      return
    }

    return context.registerContent(value, {
      children,
      className,
      highlightClassName,
      innerClassName,
    })
  }, [children, className, context, highlightClassName, innerClassName, value])

  if (!context || !value || context.viewport) {
    return null
  }

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          data-slot="navigation-menu-content"
          key={value}
          variants={contentVariants}
          initial="initial"
          animate="active"
          exit="exit"
          className={cn(
            "absolute top-full left-0 z-50 mt-1.5 rounded-md border bg-card p-2 pr-2.5 text-popover-foreground shadow",
            className
          )}
        >
          <MotionNavigationMenuContentInner
            highlightClassName={highlightClassName}
            innerClassName={innerClassName}
          >
            {children}
          </MotionNavigationMenuContentInner>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function MotionNavigationMenuContentInner({
  highlightClassName,
  innerClassName,
  children,
}: {
  highlightClassName?: string
  innerClassName?: string
  children: React.ReactNode
}) {
  return (
    <MotionNavigationMenuContentContext.Provider value={true}>
      <Highlight
        mode="parent"
        controlledItems
        hover
        transition={instantTransition}
        exitDelay={0}
        className={cn(
          "pointer-events-none rounded-sm bg-accent",
          highlightClassName
        )}
        style={{ zIndex: -1 }}
        containerClassName="relative"
      >
        <div className={cn("relative z-10", innerClassName)}>{children}</div>
      </Highlight>
    </MotionNavigationMenuContentContext.Provider>
  )
}

function MotionNavigationMenuViewport({
  className,
  contentByValue,
}: React.ComponentPropsWithRef<"div"> & {
  contentByValue?: Record<string, ContentRecord>
}) {
  const context = React.useContext(MotionNavigationMenuContext)
  const measureRef = React.useRef<HTMLDivElement | null>(null)
  const [size, setSize] = React.useState({ width: 0, height: 0 })
  const [lastSize, setLastSize] = React.useState({ width: 0, height: 0 })
  const activeContent =
    context?.activeValue && contentByValue
      ? contentByValue[context.activeValue]
      : undefined

  React.useLayoutEffect(() => {
    const node = measureRef.current

    if (!node || !activeContent) {
      return
    }

    const updateSize = () => {
      const rect = node.getBoundingClientRect()
      const nextSize = {
        width: rect.width,
        height: rect.height,
      }

      setSize(nextSize)

      if (nextSize.width > 0 || nextSize.height > 0) {
        setLastSize(nextSize)
      }

      context?.updateViewportPosition()
    }

    updateSize()

    if (typeof ResizeObserver === "undefined") {
      return
    }

    const observer = new ResizeObserver(updateSize)
    observer.observe(node)

    return () => observer.disconnect()
  }, [activeContent, context])

  const width = size.width > 0 ? size.width : lastSize.width
  const height = size.height > 0 ? size.height : lastSize.height
  const isOpen = !!activeContent
  const glide = context?.glide ?? false
  // Position and size only glide when switching between open menus.
  const glideStyle = glide
    ? {
        transition: `left ${glideDuration} ${glideEase}, width ${glideDuration} ${glideEase}, height ${glideDuration} ${glideEase}`,
      }
    : { transition: "none" }

  return (
    <div
      className={cn(
        "absolute top-full isolate z-50 flex -translate-x-1/2 justify-center",
        // Keeps the last panel's box from blocking clicks on the page once closed.
        !isOpen && "pointer-events-none"
      )}
      style={{ left: context?.viewportX ?? "50%", ...glideStyle }}
    >
      <motion.div
        data-slot="navigation-menu-viewport"
        initial={false}
        animate={isOpen ? openedViewport : closedViewport}
        style={{ width, height, ...glideStyle }}
        className={cn(
          "relative mt-1.5 overflow-hidden rounded-md border bg-card text-popover-foreground shadow",
          !isOpen && "pointer-events-none",
          className
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {activeContent && context?.activeValue && (
            <motion.div
              data-slot="navigation-menu-content"
              key={context.activeValue}
              variants={contentVariants}
              initial="initial"
              animate="active"
              exit="exit"
              className={cn("p-2 pr-2.5", activeContent.className)}
            >
              <MotionNavigationMenuContentInner
                highlightClassName={activeContent.highlightClassName}
                innerClassName={activeContent.innerClassName}
              >
                {activeContent.children}
              </MotionNavigationMenuContentInner>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div
        ref={measureRef}
        aria-hidden="true"
        data-slot="navigation-menu-measure"
        className="pointer-events-none invisible absolute top-1.5 left-0 w-max"
      >
        {activeContent && (
          <div className={cn("p-2 pr-2.5", activeContent.className)}>
            <MotionNavigationMenuContentInner
              highlightClassName={activeContent.highlightClassName}
              innerClassName={activeContent.innerClassName}
            >
              {activeContent.children}
            </MotionNavigationMenuContentInner>
          </div>
        )}
      </div>
    </div>
  )
}

function MotionNavigationMenuLink({
  className,
  highlight = true,
  onFocus,
  onPointerEnter,
  ...props
}: React.ComponentPropsWithRef<"a"> & { highlight?: boolean }) {
  const context = React.useContext(MotionNavigationMenuContext)
  const itemContext = React.useContext(MotionNavigationMenuItemContext)
  const isInMenuContent = React.useContext(MotionNavigationMenuContentContext)
  const closesMenuOnEntry = !isInMenuContent && !itemContext?.value

  const link = (
    <a
      data-slot="navigation-menu-link"
      className={cn(
        "flex flex-col gap-1 rounded-sm p-2 text-sm outline-none hover:text-accent-foreground focus:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 data-[active=true]:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      onPointerEnter={(event) => {
        onPointerEnter?.(event)

        if (closesMenuOnEntry && context?.activeValue) {
          context.closeMenu()
        }
      }}
      onFocus={(event) => {
        onFocus?.(event)

        if (closesMenuOnEntry && context?.activeValue) {
          context.closeMenu()
        }
      }}
      {...props}
    />
  )

  return highlight ? <HighlightItem asChild>{link}</HighlightItem> : link
}

function MotionNavigationMenuIndicator({
  className,
  ...props
}: React.ComponentPropsWithRef<"div">) {
  return (
    <div
      data-slot="navigation-menu-indicator"
      className={cn(
        "pointer-events-none top-full z-1 flex h-1.5 items-end justify-center overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
    </div>
  )
}

export {
  MotionNavigationMenu,
  MotionNavigationMenuList,
  MotionNavigationMenuItem,
  MotionNavigationMenuContent,
  MotionNavigationMenuTrigger,
  MotionNavigationMenuLink,
  MotionNavigationMenuViewport,
  MotionNavigationMenuIndicator,
  motionNavigationMenuTriggerStyle,
}
