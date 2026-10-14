/**
 * Unified input for a desktop FPS: keyboard + mouse (pointer lock) with gamepad support. Gameplay
 * reads `move`, `takeLook()` and `held()/consume()`; it never checks raw keys.
 */
export type Action =
  | 'jump' | 'sprint' | 'fire' | 'ads' | 'reload' | 'slot1' | 'slot2' | 'slot3' | 'nextWeapon' | 'prevWeapon'
  | 'lastWeapon' | 'scoreboard' | 'pause' | 'confirm' | 'back' | 'slide' | 'grenade' | 'overdrive'
export type InputMethod = 'keyboard' | 'gamepad' | 'touch'

const KEY_BINDINGS: Record<Action, string[]> = {
  jump: ['Space'],
  sprint: ['ShiftLeft', 'ShiftRight'],
  fire: [],
  ads: [],
  reload: ['KeyR'],
  slot1: ['Digit1', 'Numpad1'],
  slot2: ['Digit2', 'Numpad2'],
  slot3: ['Digit3', 'Numpad3'],
  nextWeapon: [],
  prevWeapon: [],
  lastWeapon: ['KeyQ'],
  scoreboard: ['Tab'],
  pause: ['Escape', 'KeyP'],
  confirm: ['Enter', 'NumpadEnter'],
  back: [],
  slide: ['KeyC', 'ControlLeft'],
  grenade: ['KeyG'],
  overdrive: ['KeyF'],
}
const PRESS_TTL = 100
const MOVE_KEYS = { up: ['KeyW', 'ArrowUp'], down: ['KeyS', 'ArrowDown'], left: ['KeyA', 'ArrowLeft'], right: ['KeyD', 'ArrowRight'] }
// Standard gamepad: A=0 B=1 X=2 Y=3 LB=4 RB=5 LT=6 RT=7 Back=8 Start=9 L3=10.
const PAD_BINDINGS: Partial<Record<Action, number[]>> = { jump: [0], sprint: [10], fire: [7], ads: [6], reload: [2], nextWeapon: [3, 5], prevWeapon: [4], scoreboard: [8], pause: [9], confirm: [0], back: [1], slide: [11], overdrive: [12], grenade: [13] }

export class Input {
  readonly move = { x: 0, y: 0 }
  readonly look = { x: 0, y: 0 }
  method: InputMethod = 'keyboard'
  sensitivity = 1
  invertY = false
  private keys = new Set<string>()
  private mouse = new Set<number>()
  private touchHeld = new Set<Action>()
  private touchMoveId: number | undefined
  private touchLookId: number | undefined
  private touchMove = { x: 0, y: 0 }
  private touchStrafe = new Set<'left' | 'right'>()
  private touchLookLast = { x: 0, y: 0 }
  private held_ = new Set<Action>()
  /**
   * Edge-triggered presses with their arrival time. The simulation runs at a fixed 60 Hz while
   * rendering can run at 120-240 Hz, so many render frames contain no sim step; a press is kept
   * until consumed or PRESS_TTL ms old so a step always gets to see it (no dropped Q/C/clicks).
   */
  private pressed_ = new Map<Action, number>()
  private padPrev = new Set<Action>()
  private listeners: Array<() => void> = []

