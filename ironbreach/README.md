# B.R.T. — Brazilian Response Team

Um FPS 3D brasileiro que corre no browser (Three.js + Rapier), agora em português do Brasil. Como
operador da **Brazilian Response Team**, segura o **Morro da Rocinha** durante **8 ondas** de ameaças,
robôs, cães de guerra e exotrajes, até ao confronto final com **O Guardião**.
O mapa jogável tem **112 × 112 m**, três rotas principais e blocos de casas, becos, lajes e pátios
pensados para leitura e linhas de visão no estilo clássico de Counter-Strike 1.6. O catálogo já traz
também o próximo mapa **Porto de Santos — Pátio dos Contêineres** para a rotação futura.
O **Combate Livre** continua disponível no ecrã inicial. A campanha é jogável localmente; o contrato
de lobby por convite está preparado em `src/game/multiplayer/lobby.ts`, aguardando um servidor WSS
autoritativo para criar salas com amigos sem simular multiplayer falso.

The current (V4) design, its reference analysis (Halo, Apex, CoD MW, Payday 2, DOOM Eternal, ULTRAKILL,
Titanfall 2) and concept art are in [`docs/concept/v4/PROPOSAL.md`](docs/concept/v4/PROPOSAL.md); earlier
rounds are in `docs/concept/`.

## Controls

| Input | Action |
| --- | --- |
| Mouse | Olhar (pointer lock; clique no jogo para capturar o mouse) |
| W A S D / setas | Mover |
| Shift | Correr |
| Espaço | Saltar |
| C / Ctrl esquerdo | Manter para agachar; tocar enquanto corres para deslizar |
| Rato esquerdo | Disparar |
| Rato direito | Apontar |
| R | Recarregar |
| 1 / 2 / 3, roda, Q | Rifle / escopeta / lança-foguetes, alternar, última arma |
| G | Lançar granada |
| F | Sobrecarga (quando carregada) |
| 1 / 2 / 3 ou clique | Escolher melhoria entre ondas |
| Tab (manter) | Classificação |
| Esc / P | Pausa, definições e controlos |

Gamepad (standard mapping): RT fire, LT aim, A jump, X reload, Y/RB next weapon, LB previous,
L3 sprint, R3 slide, D-pad up Overdrive, D-pad down grenade, Start pause.

## Game systems
- **Arena — Morro da Rocinha:** bloco jogável de **112 × 112 m**, com casas procedurais nas encostas,
  viela norte, escadão central, laje sul, pátio aberto, coberturas baixas e longas linhas laterais.
  A antiga doca permanece como horizonte e base visual do próximo mapa de Santos.
- **Deathmatch robots:** two of the six Deathmatch bots (WRAITH, NOVA) are Sentinel robots.
- **Low health:** a sharp, pulsing blood-red vignette closes in below 35 HP (no blur or heavy desaturation).

- **Enemies:** Wolf-masked riflemen and Boar-masked shotgun breachers, Sentinel humanoid robots
  (join the rifle rotation from wave 2), robot Hounds with back turrets, Exo minigun heavies (back power
  cell = 3x weak point), and The Warden, a 3 m assault exoskeleton with slam, cannon and drone phases.
  Characters are textured Tripo scans re-skinned onto shared rigs (`scripts/v4-rig-transfer.mjs`).
- **Recharging armor:** 150 armor over 100 health. After 1 s without taking damage, armor refills
  (segmented cyan bar, RECHARGING shimmer, HUD sparks, recharge whine, full chime, break shatter).
- **Player body:** Kai's rigged body is rendered into the shadow map only, so your own silhouette
  moves across the ground.
- **Style meter:** ranks D → C → B → A → S → SS → RIFTBREAKER. Variety, headshots, multi-kills and
  environmental kills pay more; the meter decays when you play passively. Rank multiplies score.
- **Augments:** eight stackable perks (Hollow Points, Quick Hands, Plated, Scavenger, Overclock,
  Demolitions, Vampire Core, Choke), offered three at a time after each wave.
- **Overdrive:** a charged state with faster fire, infinite ammo and a distinct colour grade.
- **Weapons:** M4 carbine (holographic sight), M870 pump shotgun (ghost-ring rear and fiber-optic
  front sight, shell-by-shell reload), RPG-X (rocket launcher with splash damage) and frag grenades.
- **Feedback:** recoil and camera kick, muzzle flash and smoke, tracers, flipbook sparks, decals,
  shells, debris, shockwaves, hit-stop, hitmarkers, damage arcs, and HUD spark bursts on hits,
  kills, pickups and rank changes.
- **Presentation:** HDRI sky and image-based lighting, a shadow-casting sun, fog, world-space
  grime on PBR surfaces (reflections and emission kept low to avoid glare), HDR bloom and a
  cinematic grade with damage, low-health and Overdrive looks. The HUD scales down on short
  viewports.

