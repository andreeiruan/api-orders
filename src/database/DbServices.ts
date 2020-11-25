import { IDbServices } from './IDbServices'
import mongoose from 'mongoose'
import { config } from 'dotenv'
config({ path: String(process.env.NODE_ENV).trim() === 'test' ? '.env.test' : '.env' })

export class DbServices implements IDbServices {
  async connect (): Promise<void> {
    const {
      MONGO_USERNAME,
      MONGO_PASSWORD,
      MONGO_HOSTNAME,
      MONGO_PORT,
      MONGO_DB
    } = process.env

    const mongoConfig = {
      url: `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      }
    }

    try {
      await mongoose.connect(mongoConfig.url, mongoConfig.options)
    } catch (error) {
      console.error(`Connect db error: ${error.message || 'unexpected error'}`)
    }
  }

  async disconnect (): Promise<void> {
    mongoose.disconnect()
  }
}
