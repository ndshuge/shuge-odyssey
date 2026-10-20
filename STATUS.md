# SHUGE Odyssey status

Updated: 2026-10-20 (Asia/Shanghai).

Goal: publish a more ambitious independent third edition at ndshuge/shuge-odyssey. Baseline: read-only upstream shuge-little-universe bf8a3a7. Old GitHub Pages, GitHub profile and ChatGPT Sites are not deployment targets. Upstream push URL is disabled locally; only new origin is writable.

Implemented: pine/porcelain/apricot interface; richer authored architecture with rounded geometry; instanced vegetation and wind; atmosphere, animated water and portal shaders; bloom preserving destination alpha; camera arrival and district targeting; drag inertia with direct held-pointer updates; manual/automatic quality choices. Readable personal pages, exact owner-authorized contacts, all seven works, both creative labs and classic remain.

Validation: syntax passed for 7 owned JS modules; 39 static/local-HTTP checks passed; 14 actual-Three CPU checks with replacement renderer/compositor passed. Geometry: 318 mesh objects, 44,541 unique vertices, 118,070 draw-expanded triangles. This is a construction budget, not measured GPU performance. Reports: evidence/odyssey-preflight.json and odyssey-scene-cpu.json.

Independent review: three material findings (bloom alpha, panel focus contrast, inaccurate wheel instruction) fixed in one batch and rescored resolved. Diagnostic properties explicitly refer to the final postprocessing pass. Review disposition covers source fixes only. Finesse's isolated-CSS missing-engine finding was reviewed as a false positive; actual renderer, compositor and animation loop are present. Old design-token warnings compare against the V2 documentation snapshot; DESIGN.md and the machine-readable design sidecar have since been refreshed.

Verification limit: current Cua browser bindings repeatedly timed out. No V3 browser screenshot, GPU compilation, desktop/mobile visual approval, real touch or frame-rate evidence has been obtained. Historical V2 evidence is not V3 acceptance. No browser security workaround was used.

Release: deployed successfully at https://ndshuge.github.io/shuge-odyssey/ from commit a44e8b779e7a6afd0b5d24e06a04590a8da65f12. GitHub Actions run 39349764176 completed successfully, including syntax, CPU, Linux HTTP and Pages stages. All 8 checked production resources return HTTP 200 and match their exact deployed Git blob SHA-256. Receipt: evidence/odyssey-release.json. Repository: https://github.com/ndshuge/shuge-odyssey .

Next action: obtain an actual browser/GPU and physical-phone visual/interaction acceptance pass at the new URL when the browser channel is available. Publication is complete; this visual acceptance gate remains open.
