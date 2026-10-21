# Voyage surface · 奇想宇航局

Recorded: 2026-10-21. Scope: ordinary extension of the existing V3 world; source-extracted after implementation. This brief supplements `DESIGN.md`; it does not replace its identity or token authority. The owner delegated design choices and authorized the existing public biography/contact exception. No personal configuration is copied here.

Primary target: `dist/voyage.js`. Related targets: `dist/voyage-ui.js`, `dist/voyage-model.js`, `dist/voyage.css`, `dist/star-forge.js`.

## Direction contract

**THESIS:** Real projects become an authored orbital atlas, and the visitor can make a deterministic small planet. The original botanical town remains the homepage and return destination. This is a working scene with direct controls and project links, rather than a screenshot of an imagined tool.

**OWN-WORLD:** Inherit the incumbent pine night, warm text, soft sage and restrained apricot roles; inherit locally served Outfit/ShugeSans and Chinese fallbacks. Use hairline navigation, small rectangular controls, circular/orbital marks, and geometry for depth. The atlas and forge remain night scenes even when the town is in daylight.

**STORY:** Enter from the town, select one of seven real projects, then follow its live/source link. Switch to forge, name a planet, choose reef/mineral/halo, regenerate its seed, and save an illustration or copy a reproducible link. Returning home restores the existing town experience.

**FIRST VIEWPORT:** Desktop places the title and selected project/forge controls on the left, real 3D across the center/right, project choices along the right, and motion control below. At 760px and below, the header and mode tabs lead, the scene occupies the middle, and the task controls sit above the footer; atlas choices scroll horizontally. The primary forge action is the apricot save button.

**FORM:** An interactive orrery plus a small creation desk, extending the established world. Seed key: not applicable; no concept roll was run for this delegated ordinary extension. This record describes the implementation, not a preapproved image comp.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

The existing `DESIGN.md` satisfies the inherited-world document role. The separate finish review owns its verdict; this source record does not certify pixels or physical-device experience.

## Overview

Visitor modes are Experience for the atlas and Operate for the forge. The memorable moment is moving from other people's reachable work to a named, reproducible planet of one's own. A scene failure returns to readable town content; project access retains HTML controls and links.

## Colors

The five local `--v-*` variables alias the same source values as incumbent `sky`, `text`, `soft`, `accent` and `sage`. The primary save button also reuses `primary-ink` and `accent-hover` values. Transparency variants provide the scrim, hairlines and projected labels.

The three planet families have scoped material palettes in `star-forge.js`: reef favors teal/sage, mineral introduces pale crystalline tones, and halo uses warm mineral/ring tones. Their deterministic palette variants and the atlas lights/core are scene materials, not new global UI semantic tokens. No new global palette is declared here.

## Typography

Use the existing local ShugeSans face and fallback stack. Voyage functional text starts at 12px; most controls and explanatory copy use 12–14px. Its fluid display heading, compact wordmark and selected-project title are local surface roles. The 13px/17px steps already occur in the incumbent code and prose; linting only the root frontmatter does not describe the full inherited ramp.

## Layout

Voyage is a fixed `100dvh` overlay. It inherits desktop gutters/easing; local layouts cover 1150px, 760px and 370px widths, with additional 830px/670px desktop-height and 730px mobile-height adjustments. Copy is reduced on short screens while task controls remain. No safe-area inset or virtual-keyboard layout has been established by this source record.

New controls generally declare a minimum height of 44px; the input and primary action are at least this tall. Minimum height alone does not establish a 44×44px target, particularly for the icon-only close control on very narrow screens. Verify actual bounds before making a blanket target-size claim.

## Elevation & Depth

Real WebGL geometry, vertex colors, light, atmospheric backdrop and authored orbital placement carry depth. The DOM layer uses scrims and hairlines without a new card-shadow system. The orrery is authored animation, not an astronomical simulation.

## Shapes

Keep orbital/circular marks, small corner radii, rectangular project choices and an underlined naming field. Reef, mineral and halo have different geometry/material structures. The mobile project strip is a navigation adaptation; it does not replace the town's editorial work rows with global cards.

## Components

Atlas provides seven native project choices, projected labels, a selected-project summary and ordinary external links. Forge provides a labeled name field, three pressed-state form choices, a visible seed, regeneration, save and copy actions, plus a manual-copy field when clipboard access fails. The PNG is a deterministic 2D commemorative illustration, not a capture of the current WebGL camera.

Voyage is a modal dialog while open: background town/header are inert, focus moves to the heading, Tab wraps within visible controls, and Escape returns home. Arrow keys rotate the focusable scene; `+`/`-` change zoom. These are source-defined behaviors; assistive-technology acceptance is separate.

Reduced-motion initializes time-driven motion paused, removes entry/transition animation, and uses immediate camera interpolation. Explicit continue remains available. The preference is sampled at initialization; live OS preference changes are not subscribed to. Paused or hidden scenes avoid idle rendering, and the town stops its rendering loop while Voyage is open.

## Do's and Don'ts

- **Do** retain the existing palette roles, local font, visible selection states, direct project links and return path.
- **Do** preserve seed/kind determinism independently of the editable name; shared links carry seed, kind and title.
- **Do** identify the downloadable PNG as a seed illustration and separate runtime evidence from pixel/device review.
- **Don't** promote this overlay's composition or scene material palettes into a replacement global identity.
- **Don't** equate a ready WebGL context, DOM dimensions or CPU checks with a finished visual/device review.

Unresolved acceptance: screenshot-based visual hierarchy/material inspection, physical-phone drag/touch, virtual keyboard and safe-area behavior, and measured smoothness. See `evidence/voyage-design-check.md` for the evidence boundary.
