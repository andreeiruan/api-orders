import { app } from './app'

import { config } from 'dotenv'
config({ path: String(process.env.NODE_ENV).trim() === 'test' ? '.env.test' : '.env' })

const PORT: number = Number(process.env.SERVER_PORT) || 3000

app.listen(PORT, () => {
  console.log(`Server in running on port ${PORT}!`)
})
