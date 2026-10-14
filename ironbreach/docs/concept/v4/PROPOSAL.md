# Iron Rift: Onslaught — V4 "Hyper-Real" Concept Proposal

> Goal: turn the arena into a grounded, hyper-real, near-future firefight. Kai, a lone operator, holds a
> storm-lit container port against masked mercenaries, humanoid robots, robot hounds and powered
> exoskeletons. The combat loop is push-forward and readable. Armor recharges, so the rhythm is
> "engage → break contact → re-engage".

Concept images (generated with GPT Image):

| # | Image | Purpose |
|---|---|---|
| 1 | `01-gameplay-keyart.jpg` | Target look: first-person, storm-dusk port, hyper-real materials, restrained glare |
| 2 | `02-enemy-lineup.jpg` | Roster silhouettes: Wolf, Boar, Hound, Sentinel, Exo, Warden |
| 3 | `03-player-weapons.jpg` | Kai (East Asian male operator, multicam + ranger green) and the M4 / M870 / RPG-X |
| 4 | `04-hud-ui.jpg` | HUD: segmented cyan recharging armor over red health, style rank, wave banner |
| 5 | `05-vfx.jpg` | VFX language: sparks, dust, debris, shock rings, shield-shatter shards |

---

## 1. Reference analysis — what makes the genre fun

| Game | Loop / mechanic | Game juice we borrow |
|---|---|---|
| **Halo (CE → Infinite)** | Recharging shield over fixed health. It creates a roughly 30 s engage / retreat / re-engage loop, and the recharge delay scales with time-to-kill | An audible "shield down" alarm, a rising recharge whine and a visible bar refill are part of the loop itself |
| **Apex Legends** | Armor tiers drive TTK; breaking armor is a moment you can read | A distinct crack sound and colour flash on armor break; hit markers change colour on shield vs. flesh |
| **Call of Duty: Modern Warfare (2019)** | Fast TTK, tactile weapon handling | Layered gunshots (transient + mechanics + tail + LFE), environment-dependent tails, whiz-bys, bolt-lock on the last round |
| **DOOM Eternal** | Push-forward resource economy: aggression refills you | Kills spill pickups; hitstop and screen punch on big kills |
| **ULTRAKILL** | Style meter rewards variety and aggression | Rank letters slam in, the combo multiplier pulses, the meter decays with time |
| **Payday 2** | Masked crew identity; Bulldozer heavies with a faceplate weak point | Heavies telegraph through silhouette and sound; weak points crack visibly |
| **Titanfall 2** | Roster mixes humans, robots and mechs | Each class has a unique silhouette, footstep and hit sound |

**Takeaways for Iron Rift**

1. **Recharging armor** makes the arena a rhythm game of cover and aggression. A short delay (1 s) keeps it fast and arcade-y; health does not regenerate, so health and shard pickups still matter.
2. **Roster readability** comes from silhouette first: animal masks (organic, human), white humanoid robot (clean, mechanical), quadruped hound (low, fast), bulky exo (wide, slow), 3 m Warden (boss).
3. **Feedback on every layer**: world VFX, HUD particles, camera, audio and haptic-style hitstop must all react to the same event.

---

## 2. Player — "Kai"

- East Asian male, about 32. Multicam shirt, ranger-green plate carrier, comms headset, high-cut helmet and coyote gloves.
- First-person arms match the outfit: multicam sleeves and coyote gloves.
- **New: a full-body shadow.** Kai's rigged body is drawn only into the shadow map, so the player sees their own silhouette (helmet, carrier, carbine) stride across the floor.
- **Armor 150 (was 100), recharging.** After **1 s** without taking damage, armor refills at 55/s. The HUD bar has 5 segments; while refilling it shows a cyan shimmer, a "RECHARGING" tag, sparks and a rising whine, and a "full" chime when done. A break flash and shatter sound play when armor hits 0.

## 3. Enemy roster (all human enemies are masked mercenaries; robots carry no logos)

