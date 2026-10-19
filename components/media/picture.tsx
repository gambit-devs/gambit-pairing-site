import type { ComponentProps } from "react"

// JPEG XL is smaller, but not every browser decodes it, so the WebP at `src`
// is the fallback. Callers pass the WebP path.
export function jxlSourceFor(src: string) {
  return src.replace(/\.webp$/, ".jxl")
}

type PictureProps = ComponentProps<"img"> & {
  src: string
  priority?: boolean
}

export function Picture({
  src,
  alt,
  priority = false,
  ...props
}: PictureProps) {
  return (
    <picture>
      <source srcSet={jxlSourceFor(src)} type="image/jxl" />
      <img
        {...props}
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  )
}
