import { createGameApp } from './app.mjs'
import { leaderboard } from './leaderboard.mjs'

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required')
const app = createGameApp({ leaderboard })
const port = Number(process.env.PORT || 3000)
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT')
app.listen(port, '0.0.0.0')