| Enemy | Model | Role | Readability cue |
|---|---|---|---|
| **WOLF** | Mercenary in tactical kit with a wolf mask (Tripo scan, rigged) | Rifleman; uses cover and strafes | Grey-brown mask, rifle bursts |
| **BOAR** | Mercenary with a boar mask, heavy vest | Shotgun breacher, rushes | Bulky shoulders, tusked mask |
| **SENTINEL** | Unitree H1-style white humanoid robot, about 1.85 m | Rifleman; joins the Wolf rotation from wave 2 | Clean white plates, servo whine, sparks and no blood |
| **HOUND** | Go2-style robot dog with a back-mounted turret | Fast flanker | Low silhouette, skittering steps |
| **EXO** | Human in a powered exoskeleton | Minigun heavy; the glowing **back power cell** is a 3× weak point | Wide frame, heavy servo stomps |
| **THE WARDEN** | 3 m assault exoskeleton with a pilot behind a canopy | Boss: slam, cannon, drone summon | Scale and a boss bar |

## 4. Weapons

- **M4 Carbine**: unchanged. Holographic sight, crisp 3-layer shot.
- **M870 shotgun**: the scanned sight bumps are replaced with a **code-built ghost-ring rear aperture and a green fiber-optic front post**, aligned to the ADS camera so the front post sits centred in the ring.
- **RPG-X**: unchanged.

## 5. Art direction — hyper-real, low glare

- Grounded PBR. Environment reflections are capped (arena surfaces default to env intensity 0.45), emissives are kept for real light sources only, and puddles and wet floors are sparse.
- Storm-dusk sky with warm low sun; fog is matched to the horizon.
- Characters are textured Tripo scans with soft fresnel rims for readability against backlight.

## 6. VFX and HUD feedback (generous by design)

- World: muzzle flash plus smoke puffs, tracers, impact sparks and dust, decals, shell casings, debris, explosion fireball + shock ring + embers, robot spark showers vs. human impact puffs, and weak-point crack bursts.
- HUD: canvas spark layer on hit markers, kills, rank-ups, armor recharge and armor break; segment pulses; a slam-in wave banner; damage arcs.
- Camera: recoil kick, trauma shake, hitstop on heavy kills, and an Overdrive colour grade.

## 7. Audio

- New Lyria BGM: title, combat and boss themes.
- New SFX set (ElevenLabs): layered rifle / shotgun / rocket shots, pump and reload mechanics, explosions, human vs. robot hits and deaths, exo and hound steps, hit / headshot / kill confirms, armor break and armor recharge, UI hover and confirm, wave start and clear, spawn-in, boss roar, impacts and flybys.

## 8. Loading strategy (staggered, busy-aware)

| Stage | Contents | When |
|---|---|---|
| Boot | Title UI, fonts, loading art (tiny blurred placeholder first) | Before the title screen |
| 1 | Arena, Wolf + Boar, Kai body, M4/M870 + arms, core SFX | Before the title screen (first wave) |
| 2 | Sentinel robot, Hound, grenades | Background right after title; urgent at wave 2 |
| 3 | Exo heavy, RPG-X + rocket, heavy SFX | Background; urgent at wave 4 |
| 4 | The Warden, boss SFX and music | Background; urgent at the final wave |

The background queue pauses when frame time spikes, many VFX are live, or many enemies are on screen, and resumes when play calms down. If a required stage is late, a recoverable "loading" banner shows.

## 9. Implementation map

| Area | Files |
|---|---|
| Recharging armor | `src/game/config.ts`, `src/game/player.ts`, `src/game/onslaught.ts` (perks), `src/ui/ui.ts`, `src/styles/main.css`, `src/engine/audio.ts` |
| Roster + rigs | `scripts/v4-rig-transfer.mjs` → `public/assets/v4chars/*.glb`; `src/game/robot.ts` (`exo` look), `src/game/bots.ts`, `src/game/game.ts`, `src/game/stages.ts` |
| Player body | `src/game/playerbody.ts` |
| Shotgun sights | `src/game/tripoguns.ts` (`shotgunSights`) |
| Audio | `scripts/import-v3-audio.py` (AUDIO_SRC), `public/assets/{music,sfx}` |
| Share / loading art | `public/assets/ui/{loading_bg,title_bg}.webp`, `assets/share/{og,favicon}.png`, `game-sharing.json` |
