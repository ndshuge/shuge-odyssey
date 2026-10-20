# Independent V3 source review

Scope: source and static/CPU evidence only. No actual V3 screenshot or GPU execution was reviewed.

Three material issues were found and fixed: stock bloom added alpha across the transparent scene; paper-panel focus outline had insufficient contrast; initial caption promised unsupported wheel zoom. The final source uses RGB additive/destination-alpha-preserving blending, dark ink panel focus and accurate button-zoom text. A real UnrealBloomPass material is included in the CPU assertion. Last-pass diagnostics are explicitly named.

Reviewer verdict: all listed fixes resolved in source; source pass at this scope. No visual/GPU/mobile acceptance implied. Historical V2 captures were excluded from evidence. The standalone-CSS detector missing-engine P0 was inspected and classified as a file-isolation false positive because the loaded module contains real WebGLRenderer, EffectComposer and animation-frame rendering.
