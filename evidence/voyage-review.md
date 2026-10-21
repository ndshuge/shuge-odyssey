# Voyage independent review

Date: 2026-10-21 (Asia/Shanghai). Scope: `dist/voyage.js`, `voyage-model.js`, `voyage-ui.js`, `voyage.css`, `star-forge.js`, plus the new suspend path in `odyssey.js` and its interaction with `town-ui.js`.

Disposition: no remaining release-blocking source or CPU finding was identified in the reviewed snapshot. This is **source and CPU disposition**, not visual, browser accessibility-tree, GPU-performance, physical-touch or publication acceptance. The reviewer made no production-file edits and no commit.

## Findings and disposition

| Finding | Concrete cause and effect | Current disposition |
| --- | --- | --- |
| P2: global motion control initially updated the Voyage button without updating its renderer state | A homepage pause followed by opening Voyage could leave a “resume” label over a moving scene. | Fixed: `voyage.js:23` synchronizes from the UI on mode change and `voyage.js:38` listens for `shuge:motion`. Independently passed the stable-renderer-stop CPU assertion. |
| P2: projected atlas labels initially had no positioning CSS | Labels appended after a full-height canvas participated in ordinary flow, then received positive projected transforms. The intended scene labels could fall outside the scene. | Fixed in current source: `voyage.css:6-9` provides an absolute inset layer and absolute interactive labels. Real DOM/pixel placement must be assessed separately. |
| P2: returning from Voyage on a hash/history change initially closed the newly routed content panel | Town's hash handler could open `#contact` before Voyage's handler called `applyMode('home')`, which then unconditionally hid `#panel`, leaving the URL and visible content inconsistent. Clearing a shared URL's hash through `replaceState` also needed to refresh town accessibility state. | Fixed in current source: `voyage.js:24-27` closes the panel only on entry, and dispatches `shuge:reset-route` when clearing a hash; `town-ui.js:23` reruns its real route/accessibility handler. This disposition is source-based; a real browser Back regression remains separate evidence. |
| P3: renaming rebuilt the same geometry on every keystroke | Title does not affect the 3D planet, so repeated disposal/reconstruction was unnecessary CPU/GPU resource churn. | Fixed at `voyage.js:60`: equal seed/kind returns early. Independently verified that a name-only event creates no replacement planet. |
| P3: asynchronous postcard filename could use a newer seed | The canvas was drawn synchronously but the `toBlob` callback read mutable `seedState`, so a quick reroll could mismatch the PNG's printed seed and its filename. | Fixed at `voyage.js:41-42`: one snapshot feeds drawing and filename. Source disposition; no download/pixel claim. |
| Resource ownership check: atlas hit-target meshes | These child targets are outside `createSeedPlanet`'s owned geometry/material sets. They must be disposed before planet disposal clears its children. | Current `voyage-model.js:40` explicitly disposes target geometry/material first. A two-project CPU event probe observed exactly 2 target geometry and 2 target material disposal events. |

## Independently executed verification

- `node scripts/check-syntax.cjs`: passed, 11 owned modules.
- `node scripts/check-forge.mjs`: passed, 18 checks. Covers deterministic geometry/palettes, finite data, per-kind geometry budgets, shader-source construction, exact once-only disposal of each planet's owned resources, and deterministic 2D postcard drawing commands. It does not compile a GPU shader or inspect PNG pixels.
- `node scripts/check-voyage.mjs`: passed, 13 checks. Covers seven-project orbital construction, selection, lazy renderer allocation, mode changes, pause/resume, hidden-document stop, return-home stop, and renderer reuse. This script uses renderer/DOM stubs.
- Temporary in-memory Voyage harness using the actual Three model modules and a renderer/UI/DOM stub: passed 8 checks. Confirmed lazy rendering; atlas construction; global pause settles with no further render calls; name-only changes do not rebuild; `document.hidden` stops rendering and visibility resumes; home stops rendering; `?seed=0&kind=mineral&star=零号` overrides a valid saved star and opens the forge with the exact state; an out-of-range seed preserves the saved state.
- Temporary adaptation of `check-odyssey.mjs`, suppressing its normal evidence-file writer: passed 17 checks (14 existing + 3 lifecycle assertions). Confirmed the original compositor stops while Voyage is open, resumes on home, and stops/resumes for document visibility. This is an observed stub-compositor call count, not measured GPU utilization.
- Two-project atlas target disposal event probe: 2/2 geometry and 2/2 material events, empty atlas group after disposal.

## Other reviewed boundaries

- `voyage-ui.js:75-123` provides modal visibility/inert state, remembered return focus, Escape, and a Tab loop. `voyage.js:30` protects the town and header while the modal is open. The native project list provides a complete alternate selection route even when projected labels are culled. This establishes source intent; a screen reader and keyboard browser pass remain useful acceptance work.
- User-controlled star names are applied through text nodes/input values or Canvas text. Shared URLs use `URLSearchParams`. No new network upload, external texture request or unsafe name interpolation was found in the reviewed feature path.
- `createSeedPlanet.dispose()` releases geometry, materials, instanced-mesh state, detaches the group and is idempotent. Postcards use a separate temporary 2D canvas and revoke their object URL after use; they do not allocate new Three geometry. The postcard is explicitly labeled a seed-generated illustration rather than a WebGL screenshot.
- Both animation loops retain requestAnimationFrame callbacks, but return before scene/compositor rendering when their view is hidden. Stable pause also stops rendering after camera interpolation settles. These checks prove render-call suppression, not zero browser CPU or released WebGL contexts.
- Responsive and reduced-motion rules were inspected in source. This reviewer did not capture browser screenshots, measure real layout, inspect visual overlap or establish a frame-rate result. Browser metrics or GPU observations obtained by the main task belong to that task's separate evidence.

## Reviewed source fingerprints

These identify the source snapshot for the final read; any later edits require scoped revalidation.

| File | SHA-256 |
| --- | --- |
| `dist/voyage.js` | `0F35B9682C1546143F54FB623CE746F5BB7AA699CD6B63C4050CD549C7E4CB46` |
| `dist/voyage-model.js` | `56847AE26E444C5E1B420982E6062860A3EB96F0AF464A73BFAE7EDF44A92D4D` |
| `dist/voyage-ui.js` | `A253B31FBE27C26AEFC8017975AC4B69336DAAD3E3F98F1A6A822724EE6828B3` |
| `dist/voyage.css` | `AE06CF53BA00040D7AB70914484AD6EF3E64724A2C9507A8A127484DB53B5033` |
| `dist/star-forge.js` | `F7909F71F0A2EE33C4780E9F2E1348A2F1FC34E82A906AD00D4DB20C8EB8E7C1` |
| `dist/odyssey.js` | `EC78F31E2D7451D20889EBA4EA1E1B592EA8200FD806EE7F033672721B9877DD` |
