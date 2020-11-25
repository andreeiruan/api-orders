import express from 'express'
import morgan from 'morgan'

import { routerOrders } from './useCases/orders/routes'

class Application {
  public readonly server = express()
  constructor () {
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
}

const app = new Application().server
export { app }
