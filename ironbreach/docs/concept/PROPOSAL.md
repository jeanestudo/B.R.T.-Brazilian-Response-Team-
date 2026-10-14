# Iron Rift: Onslaught — Concept Proposal (V2)

> A push-forward arena shooter where a lone Rift Breaker fights waves of rogue foundry war machines
> in a storm-lit industrial shipyard. Every trigger pull, kill and HUD interaction pays out in light,
> sparks, debris and sound.

## 1. Reference analysis: what makes the best shooters fun

| Game | Core loop | Mechanics worth borrowing | Game-juice lessons |
| --- | --- | --- | --- |
| **DOOM (2016) / DOOM Eternal** | Enter arena → fight escalating mixed encounter → resources come *from* aggression → arena clears → move on | "Push-forward combat": health/armor/ammo drop from enemies so the player never hides to recover; weapons have clear roles against enemy types; weak points (e.g. turrets, cores) reward precision | Enemies visibly degrade under fire, gore/debris sells every kill, loud chunky weapon audio, a strong heavy-metal score that scales with combat |
| **Titanfall 2** | Fluid movement → fast time-to-kill duels → movement-chains keep speed | Slide-hop momentum, air control, an ability meter ("Core") that charges from damage dealt | Smooth, weighty viewmodel animation, FOV kick on speed, crisp hitmarker ticks, huge mech scale contrast |
| **Call of Duty (MW series)** | Spawn → gunfight → killstreak → reward | Aim-down-sights precision vs. hip-fire, killstreak rewards, reload cancelling | The hitmarker + "tick" sound is the most copied feedback in the genre; red kill-confirm marker; dense layered gunshot audio (mechanics + tail) |
| **Destiny 2** | Encounter → loot → build | Crit spots with distinct feedback, boss phases with damage windows | Floating damage numbers (white/yellow crit), enemy shield colours, gun animation "snap" on reload completion |
| **Apex Legends** | Engage → shield management → finish | Armor/shield pools separate from health | The shield-break *shatter* (sound + particles + hit-marker colour change) makes damage progress readable at a glance |
| **ULTRAKILL** | Kill stylishly → style rank rises → higher rank = better sustain | Style meter with ranks, bonuses for variety (Arsenal), airborne and headshot kills, rank loss on damage taken | The rank letter *slams* onto the HUD; bonus feed stacks; the meter pushes players to play aggressively and varied |
| **Call of Duty Zombies / Killing Floor 2** | Survive wave → breather → upgrade → harder wave | Wave escalation, new enemy types introduced gradually, boss waves | Wave banners, ramping music, slow-motion finales (KF2 "Zed Time") on big kills |

**Distilled principles**
1. **Aggression is the resource engine.** Kills drop health/armor/ammo shards that magnetise to the player (DOOM).
2. **Readable damage.** Hitmarkers, crit colours, damage numbers, shield-shatter and visible enemy damage states.
3. **Escalation and novelty.** New enemy types every couple of waves, a boss finale, and music that intensifies.
4. **A combo meter that rewards style.** Ranks raise score multiplier and fill an Overdrive meter (ULTRAKILL + Titanfall Core).
5. **Speed is fun.** Sprint, slide and jump chain into each other with FOV kicks and dust trails (Titanfall).
6. **Every action has a sound, a light and a particle.** Including HUD and menu interactions.

## 2. Game overview

| | |
| --- | --- |
| Title | **IRON RIFT: ONSLAUGHT** |
| Setting | *Foundry Yard 7* — an abandoned shipbreaking foundry at dusk under a burning storm sky. Rust, wet concrete, shipping containers, crane gantries, sodium lamps |
| Fantasy | You are a lone Rift Breaker holding the yard against the **Scrap Legion**, rogue war machines built from foundry salvage |
| Modes | **Onslaught** (primary): 8 escalating waves ending in a boss. **Deathmatch** (kept from V1): free-for-all vs 5 Scrapper bots, first to 20 |
| Session | Onslaught ≈ 10–14 min; Deathmatch ≈ 6 min |

