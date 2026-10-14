export const BRT_PROTOCOL_VERSION = 'brt-v1'

export type LobbyState = 'unavailable' | 'idle' | 'creating' | 'joined' | 'reconnecting'
export type LobbySnapshot = {
  state: LobbyState
  roomCode?: string
  playerCount: number
  capacity: number
  reason: string
}

/**
 * Client-side seam for the authoritative room service.
 * The server owns rooms, seats and snapshots; this fallback never simulates a fake match.
 */
export class InviteLobby {
  private snapshot: LobbySnapshot = {
    state: 'unavailable',
    playerCount: 0,
    capacity: 5,
    reason: 'Servidor multiplayer ainda não configurado',
  }

  get state(): LobbySnapshot {
    return { ...this.snapshot }
  }

  async connect(_roomCode?: string): Promise<LobbySnapshot> {
    this.snapshot = {
      ...this.snapshot,
      state: 'unavailable',
      reason: 'Disponível quando o B.R.T. tiver um servidor WSS alojado',
    }
    return this.state
  }

  disconnect(): void {
    this.snapshot = { ...this.snapshot, state: 'unavailable', roomCode: undefined, playerCount: 0 }
  }
}
