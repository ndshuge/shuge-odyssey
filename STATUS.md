# SHUGE Odyssey status

Updated: 2026-10-20 (Asia/Shanghai).

Goal: publish a more ambitious independent third edition at ndshuge/shuge-odyssey. Baseline: read-only upstream shuge-little-universe bf8a3a7. Old GitHub Pages, GitHub profile and ChatGPT Sites are not deployment targets. Upstream push URL is disabled locally; only new origin is writable.

Implemented: pine/porcelain/apricot interface; richer authored architecture with rounded geometry; instanced vegetation and wind; atmosphere, animated water and portal shaders; bloom preserving destination alpha; camera arrival and district targeting; drag inertia with direct held-pointer updates; manual/automatic quality choices. Readable personal pages, exact owner-authorized contacts, all seven works, both creative labs and classic remain.

Validation: syntax passed for 7 owned JS modules; 39 static/local-HTTP checks passed; 14 actual-Three CPU checks with replacement renderer/compositor passed. Geometry: 318 mesh objects, 44,541 unique vertices, 118,070 draw-expanded triangles. This is a construction budget, not measured GPU performance. Reports: evidence/odyssey-preflight.json and odyssey-scene-cpu.json.

Independent review: three material findings (bloom alpha, panel focus contrast, inaccurate wheel instruction) fixed in one batch and rescored resolved. Diagnostic properties explicitly refer to the final postprocessing pass. Review disposition covers source fixes only. Finesse's isolated-CSS missing-engine finding was reviewed as a false positive; actual renderer, compositor and animation loop are present. Old design-token warnings refer to V2 documentation, now being updated.

Verification limit: current Cua browser bindings repeatedly timed out. No V3 browser screenshot, GPU compilation, desktop/mobile visual approval, real touch or frame-rate evidence has been obtained. Historical V2 evidence is not V3 acceptance. No browser security workaround was used.

Release: new public repository created at https://github.com/ndshuge/shuge-odyssey . Source push and Pages deployment pending.

Next action: push reviewed main to new origin, enable GitHub Pages Actions, verify successful run and matching deployed resource hashes, then record release receipt.
