# Platform icon sources

These raster assets are used only to identify the operating-system download
choices.

- `windows.png` — raster Windows logo from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Windows_logo_-_2012.png). Original work by Microsoft; the Commons file page notes public-domain text-logo status and possible trademark restrictions.
- `macos.png` — rasterized preview of the [Apple logo](https://commons.wikimedia.org/wiki/File:Apple_logo_black.svg) from Wikimedia Commons. Original design by Rob Janoff; the Commons file page notes public-domain status in the United States and possible trademark restrictions.
- `linux.png` — [Tux](https://commons.wikimedia.org/wiki/File:Tux.png) by Larry Ewing. Permission to use or modify the image is granted with attribution to Larry Ewing (`lewing@isc.tamu.edu`) and The GIMP.
- `linux-vector.png` — vector-like Tux artwork generated from the supplied visual reference for this site’s download selector.
- `linux-vector-blue.png` — earlier two-tone blue variant generated from `linux-vector.png`.
- `linux-vector-hover-light.png` — transparent blue overlay containing only the light source regions of the artwork. The selector uses it as the alpha mask for the normal and interactive states so the dark inner layer reveals the page background.
- `linux-vector-hover-dark.png` — alternate transparent blue hover overlay containing only the dark source regions of the artwork; it is not used by the current selector.

The downloaded PNGs were cropped to their visible bounds and resized only when
larger than 640 pixels. Original platform colors, transparency, silhouettes, and
proportions were preserved; edge-connected white backgrounds were removed from
the Windows and Tux source rasters without redrawing either mark.
