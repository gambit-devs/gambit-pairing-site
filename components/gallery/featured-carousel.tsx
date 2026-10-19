"use client"

import { Picture } from "@/components/media/picture"
import { items, type GalleryItem } from "@/components/website/constant"
import {
  Carousel,
  Slider,
  SliderContainer,
  SliderDotButton,
  SliderNextButton,
  SliderPrevButton,
} from "@/components/uilayouts/carousel"
import type { EmblaOptionsType } from "embla-carousel"
import Autoplay from "embla-carousel-autoplay"
import ClassNames from "embla-carousel-class-names"
import { ChevronLeft, ChevronRight } from "lucide-react"

const FEATURED_ITEMS = [items[6], items[8], items[10], items[12]].filter(
  (item): item is GalleryItem => item !== undefined
)
const FEATURED_OPTIONS: EmblaOptionsType = { loop: true }
const FEATURED_PLUGINS = [
  ClassNames(),
  Autoplay({
    delay: 5000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  }),
]

interface FeaturedCarouselProps {
  onSelect: (item: GalleryItem) => void
}

export function FeaturedCarousel({ onSelect }: FeaturedCarouselProps) {
  return (
    <Carousel
      aria-label="Featured screenshots"
      aria-roledescription="carousel"
      className="group/featured-carousel"
      options={FEATURED_OPTIONS}
      plugins={FEATURED_PLUGINS}
      role="region"
    >
      <SliderContainer className="gap-2">
        {FEATURED_ITEMS.map((item, index) => (
          <Slider
            key={item.id}
            data-featured-slide
            className="w-4/5 transition-opacity duration-700 ease-out [&.is-in-view]:opacity-20 [&.is-snapped]:opacity-100"
          >
            <button
              type="button"
              onClick={() => onSelect(item)}
              aria-label={`Open ${item.title} screenshot`}
              className="group/slide relative block aspect-[16/9] w-full overflow-hidden border border-border artwork-background text-left shadow-lg transition-shadow outline-none hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Picture
                src={item.url}
                alt=""
                priority={index === 0}
                className="absolute inset-0 h-full w-full object-contain p-2"
              />
              <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/35 to-transparent px-5 pt-12 pb-4 text-sm font-semibold text-white sm:px-6 sm:pb-5 sm:text-base">
                {item.title}
              </span>
            </button>
          </Slider>
        ))}
      </SliderContainer>

      <div className="flex justify-center py-2">
        <SliderDotButton />
      </div>

      <SliderPrevButton
        type="button"
        aria-label="Previous featured screenshot"
        className="absolute top-1/2 left-6 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-foreground shadow-md transition-colors hover:bg-background focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 sm:size-11"
      >
        <ChevronLeft className="size-5 sm:size-6" />
      </SliderPrevButton>
      <SliderNextButton
        type="button"
        aria-label="Next featured screenshot"
        className="absolute top-1/2 right-6 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-foreground shadow-md transition-colors hover:bg-background focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 sm:size-11"
      >
        <ChevronRight className="size-5 sm:size-6" />
      </SliderNextButton>
    </Carousel>
  )
}