## Loading

Boot loads only what the title screen and wave 1 need (arena, Wolf/Boar rigs, Kai's body, rifle and
shotgun, core VFX and SFX, title music), then shows the title immediately. Later content (Sentinel and
Hounds, Exo and launcher, Warden, boss audio and music) streams through a staged queue in `src/game/stages.ts`.
The queue pauses while combat is busy (many effects or enemies on screen) and resumes when it calms
down. If a stage is still late when its wave starts, it is promoted to urgent and a "syncing
wave data" tag is shown.

## Development

```bash
pnpm install
pnpm dev      # local development server
pnpm build    # typecheck + production build + boot/total size budget
pnpm test     # unit tests (deathmatch rules, onslaught style/waves/perks, save)
pnpm smoke    # after build: headless Onslaught and Deathmatch runs with screenshots in shots/
```

`scripts/debug.mjs` is a dev-only probe. It runs JavaScript steps from a file (separated by `---`
lines) against the running dev server and captures a screenshot after each step.

Asset pipeline (sources in `.asset-src/`, not shipped):

- `scripts/fetch-assets.py` downloads the CC0 Poly Haven HDRI, textures and props.
- `scripts/build-assets.py` converts them into web-ready files.
- `scripts/build-v2.py` packs the VFX flipbook atlases, HUD art, music and SFX.
- `scripts/prune-chars.mjs` trims, welds and meshopt-compresses the character rig.

## Layout

| Path | Role |
| --- | --- |
| `src/main.ts` | Bootstrap, staged loading, busy-aware streaming, screen flow, perk flow, music |
| `src/engine/` | Fixed-step loop, input, Rapier physics, renderer + post-processing, Web Audio mixer (staged samples, streamed music), save, i18n |
| `src/game/config.ts` / `tuning.ts` | Gameplay tuning values and defaults |
| `src/game/onslaught.ts` | Pure style-meter, wave-plan and perk logic (unit tested) |
| `src/game/rules.ts` | Pure deathmatch rules (unit tested) |
| `src/game/game.ts` | Wave director, combat resolution, projectiles, explosions, camera feel, HUD state |
| `src/game/stages.ts` | Staged asset loader with the busy-aware background queue |
| `src/game/weapons.ts` / `guns.ts` | Player arsenal logic and procedural modeled viewmodels with gloved arms |
| `src/game/bots.ts` / `robot.ts` / `hornet.ts` / `nav.ts` | Enemy AI, rigged robots with armour kits and IK, drones, navigation grid |
| `src/game/arena.ts` / `props.ts` / `library.ts` | Level build, explosive props + pickups, asset loading and PBR materials |
| `src/game/fx.ts` | Flipbook-atlas GPU particles, decals, shells, debris, light pool, shockwaves, explosions |
| `src/ui/ui.ts` / `sparks.ts`, `src/styles/main.css` | DOM HUD and menus, and the HUD spark particle layer |
| `game-sharing.json`, `assets/share/` | Link-preview title/description, OG cover and favicon |

## Rules for changes

- **Simulation in `step()`, visuals in `render()`/`animate()`.** Gameplay state only changes in
  fixed steps; read presses there with `input.consume(action)`.
- **Rules stay pure.** Scoring, style, waves and perks go in `onslaught.ts`/`rules.ts` with tests.
- **No new lights at runtime.** Dynamic lights come from the pre-allocated pool in `fx.ts`, so
  explosions never trigger shader recompiles.
- **Keep glare low.** Environmental reflections and emission are deliberately subdued; use them sparingly.
- Keep `pnpm build` within budget and `pnpm smoke` green.

## Credits

- HDRI, PBR textures and prop models: [Poly Haven](https://polyhaven.com), CC0 (*The Sky Is On Fire*
  HDRI; Concrete Floor 03, Concrete Floor Worn 001, Concrete Wall 008, Rusty Metal 02, Metal Plate
  and Corrugated Iron 02 textures; Barrel 03, Old Military Crate, Wooden Military
  Crate, Medical Box, Ammo Box, Propane Tank, Utility Box 02 and Security Light models).
- Port props (RTG crane, ship-to-shore crane, reach stacker) and the clean Sentinel: generated with Tripo
  from AI concept references for this project (`scripts/build-v5-props.sh`).
- Character rig and animations: Mixamo X Bot, as distributed in the three.js examples.
- Enemy armour, weapons, drones and arms: procedural geometry built in code for this project.
- Music (title, combat and boss themes) and sound effects: AI-generated for this project.
- VFX flipbooks, HUD icons, loading and title backgrounds, and concept art: AI-generated for this project.
- Fonts: SIL Open Font License 1.1 (see `public/fonts/*-OFL.txt`).
- Libraries: three.js (MIT), Rapier (Apache-2.0), meshoptimizer (MIT).
- Sharing artwork (OG cover, favicon): AI-generated for this project.
