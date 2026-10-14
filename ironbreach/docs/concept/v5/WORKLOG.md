# Iron Rift V5 worklog (request 2026-10-01 17:05)

Request: publish V4 (DONE 17:27); replace arena with realistic
shipping containers, cranes, wet concrete; fix Sentinel gun leftovers; enable robots in Deathmatch.
Use generate_image for concepts/refs and generate_3d_model (Tripo) for models.

## Concept / refs (generate_image, default model, 17:30)
- docs/concept/v5/01-port-arena.jpg — target look: wet dark concrete slabs w/ expansion joints, puddles,
  faded yellow lane lines + bay numbers (e.g. "B3"), weathered ribbed 20/40ft containers (red, blue, green,
  grey, orange) stacked 2-3 high w/ stencilled codes (no logos), RTG crane straddling a row (midground, "12",
  "S.W.L. 40T"), STS cranes + container ship silhouette on quay behind, drizzle, mist, sodium masts, warm sun.
- .asset-src/v5/ref_sentinel_clean.png (empty hands A-pose), ref_sts_crane.png, ref_reach_stacker.png, ref_rtg_crane.png

## Plan
1. Tripo: sentinel_clean, sts_crane (backdrop), rtg_crane (in-arena landmark, legs collide), reach_stacker (cover).
2. Sentinel: rig-transfer onto .asset-src/v3chars/sentinel.glb proxy (STRIP no longer needed).
3. Arena "Kestrel Terminal" in arena.ts: keep 80x80 footprint + spawns/pickups/props/nav approach;
   - perimeter = stacked 40ft containers (instanced, ribbed geometry), gaps blocked
   - procedural ribbed ISO containers (corrugated sides, doors, lock rods, corner castings, stencil decals via canvas)
   - wet concrete: slab joints, lane lines, bay numbers decals, puddles (low roughness patches, restrained)
   - RTG Tripo crane straddling central row, reach stacker cover, STS cranes + ship backdrop on north quay, water plane
   - drizzle rain VFX + puddle ripples (quality-gated)
4. Deathmatch: ensure stage with sentinel before DM start; give 2 of 5 DM bots the sentinel look.

## 17:37 status
- DONE DM robots: game.ts ensureDmSentinels() (slots 2,4 WRAITH/NOVA -> sentinel look, ids 900+i) at start('deathmatch'); also swaps during countdown if stage 2 lands late.
- DONE Sentinel: Tripo .asset-src/v5/models/sentinel.glb -> rig transfer onto .asset-src/v3chars/sentinel.glb -> public/assets/v4chars/sentinel.glb (962KB, no gun spikes, verified walk render). Old copy /tmp/sentinel_v4.glb.
- Tripo props (1.44M tris each) -> scripts/build-v5-props.sh -> public/assets/v5props/{rtg_crane,sts_crane,reach_stacker}.glb
  Normalized bounds (max axis=1, centred origin): rtg [x.475,y.97,z1] span along z; sts [x.31,y.88,z1] boom along z; stacker [x1,y.62,z.37] length along x.
- Texture: Poly Haven CC0 concrete_floor_03 -> public/assets/tex/concrete_floor_03_{diff,nor,arm}.webp (need add to TEXTURE_SETS).
- Layout plan: quay (fence + apron + STS cranes + water + ship) on +z (sun side, backlit); container walls 3-high on -z,±x;
  RTG scale 26 rotated so span along x straddling central platform (legs x≈±12.5); remove pillars (±14,±14) and I-beams;
  reach stacker s≈12 at (-27,3) rot90 & point-symmetric (27,-3) replacing jersey barriers at (∓27.5,±5.5).
- applyGrime(m,{amount,scale,wet,foot}) in library.ts owns onBeforeCompile (vGrimeW world pos, puddle via fbm). Wet yard = extend it with markings map.
- 17:39 collider slices (normalized, from Tripo src): RTG all x±.238 y±.485 z±.5; end frames |z| .38-.5 (legs x ±(.0-.215), y -.369..+.242); bogies |z| .38-.454 y -.485..-.388 x ±.238.
  Stacker: chassis x[-.45,.36] y[-.311,-.02] z±.183 (spreader/boom end at +x). STS: base legs z[-.05,.30] -> OUTREACH at -z (rotate pi so it points +z to water).
- Placement: RTG s=26 rotY=pi/2 (span along world x, end frames x ±9.9..13, z ±5.6), y=12.61. Move crates (±9.3,∓3.5) -> (±8.6,∓8.2)-ish.
  Stacker s=12 at (-27.5,4.5) rotY pi/2 and (27.5,-4.5) rotY 3pi/2 replacing jersey at (∓27.5,±5.5).
  Quay +z: fence z=40, apron to z=86, STS s=80 at x=-55,0,55 origin z=78 rotY=pi, water y=-2.5 beyond z=86, ship hull z 92..124.

## 18:05 — integration results
- `src/game/arena.ts` rewritten as **Kestrel Terminal** (Foundry walls/pillars/I-beams/towers removed). Public API unchanged.
  Container walls W/S/E (7 × 40 ft columns, 3–4 tiers, one collider per wall), open north fence (z = 40) with chain link,
  apron + STS rails, quay wall/fenders/bollards, dark animated water, procedural container ship + ~600 instanced deck boxes,
  instanced backdrop stacks with two idle RTGs, 4 high-mast floodlights (unlit panels), 2 sodium pole lights (the only point lights).
- Wet yard shader (`wetYard`, chained after `applyGrime`): canvas mask (R yellow / G white paint, B joints/cracks/oil), paint wear,
  puddles (rough 0.14, flattened normals), rain ripples in puddles only. Drizzle = 3200 camera-following line streaks,
  scaled by quality (low 0 / medium ~60% / high 100%).
- RTG (stage 1, central, colliders = bogies + 4 legs), reach stackers at (∓27.5, ±4.5) (chassis colliders), STS ×3 streamed in
  stage 2 via `StageLoader` → `arena.attachSts()` (no colliders). Crates moved off the RTG end frames.
- Texture sets: + concrete_floor_03 (lossy WebP, 610 KB total), − hangar_concrete_floor, − painted_metal_shutter.
- Size: boot ceiling 22.1 MB / total 28.3 MB; budget raised to 22.5 / 28.5 with rationale in `scripts/check-size.mjs`.
- Verified in Playwright (swiftshader): DM countdown swaps WRAITH/NOVA to Sentinels (ids 900+), clean mesh in play; STS streamed in.
- User request mid-V5: low-health blur → bloody vignette. Grade shader: aberration fades with lowHealth, desat 0.55 → 0.12,
  new noisy blood rim that pulses and closes in; CSS `.lowhp` overlay reduced to 0.35.
