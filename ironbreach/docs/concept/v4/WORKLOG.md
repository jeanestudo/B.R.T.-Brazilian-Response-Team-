# Iron Rift V4 worklog (request 2026-10-01 13:58)

## Baseline
- Canonical main = 390a58e (V3 by another session, 2026-09-30): Operator/Breacher (masked humans, Meshy rigs
  24 joints, clips walk/idle/run), Sentinel humanoid robot, Hound robot dog (rigid segments, hound.ts),
  Warden boss mech, Tripo viewmodels in public/assets/vm (rifle, shotgun, launcher, rocket, arm_l, arm_r),
  Tripo props, new audio, sharing art. Concept art docs/concept/v3/*.jpg.
- No rigging API available (data-api 3d-model = Tripo only). Built-in model-generation tooling was used.

## V4 request deltas
1. Shotgun iron sights (ghost ring + bead) — better ADS sight picture.
2. Hyper-realistic art style.
3. Player = East Asian male, modern tactical outfit (title/loading art, FP arms/sleeves, shadow body, death cam).
4. Enemies: Unitree-style robots (NO logos/numbers), humans in tactical gear w/ animal masks, humans in powered
   exoskeletons. Remove logos from Sentinel/Warden/Hound.
5. Armor: higher max, recharges after 1 s without damage.
6. Research + proposal + concept images; new BGM/SFX; loading bg, favicon, OG card; staged loading (keep);
   glare reduction; Tripo weapons/armor.

## Rigging plan
- Generate new humanoid Tripo meshes in the SAME bind pose as operator.glb (render bind pose -> GPT ref).
- Transfer skin weights from existing rigged proxy (operator/sentinel/warden) by k-NN nearest vertex after
  bbox alignment; leg-chain repair below crotch. Keep proxy skeleton + clips.

## Research (saved 14:31)
- CoD MW sound design (https://www.asoundeffect.com/call-of-duty-modern-warfare-sound/): each shot = transient attack
  + mechanical layer + tail + LFE; ~25 element sets per gun varied by environment / stance / sustained fire;
  ray-cast positional reflections with speed-of-sound delay; mechanical details (trigger reset, bolt lock on
  last round); projectile whiz-bys cut at impact; wide dynamic range, selective mix.
- Halo shields (reddit r/halo, steam discussions): recharging shield creates a ~30 s engage/retreat/re-engage
  loop; delay length scales with TTK; audible/visible recharge cue is part of the loop.
- Apex (gamespot S24 article): armor tiers drive TTK; shield break cue (crack + colour) is key feedback.
- Payday 2 Bulldozer/Maximum Force (https://payday.fandom.com/wiki/Enemies_(Payday_2)): armored heavies whose
  torso is bulletproof, faceplate/visor weak point; heavy units telegraph via silhouette.
- docseuss "enemy mine" + Level Design Book enemy roster: distinct silhouette that conveys capability;
  roster balance by speed / health / range / DPS (fast-weak-close flanker, slow-strong-close tank, long-range).
- Earlier V2 analysis (DOOM Eternal push-forward, ULTRAKILL style, Titanfall 2) in docs/concept/PROPOSAL.md.

## V4 concept images (docs/concept/v4/01..05.png) generated 14:30 with gpt-image-2.5 high
- Roster: WOLF (wolf-mask rifleman), BOAR (boar-mask shotgun breacher), HOUND (Go2-style dog, turret),
  SENTINEL (H1-style humanoid robot, rifle), EXO (human in powered exoskeleton, minigun), WARDEN boss
  (3 m assault exoskeleton, human pilot behind glass canopy, autocannon + fist).
- Player KAI: East Asian male ~32, multicam shirt, ranger-green plate carrier, headset, high-cut helmet,
  coyote gloves. Shotgun: ghost-ring rear + green fiber-optic front post.
- HUD: segmented cyan ARMOR (5 segs, RECHARGING shimmer) over red HEALTH; wave banner; style rank SS + combo;
  kill feed; damage numbers; ammo shells; grenade count.

## 14:41 status
- BLOCKER: generate_3d_model -> "3D generation pricing is unavailable"; data-api Tripo -> 403 code 2010
  "not enough credit". Deferred ask sent to user: top up credits vs fallback (keep meshes, strip
  Warden/Hound markings in textures, attach procedural animal masks/exo frames, code-built shotgun sights).
- Refs ready in .asset-src/v4/ref_{wolf,boar,exo,player,warden,hound,shotgun}.png (copied to .asset-src/gen/
  for scripts/gen3d.mjs). Pose refs pose_*_{front,side}.png. tools/glbview.html + tools/glbshot.mjs preview GLBs.
- DONE armor regen: config maxArmor 150, absorb 0.75, armorRegenDelay 1, armorRegenRate 55; player.sinceHit/
  regenerating; spawn full armor; perk plated 150+50n (tests updated); HudState armorRegen/armorWait;
  ui.armorFx (sparks, cues armorRegen/armorFull synth in audio.ts), CSS V4 vitals (cyan segmented armor
  above red health, shine, delay line, full flash, shatter). tsc clean.
- NEXT: shotgun iron sights (code-built ghost ring + fiber optic, ADS alignment), new SFX/BGM, loading bg,
  favicon, OG, proposal doc, then 3D work per user answer.

## 14:55 status
- DONE shotgun sights: tripoguns.ts shotgunSights() — cut scanned bumps (rear z -0.04..0.05 y>0.067, front
  z -0.552..-0.508 y>0.058), machined ghost ring (R .0098 hole .0058, wings) at z .006, front blade+ears+green
  fiber rod at z -.532, sight line Y = 0.066+0.0045+R; ADS z -0.235. Verified ADS dot centred in ring.
- Profile of Tripo shotgun (root space): barrel top .056, receiver top .066 (z -.21..-.04).
- Vitals label "ARMO R" spacing quirk still visible — fix later.
- V4 audio in .asset-src/v4/audio/: title/combat/boss.mp3 (Lyria) + rifle_shot, shotgun_shot, shotgun_pump,
  rocket_launch, explosion, rifle_reload, shell_insert, enemy_shot, minigun, armor_recharge (done);
  pending: human_hit, human_death, robot_hit, robot_death, mech_stomp, hound_step, hitmarker, headshot,
  kill_confirm, armor_break. Import with existing scripts/import-v3-audio.py pattern (loudness-match).

## 15:01 status
- Tripo generate_3d_model WORKS again (retry 14:57). Models -> .asset-src/v4/models/{shotgun,player,wolf}.glb done;
  boar, exo, warden, hound, sentinel pending (jobs started 14:57/15:01).
- All V4 audio imported via scripts/import-audio.py (AUDIO_SRC=.asset-src/v4/audio; renamed from import-v3-audio.py),
  new sample armor_recharge registered in audio.ts + played in ui.ts armor regen start.
- Generated .asset-src/v4/{ref_sentinel,loading_bg,og_card,favicon}.png (gpt-image-2.5 high).
- NEXT: proposal doc docs/concept/v4/PROPOSAL.md; install loading bg/og/favicon; integrate models (rig transfer
  per Rigging plan; inspect build-v3-chars.mjs for the existing pipeline).

## 15:06 rig pipeline
- scripts/v4-rig-transfer.mjs <tripo> <proxy> <out> [verts] [tex]: weld+simplify, yaw auto-pick by chamfer
  (Tripo scans face sideways; wolf picked 270), height fit to proxy bounds, 6-NN weight transfer, leg-side
  strip, keep proxy skeleton/clips, resize+webp+meshopt. Wolf->public/assets/v4chars/operator.glb verified
  (bind + run render clean, 50k tris, 976 KB).
- Batch job: boar->breacher, exo (sentinel rig)->exo, warden (2048 tex)->warden, player (operator rig)->player.
  Sentinel model done 15:05 -> run: node scripts/v4-rig-transfer.mjs .asset-src/v4/models/sentinel.glb
  public/assets/v3chars/sentinel.glb public/assets/v4chars/sentinel.glb
- Hound: hound.ts self-rigs a static mesh using hard-coded landmarks (frame: faces -Z, feet y=0, ~0.85 m,
  HIP_Y .47, KNEE_Y .29, hips x±.17 z -.21/.22). New hound must be fitted to the old v3chars/hound.glb frame
  (static mode, no skin) -> v4chars/hound.glb.
- Roster plan: scrapper=wolf(operator) alternating with sentinel robot; breacher=boar; juggernaut=exo (new
  RobotLook 'exo', copy sentinel RIGS/ROBOT_SCALE); titan=warden; DM rivals striker=sentinel, warden=boar.
  Loader paths: stages.ts assets/v3chars -> v4chars.
- New art: .asset-src/v4/{loading_bg,og_card,favicon}.png to install (public/assets/ui/loading_bg.webp, title_bg,
  assets/share/og.png, favicon.png).

## 15:55
- V3 rig proxies moved out of public/ to .asset-src/v3chars (also in git at 390a58e:public/assets/v3chars/). Player body rebuilt with 64px textures (shadow-only); Warden at 1024 tex.
