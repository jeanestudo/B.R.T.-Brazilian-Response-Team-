# Iron Rift V3 — Implementation Plan (concept revamp completion)

Status baseline: `1feb9e2` (local, push pending: Webdev addon recovery). Already shipped in that commit:
Tripo PBR first-person weapons + gloved arms, explosion performance round 2, concept art in `docs/concept/v3/`.

This plan completes the V3 concept (see `docs/concept/v3/01..05`): a modern-military arena shooter where
masked human operators and Unitree-style robots fight the player, with hyper-real PBR assets, new audio,
and new sharing artwork. Engine, game modes, AI, scoring and staged loading stay as they are.

## 1. Enemy roster (concept sheet 02)

| Concept unit | Replaces | Mode / role | Asset | Held weapon | Clips |
|---|---|---|---|---|---|
| OPERATOR (masked rifleman) | Scrapper (xbot) | Onslaught wave 1+, Deathmatch bots | `v3chars/operator.glb` 1.73 m | Tripo M4 (reuse `vm/rifle.glb`) | idle / walk / run |
| BREACHER (masked heavy, shotgun) | half of the Scrapper pool + DM bots | close-range pressure | `v3chars/breacher.glb` 1.81 m | Tripo M870 (reuse `vm/shotgun.glb`) | walk / run (idle = frozen walk frame) |
| SENTINEL (humanoid robot) | Juggernaut (xbot + armour kit) | heavy, minigun | `v3chars/sentinel.glb` 1.97 m | procedural minigun (kept) | idle / walk / run |
| WARDEN (boss mech) | Titan | boss wave | `v3chars/warden.glb` 3.0 m | procedural cannon (kept) | walk (idle = frozen frame, slow walk) |
| HOUND (robot dog + turret) | Hornet drone | flanker, stage 2 | Tripo `hound` mesh, rigid-segment rig | turret plasma bolts | procedural trot gait |

Engineering:
1. `robot.ts`: `RobotLook` gains `operator | breacher | sentinel | warden`. A per-rig bone-name table (Meshy:
   `Spine02/Spine01/Spine/neck/Head`, XBot: `Spine/Spine1/Spine2/Neck/Head`). V3 looks keep the Tripo PBR
   material (no paint override / armour kit), use a height-based scale, skip finger curl (Meshy rigs have no
   fingers) and keep IK, spine twist, recoil, flinch and procedural death.
2. Held guns: build from the already-loaded viewmodel GLBs (no extra download), grips/muzzle from the
   measured Tripo coordinates.
3. `stages.ts`: Operator + Breacher load with stage 1 (first wave), Hound stage 2, Sentinel stage 3, Warden
   stage 4; XBot and the photogun rifle are dropped once nothing references them (budget win ~2.1 MB).
4. Materials: humans take `human_hit` / `human_death`, dark blood-mist puffs instead of sparks; robots keep
   metal sparks, `robot_hit` / `robot_death`.
5. Hound (`hound.ts`): same public API as `Hornet` (spawn/hide/takeDamage/update/render/collider) so
   `game.ts` swaps the class. The Tripo mesh is split into torso + 4 × (thigh, shin) rigid segments by
   vertex region and driven by a procedural trot (diagonal pairs, stride from speed), turret yaw/pitch
   tracking and plasma bolts reusing the drone projectile path. Death: collapse + sparks + small blast.

## 2. Props and projectiles (concept sheets 01, 03)
- Armour pickup item → Tripo armour plate; grenades → Tripo M67 frag; rocket already Tripo.
- Cover: Tripo jersey barriers and sandbag walls placed as extra cover with box colliders (nav bake picks
  them up automatically).

## 3. Audio (all new)
- Replace all 53 SFX and 3 music tracks with the V3 set in `/home/ubuntu/v3src/audio` (ElevenLabs SFX,
  Lyria 3 Pro music), loudness-normalised (SFX peak -1 dBFS, music −16 LUFS) and re-encoded (SFX mono 96 kbps,
  music stereo 128 kbps). Add `human_hit`, `human_death`, `hound_step` samples.

## 4. Look and presentation
- Reduce environment glare: lower env-map intensity on arena metals, trim emissive/specular hotspots.
- Sharing: game-specific favicon, OG cover (1200×630) and refreshed loading/title art from the V3 key art,
  via the game-sharing flow.

## 5. Validation and release
- `tsc`, 31 unit tests, production build within budget, two-mode smoke test, explosion bench
  (`scripts/fxbench.mjs`), in-game screenshots of every enemy (idle, walk, fire, death).
- Commit as one V3 checkpoint on top of `1feb9e2`, push to `main` when the addon is available
  (auto-publish), verify the checkpoint is recorded and the live URL serves the new build.

## 6. Completion status

| Item | Status |
|---|---|
| Roster: Operator, Breacher, Sentinel, Warden (Meshy rigs + Tripo PBR), Hound (rigid-segment trot) | Done, verified in-game (idle, walk, fire, death) |
| Held guns from viewmodel GLBs; human vs robot hit/death feedback | Done |
| Stage streaming per character; XBot, photogun, Hornet removed | Done |
| Props: Tripo armour plate pickup, M67 frag, 4 jersey barriers + 4 sandbag walls with colliders | Done |
| Audio: 56 SFX (loudness-matched to the old mix, `scripts/import-v3-audio.py`) + 3 music tracks | Done |
| Weapon names: M4 Carbine, M870 Breacher, RPG-X Launcher | Done |
| Glare pass: painted-steel containers, restrained wet floor, lower env / emissive | Done |
| Sharing: new favicon, OG cover, loading and title art; V3 description | Done |
| Validation: tsc, 31 unit tests, build within budget (boot ceiling 16 MB), two-mode smoke, fx bench | Done |
