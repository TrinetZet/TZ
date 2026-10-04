# ClientBridge Android launcher icon

The navy field and mint brackets preserve ClientBridge’s existing `[↗]` identity. An ivory rising arrow conveys progress through better conversations. Rounded strokes remain clear at launcher sizes.

The 108 × 108 adaptive foreground places the entire mark inside the central 66 dp safe region. Android controls the final mask. Android 13 themed icons use the same geometry in a single color.

- `clientbridge-icon.svg`: scalable flat source, full background.
- `clientbridge-foreground.svg`: transparent vector foreground.
- `clientbridge-icon-512.png`, `clientbridge-icon-1024.png`: export artwork.
- `clientbridge-icon-preview.png`: launcher mask and size preview.
- `generate.py`: deterministic resource/export regeneration, requires Pillow.

Resources are in `app/src/main/res`: adaptive mipmaps for API 26/33, vector foreground/background/monochrome, and mdpi through xxxhdpi PNG fallback icons (48/72/96/144/192 px). `ic_launcher_round` shares the adaptive design and has circular legacy fallback artwork.
