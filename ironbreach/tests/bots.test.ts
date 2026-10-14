import { describe, expect, it } from 'vitest'
import { shouldForgetTarget } from '../src/game/bots'

describe('bot target memory', () => {
  it('keeps searching the last known position for five seconds', () => {
    expect(shouldForgetTarget(14.9, 10, false)).toBe(false)
    expect(shouldForgetTarget(15, 10, false)).toBe(true)
  })

  it('forgets a target after reaching the last known position', () => {
    expect(shouldForgetTarget(10.5, 10, true)).toBe(true)
  })
})