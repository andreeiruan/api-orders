import { IDbServices } from './IDbServices'
import mongoose from 'mongoose'

export class DbServices implements IDbServices {
  async connect (): Promise<void> {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
  }

  async disconnect (): Promise<void> {
    mongoose.disconnect()
  }
}
