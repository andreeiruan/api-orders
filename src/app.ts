import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'

import { routerOrders } from './useCases/orders/routes'

class Application {
  public readonly server = express()
  constructor () {
    this.mongoConnect()
    this.middlewares()
    this.routes()
  }

  middlewares () {
    this.server.use((req, res, next) => {
      res.set('X-Powered-By', 'PHP/7.1.7')
      return next()
    })
    this.server.use(express.json())
    this.server.use(morgan('dev'))
  }

  routes () {
    this.server.use(routerOrders)
  }

  mongoConnect () {
    mongoose.connect('mongodb://localhost:27017/orders', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
      .then(() => console.log('Connected to cluster mongo atlas'))
      .catch(err => console.log(`Error connecting to the cluster: ${err}`))
  }
}

const app = new Application().server
export { app }
