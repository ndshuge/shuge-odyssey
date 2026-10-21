# Voyage design inheritance check

Date: 2026-10-21. Baseline HEAD at inspection: `18190c2`. Method: source extraction and comparison with existing `DESIGN.md`, `.impeccable/design.json`, `PRODUCT.md`, and baseline `git show HEAD:dist/town.css`. This check writes only this report and `.impeccable/surfaces/voyage.md`; it does not modify the production code or global design documents.

## Conclusion

Voyage extends the incumbent V3 pine/porcelain/apricot world coherently at source level. It preserves the town, local font, principal UI color roles, ordinary links and motion controls. The atlas/forge composition, display sizes and scene palettes are intentionally scoped additions. Source-level inheritance is documented; a visual finish verdict remains separate.

| Area | Observed source | Assessment |
| --- | --- | --- |
| Identity | Existing town retained; Voyage is an enter/return overlay | Ordinary extension; no new global brand required |
| Main palette | `--v-sky/text/soft/accent/sage` match incumbent values; save action matches existing dark ink and hover accent | Inherited; alpha variants are local layers |
| Typography | Local `fonts/outfit.woff2` through ShugeSans, existing Chinese fallbacks, Voyage functional text ≥12px | Inherited family/floor; display roles extend locally |
| Components | Native controls, underlines/hairlines, restrained radii, apricot primary action | Existing vocabulary continues; no card-shadow system added |
| Scene | Real orbit geometry, seven project bodies, three deterministic planet families | Scoped scene material extension; not an astronomy simulation |
| Responsive | 760px and 370px width transitions; desktop/mobile height adjustments; horizontal mobile project strip | Defined in source; physical-device acceptance outstanding |
| Control size | Most new controls explicitly have min-height ≥44px | Does not prove every hit target is 44×44px; narrow close width needs checking |
| Reduced motion | Initial pause; no overlay entry/transition animation; immediate camera interpolation; explicit continue | Supported at initialization; live preference changes are not subscribed to |
| Reading/access | Modal focus loop, inert background, Escape/return focus, ordinary project links, live status | Implemented in source; screen-reader usability not certified |
| Export/share | 1600×1000 2D illustration; seed/kind/title query parameters; manual clipboard fallback | Illustration is not a WebGL screenshot; no raster capture provenance is implied |

## Existing documentation drift

- Root `DESIGN.md` and sidecar still state the earlier V3 browser timeout / visual-unverified state. That accurately records their original pass, but it does not describe the newer local IAB session reported below. They were preserved because this is an ordinary extension with a bounded documentation scope.
- Several existing 13px/17px usages are described in root prose but absent from the machine-readable typography roles. Baseline `town.css` already contains those sizes. Current lint advisories for these steps do not establish a new Voyage regression.
- The baseline already contains colors such as the skip-link surface, identity slash and secondary-link border that are not fully represented in root primitive roles. The current lint report flags these incumbent values as well. This pass records the distinction rather than broadening the global palette or rewriting unrelated code.
- Voyage-specific fluid heading sizes, 5px primary-action radius, scene palettes, light colors and alpha layers are local departures from exact root token values. They are recorded in the surface brief and source; they have not been silently declared new global tokens.

The untouched global document hashes at inspection were:

```text
DESIGN.md                2366B4C289A257F34555061A3426CF795E972D56E5E449FF9E0E1A5A2AC0123B
.impeccable/design.json   E6DD49E46120ED7CC11D4209ABBACCE65FD940E6D4D9F8B95C29757985924FB6
```

## Evidence actually available

1. **Inspected here:** the five new Voyage modules/styles, relevant incumbent CSS/HTML/engine integration, global design documents, baseline source, and the saved check reports. This is source/documentation evidence.
2. **Saved local check reports:** `voyage-cpu.json` records 13 passing CPU/lifecycle checks using renderer/DOM stubs; `odyssey-preflight.json` records 43 static/local-HTTP checks. Neither is pixel, real-shader, phone-touch or production-host evidence.
3. **Lint output:** `voyage-finesse.json` reports no P0 and one missing-build-stamp P2. `voyage-impeccable.json` contains palette/type advisories and incumbent findings. These reports are heuristic checks, not a finish approval.
4. **Reported by the coordinating agent in this run:** real local IAB DOM/runtime checks at 1280×720, 390×844 and 320×640; WebGL ready, all three planet materials reached, no observed console errors. This documenter did not independently drive those browser checks. A persistent browser evidence file should carry their detailed observations when available.
5. **Unavailable:** the browser screenshot interface failed. No new screenshot in this report proves the final composition, lighting, antialiasing, material beauty, contrast under actual pixels or obstruction-free interaction. Historical V2 screenshots do not stand in for Voyage evidence.

No physical phone, hardware touch, mobile virtual keyboard, display cutout/safe area, screen-reader, measured FPS, production publication or hosted browser acceptance is claimed here. The independent finish review owns its own findings and verdict; this report does not preempt it.
