# Image Slots for Smart Termite Tulsa

Drop optimized images into this folder. Reference them in components as `/images/filename.webp`.

## Recommended image slots

| Slot | Suggested filename | Use |
|------|-------------------|-----|
| Open Graph default | `og-default.jpg` | Site-wide social share image (1200x630) |
| Hero background | `hero-tulsa-home.webp` | Optional hero illustration (1600x900) |
| Warning signs gallery | `sign-mud-tubes.webp`, `sign-wings.webp`, `sign-frass.webp`, etc. | Per-sign illustration on warning signs page |
| Inspection page | `inspection-walkthrough.webp` | Inspector at a Tulsa home (1200x800) |
| Treatment page | `treatment-barrier.webp`, `treatment-bait.webp` | Treatment approach illustrations |
| Prevention page | `prevention-mulch.webp`, `prevention-drainage.webp` | Prevention habit illustrations |
| Service areas | `area-tulsa.webp`, `area-broken-arrow.webp`, etc. | Optional area imagery |
| About page | `about-team.webp` | Brand image (do NOT use a stock "team" photo if it implies fake staff) |

## Sourcing rules

- **Royalty-free only.** Unsplash, Pexels, or paid stock you have a license for. Attribute where required.
- **No stolen images.** Never lift images from a competitor or a Google search.
- **No fake homes / fake people / fake reviews.** If an image implies something untrue (a fake inspector, fake award, fake address), don't use it.
- **Compress to under 200 KB.** Use WebP where possible. PNG only for transparent assets, JPG only when WebP isn't an option.
- **Descriptive alt text required.** Describe the actual content of the image, not keywords.
- **Realistic.** Pick images that show actual termite damage, mud tubes, crawlspaces — not generic "pest control mascot" stock art.

## Quick tools

- Compress: https://squoosh.app
- Convert to WebP: https://cloudconvert.com/png-to-webp
- Optimize batch: `npx @squoosh/cli --webp '{"quality":78}' *.jpg`
