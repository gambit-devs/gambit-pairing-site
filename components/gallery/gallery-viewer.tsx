"use client"

import { FeaturedCarousel } from "@/components/gallery/featured-carousel"
import { jxlSourceFor, Picture } from "@/components/media/picture"
import { items, type GalleryItem } from "@/components/website/constant"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { motion, useInView } from "motion/react"
import React, { useCallback, useEffect, useRef, useState } from "react"

const VISIBLE_ITEMS = items.slice(5, 14)

function UnsplashGrid() {
  const [selected, setSelected] = useState<GalleryItem | null>(null)
  const [loadedIds, setLoadedIds] = useState<Set<number>>(new Set())

  const handleImageLoad = useCallback((id: number) => {
    setLoadedIds((prev) => new Set(prev).add(id))
  }, [])

  return (
    <div className="mx-auto w-full max-w-[1500px]">
      <FeaturedCarousel onSelect={setSelected} />

      <div
        data-screenshot-grid
        className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 2xl:grid-cols-4"
      >
        {VISIBLE_ITEMS.map((item) => (
          <ImageItem
            key={item.id}
            item={item}
            setSelected={setSelected}
            isLoaded={loadedIds.has(item.id)}
            onLoad={handleImageLoad}
          />
        ))}
      </div>

      <Modal selected={selected} setSelected={setSelected} />
    </div>
  )
}

interface ImageItemProps {
  item: GalleryItem
  setSelected: (item: GalleryItem | null) => void
  isLoaded: boolean
  onLoad: (id: number) => void
}

function ImageItem({ item, isLoaded, onLoad, setSelected }: ImageItemProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true })
  const [imgError, setImgError] = useState(false)

  const handleClick = useCallback(() => setSelected(item), [item, setSelected])
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        setSelected(item)
      }
    },
    [item, setSelected]
  )

  useEffect(() => {
    const image = ref.current?.querySelector("img")
    if (image?.complete && image.naturalWidth > 0) onLoad(item.id)
  }, [item.id, onLoad])

  return (
    <motion.figure
      initial="hidden"
      animate={isInView && "visible"}
      ref={ref}
      data-gallery-item
      className={`group relative aspect-[16/10] w-full cursor-pointer overflow-hidden border border-border artwork-background before:absolute before:inset-0 before:from-neutral-200/90 before:from-5% before:to-transparent before:to-90% before:content-[''] hover:before:bg-linear-to-t dark:before:from-neutral-900`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {!isLoaded && !imgError && (
        <div className="h-full w-full animate-pulse bg-neutral-200 dark:bg-neutral-800" />
      )}
      {imgError ? (
        <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-sm text-neutral-400 dark:bg-neutral-900">
          Failed to load
        </div>
      ) : (
        <picture className={isLoaded ? "block h-full w-full" : "hidden"}>
          <source srcSet={jxlSourceFor(item.url)} type="image/jxl" />
          <motion.img
            whileHover={{ scale: isLoaded ? 1.025 : 1 }}
            src={item.url}
            alt={item.title}
            className="h-full w-full cursor-pointer object-contain"
            onLoad={() => onLoad(item.id)}
            onError={() => setImgError(true)}
          />
        </picture>
      )}
      <div className="absolute bottom-0 left-0 mt-2 flex flex-wrap p-2 font-semibold opacity-0 transition-opacity group-hover:opacity-100">
        <span>{item.title}</span>
      </div>
    </motion.figure>
  )
}

interface ModalProps {
  selected: GalleryItem | null
  setSelected: (item: GalleryItem | null) => void
}

function trapFocus(element: HTMLElement, event: KeyboardEvent) {
  const focusable = element.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  if (focusable.length === 0) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (event.key === "Tab") {
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
}

function Modal({ selected, setSelected }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  const selectedIndex = selected
    ? VISIBLE_ITEMS.findIndex((item) => item.id === selected.id)
    : -1

  const handleClose = useCallback(() => setSelected(null), [setSelected])

  const navigate = useCallback(
    (delta: number) => {
      const nextIndex = selectedIndex + delta
      if (nextIndex < 0 || nextIndex >= VISIBLE_ITEMS.length) return
      setSelected(VISIBLE_ITEMS[nextIndex])
    },
    [selectedIndex, setSelected]
  )

  const goNext = useCallback(() => navigate(1), [navigate])
  const goPrev = useCallback(() => navigate(-1), [navigate])

  useEffect(() => {
    if (!selected) return
    document.body.classList.add("overflow-hidden")

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose()
      else if (event.key === "ArrowRight") goNext()
      else if (event.key === "ArrowLeft") goPrev()
      if (dialogRef.current) trapFocus(dialogRef.current, event)
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.body.classList.remove("overflow-hidden")
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [selected, handleClose, goNext, goPrev])

  if (!selected) return null

  const hasPrev = selectedIndex > 0
  const hasNext = selectedIndex < VISIBLE_ITEMS.length - 1

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={selected.title}
      onClick={handleClose}
      className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-xs sm:p-8"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-[1280px] cursor-default shadow-2xl"
      >
        <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden artwork-background sm:aspect-auto sm:h-[min(82vh,900px)]">
          <Picture
            key={selected.id}
            src={selected.url}
            alt={selected.title}
            className="absolute inset-0 h-full w-full object-contain"
            priority
          />

          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-between p-3 sm:p-5">
            {hasPrev ? (
              <button
                type="button"
                className="pointer-events-auto grid size-10 place-items-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/75 focus-visible:ring-2 focus-visible:ring-white sm:size-12"
                onClick={goPrev}
                aria-label="Previous image"
              >
                <ChevronLeft className="size-6 sm:size-7" />
              </button>
            ) : (
              <span />
            )}
            {hasNext ? (
              <button
                type="button"
                className="pointer-events-auto grid size-10 place-items-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/75 focus-visible:ring-2 focus-visible:ring-white sm:size-12"
                onClick={goNext}
                aria-label="Next image"
              >
                <ChevronRight className="size-6 sm:size-7" />
              </button>
            ) : (
              <span />
            )}
          </div>

          <button
            type="button"
            className="absolute top-3 right-3 z-20 grid size-10 place-items-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/75 focus-visible:ring-2 focus-visible:ring-white sm:top-5 sm:right-5"
            onClick={handleClose}
            aria-label="Close modal"
          >
            <X className="size-5 sm:size-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
            {selectedIndex + 1} / {VISIBLE_ITEMS.length}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UnsplashGrid
