# SHUGE Odyssey status

## V3.1 Voyage extension — 2026-10-22

Baseline: verified origin/main `18190c288bda0ae7c21666cd09b6c49f6552939c`; this update targets only `ndshuge/shuge-odyssey`. V1, V2 and the GitHub profile remain separate.

Implemented: seven-project 3D orrery with direct/project-list selection; deterministic reef/mineral/halo star workshop; naming, regeneration, local last-star storage, reproducible URL sharing including seed zero, and 1600×1000 PNG illustration download. Existing town, six readable destinations, projects, contacts and both labs remain. New renderer is created on first entry, reused afterwards; inactive worlds skip rendering. Stable pause and hidden-document behavior are covered separately from GPU-performance claims.

Local verification: 11 owned JS syntax checks; 14 original-scene CPU checks; 18 forge CPU checks; 13 voyage CPU checks; 44 static/local-HTTP checks. Independent source/CPU review found no remaining blocking finding in its reviewed snapshot. Design inheritance was documented without replacing the incumbent global system. Browser observations and limits: `evidence/voyage-browser.json`; review: `evidence/voyage-review.md`; surface record: `.impeccable/surfaces/voyage.md`.

Release state: V3.1 successfully deployed at https://ndshuge.github.io/shuge-odyssey/ from source commit `fd5aad9b9e87abdceeb045152154fa496e8b457b`. GitHub Actions run `39696451625` completed successfully, including all CPU/static checks and the Pages deployment. All 14 checked production resources returned HTTP 200 and matched their exact committed Git blobs. Receipt: `evidence/voyage-release.json`. Upstream V2 main remains `bf8a3a78921599799f172a42d4b5704b07d48963`.

Production browser opening on 2026-10-22 timed out; the earlier local browser observations remain the runtime evidence. No production screenshot or physical-device performance claim is made. Screenshots, actual phone touch/keyboard and measured frame rate are the remaining acceptance limits.

## Previous V3 release record

Updated: 2026-10-20 (Asia/Shanghai).

Goal: publish a more ambitious independent third edition at ndshuge/shuge-odyssey. Baseline: read-only upstream shuge-little-universe bf8a3a7. Old GitHub Pages, GitHub profile and ChatGPT Sites are not deployment targets. Upstream push URL is disabled locally; only new origin is writable.

Implemented: pine/porcelain/apricot interface; richer authored architecture with rounded geometry; instanced vegetation and wind; atmosphere, animated water and portal shaders; bloom preserving destination alpha; camera arrival and district targeting; drag inertia with direct held-pointer updates; manual/automatic quality choices. Readable personal pages, exact owner-authorized contacts, all seven works, both creative labs and classic remain.

Validation: syntax passed for 7 owned JS modules; 39 static/local-HTTP checks passed; 14 actual-Three CPU checks with replacement renderer/compositor passed. Geometry: 318 mesh objects, 44,541 unique vertices, 118,070 draw-expanded triangles. This is a construction budget, not measured GPU performance. Reports: evidence/odyssey-preflight.json and odyssey-scene-cpu.json.

Independent review: three material findings (bloom alpha, panel focus contrast, inaccurate wheel instruction) fixed in one batch and rescored resolved. Diagnostic properties explicitly refer to the final postprocessing pass. Review disposition covers source fixes only. Finesse's isolated-CSS missing-engine finding was reviewed as a false positive; actual renderer, compositor and animation loop are present. Old design-token warnings compare against the V2 documentation snapshot; DESIGN.md and the machine-readable design sidecar have since been refreshed.

Verification limit: current Cua browser bindings repeatedly timed out. No V3 browser screenshot, GPU compilation, desktop/mobile visual approval, real touch or frame-rate evidence has been obtained. Historical V2 evidence is not V3 acceptance. No browser security workaround was used.

Release: deployed successfully at https://ndshuge.github.io/shuge-odyssey/ from commit a44e8b779e7a6afd0b5d24e06a04590a8da65f12. GitHub Actions run 39349764176 completed successfully, including syntax, CPU, Linux HTTP and Pages stages. All 8 checked production resources return HTTP 200 and match their exact deployed Git blob SHA-256. Receipt: evidence/odyssey-release.json. Repository: https://github.com/ndshuge/shuge-odyssey .

Next action: obtain an actual browser/GPU and physical-phone visual/interaction acceptance pass at the new URL when the browser channel is available. Publication is complete; this visual acceptance gate remains open.