## 3. Core loop (Onslaught)

```
Wave banner + music swell ─▶ Fight (enemies drop Rift shards, style rank climbs, Overdrive charges)
      ▲                                                                   │
      │                                                                   ▼
Upgrade card pick (1 of 3) ◀── Wave clear (slow-mo final kill, score tally, supply drop)
```

| Wave | Composition | New element (asset stage) |
| --- | --- | --- |
| 1 | 5 Scrappers | Scrapper, rifle, shotgun (Stage 1) |
| 2 | 7 Scrappers + 2 Hornets | **Hornet drone** + frag grenades (Stage 2) |
| 3 | 6 Scrappers + 5 Hornets | — |
| 4 | 6 Scrappers + 3 Hornets + 1 Juggernaut | **Juggernaut** + **rocket launcher supply drop** (Stage 3) |
| 5 | 8 Scrappers + 4 Hornets + 1 Juggernaut | — |
| 6 | 8 Scrappers + 6 Hornets + 2 Juggernauts | — |
| 7 | 10 Scrappers + 6 Hornets + 2 Juggernauts | Storm intensifies (lighting shift) |
| 8 | **WARDEN boss** + escorts | Boss + boss music (Stage 4) |

Enemies spawn in groups from 6 spawn gates with a telegraph (red beacon pillar + drop-in sparks), capped at
~10 simultaneously alive; the rest queue.

## 4. Player mechanics

| Mechanic | Design |
| --- | --- |
| Movement | WASD, sprint (Shift), jump (Space), **slide** (C / Ctrl while sprinting): 0.8 s burst, FOV +8°, camera tilt, dust + boot sparks |
| Weapons | **AR-7 Vanguard** rifle (red dot ADS, headshot 2×), **SG-12 Breacher** pump shotgun (point-blank "Overkill"), **RL-3 Hellfire** rocket launcher (unlocked wave 4 / pickup in Deathmatch) |
| Frag grenade | G: throw arcing, bouncing frag (2 charges, recharge from shards). Cook-free, 1.6 s fuse |
| Rift shards | Enemies burst into health (green), armor (cyan) and ammo (amber) shards that magnetise within 7 m. Headshot and explosive kills drop extra |
| Style meter | Ranks **D → C → B → A → S → SS → RIFTBREAKER**. Bonuses: kill, headshot, multi-kill, airborne, slide kill, explosion, Arsenal (weapon variety), Overkill, long shot. Taking damage drops a rank. Rank = score multiplier ×1–×4 |
| Overdrive | F when full: 8 s of ×1.5 damage, infinite magazine, time slowed to 0.8 for enemies, golden screen grade and crackling arcs on the viewmodel. Charges from style points |
| Upgrades | After each wave pick 1 of 3 cards: e.g. *Hollow Points* (+20% rifle damage), *Quick Hands* (+30% reload), *Plated* (+50 max armor), *Scavenger* (+50% shard magnet radius), *Overclock* (+35% Overdrive charge), *Demolitions* (+1 grenade, +25% splash), *Vampire Core* (kills heal 5), *Choke* (tighter shotgun spread) |

## 5. Enemies

| Enemy | Role | Behaviour | Weak point | Feedback |
| --- | --- | --- | --- | --- |
| **SCR-9 Scrapper** | Line infantry | Paths, strafes, bursts, takes cover when hurt, flanks | Head optic (2×) | Armor plates spark and dent, head pops off on headshot kill, electrical arcs, oil spray, debris |
| **HX-3 Hornet** | Flanker | Flies at 3–6 m altitude, strafes in arcs, fires plasma bolts, dives kamikaze under 30% HP | Rotor core (whole body small) | Tilts on hit, trails smoke when damaged, spirals down and explodes |
| **JX-40 Juggernaut** | Heavy | Slow stomping advance, arm cannon bursts + shoulder rocket salvos, staggers after big damage | Glowing back reactor (2.5×) | Stomp dust + camera shake, armor shatter at 50%, huge death explosion |
| **WARDEN** (boss) | Finale | P1: cannon sweeps + rocket barrages. P2 (66%): summons Hornets, shockwave ground slam. P3 (33%): overheated chest core exposed, enraged fire rate | Chest core (3× in P3) | Segmented boss bar, phase-change slow-mo, sparks raining, final 2 s slow-mo death with chain explosions |

