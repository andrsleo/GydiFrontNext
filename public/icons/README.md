# PWA Icons

Generate these icon files for the GYDI PWA manifest.

## Required files

| File | Size | Format |
|------|------|--------|
| `icon-192.png` | 192×192px | PNG |
| `icon-512.png` | 512×512px | PNG |

## Design spec

- Background color: `#6C47FF` (GYDI primary — `hsl(252,100%,64%)`)
- Logo: GYDI wordmark or logomark in white, centered
- The 512×512 version is also used as the maskable icon — keep the logo
  within the safe zone (center 80% of the canvas)

## Quick generation

Use any of:
- Figma → export at 192×192 and 512×512
- https://realfavicongenerator.net (upload SVG, set background #6C47FF)
- `sharp` CLI: `npx sharp-cli -i logo.png -o icon-192.png resize 192 192`