  constructor(private readonly canvas: HTMLCanvasElement) {
    const on = <K extends keyof WindowEventMap>(target: Window | HTMLElement, type: K, fn: (e: WindowEventMap[K]) => void, opts?: AddEventListenerOptions) => {
      target.addEventListener(type, fn as EventListener, opts)
      this.listeners.push(() => target.removeEventListener(type, fn as EventListener, opts))
    }
    on(window, 'keydown', e => {
      const typing = (e.target as HTMLElement | null)?.matches?.('input, textarea')
      if (typing) return
      if (e.code === 'Tab' || e.code === 'Space' || e.code.startsWith('Arrow')) e.preventDefault()
      if (e.repeat) return
      this.keys.add(e.code)
      this.method = 'keyboard'
      for (const [action, codes] of Object.entries(KEY_BINDINGS) as [Action, string[]][]) {
        if (codes.includes(e.code)) this.press(action)
      }
    })
    on(window, 'keyup', e => this.keys.delete(e.code))
    on(window, 'blur', () => {
      this.keys.clear()
      this.mouse.clear()
      this.touchHeld.clear()
      this.touchStrafe.clear()
      this.touchMoveId = undefined
      this.touchLookId = undefined
      this.touchMove.x = 0
      this.touchMove.y = 0
      this.updateTouchVisual(0, 0)
    })
    on(window, 'mousedown', e => {
      if (!this.locked) return
      this.mouse.add(e.button)
      this.method = 'keyboard'
      if (e.button === 0) this.press('fire')
      if (e.button === 2) this.press('ads')
    })
    on(window, 'mouseup', e => this.mouse.delete(e.button))
    on(window, 'contextmenu', e => {
      if (this.locked) e.preventDefault()
    })
    on(window, 'wheel', e => {
      if (!this.locked) return
      if (e.deltaY > 0) this.press('nextWeapon')
      else if (e.deltaY < 0) this.press('prevWeapon')
    }, { passive: true })
    on(window, 'mousemove', e => {
      if (!this.locked) return
      // Ignore rare giant spikes some browsers emit when pointer lock engages.
      if (Math.abs(e.movementX) > 400 || Math.abs(e.movementY) > 400) return
      this.look.x += e.movementX * 0.0019
      this.look.y += e.movementY * 0.0019
    })
    on(window, 'pointerdown', e => {
      if (e.pointerType !== 'touch') return
      const target = e.target as HTMLElement | null
      const moveButton = target?.closest<HTMLElement>('[data-touch-move]')
      const control = target?.closest<HTMLElement>('[data-touch]')
      if (moveButton) {
        e.preventDefault()
        this.method = 'touch'
        const direction = moveButton.dataset.touchMove as 'left' | 'right'
        if (direction === 'left' || direction === 'right') this.touchStrafe.add(direction)
        moveButton.setPointerCapture?.(e.pointerId)
        return
      }
      if (!control) return
      e.preventDefault()
      this.method = 'touch'
      const kind = control.dataset.touch
      if (kind === 'move') {
        this.touchMoveId = e.pointerId
        this.updateTouchMove(e, control)
      } else if (kind === 'look') {
        this.touchLookId = e.pointerId
        this.touchLookLast.x = e.clientX
        this.touchLookLast.y = e.clientY
      } else if (kind) {
        const action = kind as Action
        this.touchHeld.add(action)
        this.press(action)
      }
      control.setPointerCapture?.(e.pointerId)
    })
    on(window, 'pointermove', e => {
      if (e.pointerType !== 'touch') return
      if (e.pointerId === this.touchMoveId) {
        e.preventDefault()
        const control = document.querySelector<HTMLElement>('[data-touch="move"]')
        if (control) this.updateTouchMove(e, control)
      } else if (e.pointerId === this.touchLookId) {
        e.preventDefault()
        this.look.x += (e.clientX - this.touchLookLast.x) * 0.0042
        this.look.y += (e.clientY - this.touchLookLast.y) * 0.0036
        this.touchLookLast.x = e.clientX
        this.touchLookLast.y = e.clientY
      }
    })
    const releaseTouch = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return
      if (e.pointerId === this.touchMoveId) {
        this.touchMoveId = undefined
        this.touchMove.x = 0
        this.touchMove.y = 0
        this.updateTouchVisual(0, 0)
      }
      if (e.pointerId === this.touchLookId) this.touchLookId = undefined
      const target = e.target as HTMLElement | null
      const moveButton = target?.closest<HTMLElement>('[data-touch-move]')
      if (moveButton) {
        const direction = moveButton.dataset.touchMove as 'left' | 'right'
        if (direction === 'left' || direction === 'right') this.touchStrafe.delete(direction)
      }
      const kind = target?.closest<HTMLElement>('[data-touch]')?.dataset.touch
      if (kind && kind !== 'move' && kind !== 'look') this.touchHeld.delete(kind as Action)
    }
    on(window, 'pointerup', releaseTouch)
    on(window, 'pointercancel', releaseTouch)
  }

  private updateTouchMove(e: PointerEvent, control: HTMLElement): void {
    const r = control.getBoundingClientRect()
    const max = Math.max(24, Math.min(r.width, r.height) * 0.34)
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    const len = Math.hypot(dx, dy)
    const k = len > max ? max / len : 1
    this.touchMove.x = (dx * k) / max
    this.touchMove.y = (-dy * k) / max
    this.updateTouchVisual(this.touchMove.x, this.touchMove.y)
  }

  private updateTouchVisual(x: number, y: number): void {
    const knob = document.querySelector<HTMLElement>('[data-touch-knob]')
    if (knob) knob.style.transform = `translate(calc(-50% + ${x * 34}px), calc(-50% - ${y * 34}px))`
  }

  private press(action: Action): void {
    this.pressed_.set(action, performance.now())
  }

  /** Test hook: headless browsers cannot take pointer lock. */
  debugLock = false
  get locked(): boolean {
    return this.debugLock || document.pointerLockElement === this.canvas
  }

  lockPointer(): void {
    if (document.pointerLockElement === this.canvas) return
    try {
      const r = (this.canvas.requestPointerLock as (o?: unknown) => Promise<void> | undefined)?.call(this.canvas, { unadjustedMovement: true })
      r?.catch?.(() => this.canvas.requestPointerLock?.()?.catch?.(() => undefined))
    } catch {
      this.canvas.requestPointerLock?.()
    }
  }

  unlockPointer(): void {
    if (document.pointerLockElement) document.exitPointerLock()
    this.mouse.clear()
  }

  update(): void {
    const k = (codes: string[]) => codes.some(code => this.keys.has(code))
    let x = (k(MOVE_KEYS.right) ? 1 : 0) - (k(MOVE_KEYS.left) ? 1 : 0)
    let y = (k(MOVE_KEYS.up) ? 1 : 0) - (k(MOVE_KEYS.down) ? 1 : 0)
    const strafe = (this.touchStrafe.has('right') ? 1 : 0) - (this.touchStrafe.has('left') ? 1 : 0)
    if (this.touchMoveId !== undefined || this.touchMove.x !== 0 || this.touchMove.y !== 0) {
      x = this.touchMove.x
      y = this.touchMove.y
    }
    if (strafe !== 0) x = Math.max(-1, Math.min(1, x + strafe))
    this.held_.clear()
    for (const [action, codes] of Object.entries(KEY_BINDINGS) as [Action, string[]][]) {
      if (k(codes)) this.held_.add(action)
    }
    if (this.mouse.has(0)) this.held_.add('fire')
    if (this.mouse.has(2)) this.held_.add('ads')
    for (const action of this.touchHeld) this.held_.add(action)
    const pad = navigator.getGamepads?.().find(p => p && p.connected)
    if (pad) {
      const dead = (v: number) => (Math.abs(v) < 0.16 ? 0 : v)
      const lx = dead(pad.axes[0] ?? 0)
      const ly = dead(pad.axes[1] ?? 0)
      const rx = dead(pad.axes[2] ?? 0)
      const ry = dead(pad.axes[3] ?? 0)
      const active = lx !== 0 || ly !== 0 || rx !== 0 || ry !== 0 || pad.buttons.some(b => b.pressed)
      if (active) this.method = 'gamepad'
      if (lx !== 0 || ly !== 0) {
        x = lx
        y = -ly
      }
      const curve = (v: number) => Math.sign(v) * v * v
      this.look.x += curve(rx) * 0.05
      this.look.y += curve(ry) * 0.04
      const now = new Set<Action>()
      for (const [action, buttons] of Object.entries(PAD_BINDINGS) as [Action, number[]][]) {
        if (buttons.some(i => (pad.buttons[i]?.value ?? 0) > 0.4 || pad.buttons[i]?.pressed)) now.add(action)
      }
      for (const action of now) {
        this.held_.add(action)
        if (!this.padPrev.has(action)) this.press(action)
      }
      this.padPrev = now
    }
    const len = Math.hypot(x, y)
    this.move.x = len > 1 ? x / len : x
    this.move.y = len > 1 ? y / len : y
  }

  /** Test-only: actions forced held by the headless probes. */
  debugHeld = new Set<string>()
  held(action: Action): boolean {
    return this.held_.has(action) || this.debugHeld.has(action)
  }
  pressed(action: Action): boolean {
    return this.pressed_.has(action)
  }
  consume(action: Action): boolean {
    return this.pressed_.delete(action)
  }
  takeLook(): { x: number; y: number } {
    const out = { x: this.look.x * this.sensitivity, y: this.look.y * this.sensitivity * (this.invertY ? -1 : 1) }
    this.look.x = 0
    this.look.y = 0
    return out
  }
  /** Drop presses nobody consumed within PRESS_TTL (they were offered to at least one sim step). */
  endFrame(): void {
    const now = performance.now()
    for (const [a, t] of this.pressed_) if (now - t > PRESS_TTL) this.pressed_.delete(a)
  }
  /** Debug/test hook: inject an edge-triggered press. */
  debugPress(action: Action): void {
    this.press(action)
  }
  dispose(): void {
    for (const off of this.listeners) off()
    this.listeners = []
  }
}
