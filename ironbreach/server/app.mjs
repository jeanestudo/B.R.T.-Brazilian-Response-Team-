import express from 'express'

export function createGameApp({ leaderboard } = {}) {
  const app = express()
  app.disable('x-powered-by')
  if (leaderboard) app.use(leaderboard.middleware)
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
  return app
}