## 6. Visual direction

- **Hyper-real PBR assets**: Tripo-generated, PBR-textured models of every enemy, weapon, projectile and key prop,
  built from GPT Image concept art; Poly Haven CC0 props and textures for the environment.
- **Organic rigging**: generated meshes are auto-skinned to a hand-placed humanoid skeleton (hips, spine, chest,
  neck, head, shoulders, elbows, wrists, hips, knees, ankles). Procedural animation layers: locomotion cycle with
  foot planting, hip sway and counter-rotation; upper-body aim IK; recoil; hit-react impulses on the hit bone;
  stagger; death falls driven by a simple physical pose solver.
- **Lighting**: dusk HDRI + low warm sun, cool fill, sodium lamps. **Glare reduction**: lower environment reflection
  intensity, rougher surfaces, restrained puddles, restrained emissives, a higher bloom threshold.
- **VFX library**: real-smoke puff sprites, fire/explosion sprite variants, muzzle-flash sprites (front and side),
  spark streaks, debris chunks, bullet-hole and scorch decals, shockwave rings, heat shimmer, embers, Rift-shard trails,
  electrical arcs, dust kick-ups, rain/embers ambience.
- **HUD**: dark gunmetal plates with amber accents, generated icon set (weapons, grenade, shards, perks), animated
  bars with ghost trails, style meter, wave banner, boss bar, perk cards, and a DOM particle layer that bursts on
  every hit, kill, pickup, rank-up and button hover.

## 7. Audio direction

| Cue | Content |
| --- | --- |
| Title theme | Brooding industrial synth + taiko, 90 s |
| Combat theme | Aggressive industrial metal/electronic at 140 BPM, loopable |
| Boss theme | Heavier, choir-like pads, 150 BPM |
| SFX (≈45) | Layered gunshots, reload foley (mag out / in / bolt), shell tinkle, impacts (concrete/metal/robot), crit ping, hitmarker tick, kill confirm, armor shatter, slide scrape, footsteps, landing, grenade throw/bounce/explode, Hornet buzz & plasma, Juggernaut stomp & cannon, Warden roar/slam, shard pickups, Overdrive in/out, wave horn/clear, UI hover/click/confirm/perk-pick, heartbeat, victory/defeat |

## 8. Staged loading

| Stage | Loaded | When |
| --- | --- | --- |
| 0 Boot | Loading background (≈150 KB), fonts, HUD icons, title key art, UI SFX, title theme (streamed) | Immediately |
| 1 Wave 1 | Arena textures/HDRI/props, rifle, shotgun, hands, Scrapper, core weapon SFX, combat theme (streamed) | Before the title is shown |
| 2 Waves 2–3 | Hornet, grenade, drone SFX | Background, right after title |
| 3 Waves 4–7 | Juggernaut, rocket launcher, rocket, heavy SFX | Background |
| 4 Wave 8 | Warden, boss SFX, boss theme | Background |

A **prefetch scheduler** fetches one asset at a time and **pauses** while combat is hot (≥ 5 enemies alive, many
active particles, or frame time > 20 ms), resuming during calm moments and intermissions. If a wave needs a stage
that is not ready, the intermission shows a recoverable *"Reinforcements inbound — syncing"* loading bar instead of
starting.

## 9. Success criteria

- Title appears after only Stage 0 + 1 are loaded; later stages stream in the background.
- Every enemy is a textured, rigged, animated model; weapons are detailed PBR viewmodels.
- Every hit/kill/pickup/UI interaction triggers visible particles + sound.
- No harsh glare: environment reflections and emissives are restrained.
- Stable frame time on mid-range hardware with a Quality preset fallback.
