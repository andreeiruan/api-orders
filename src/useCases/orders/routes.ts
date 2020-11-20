import { createOrderController } from './createOrderUseCase'
import { listOrdersControllerExpress } from './listOrdersUseCase'
import { Router } from 'express'

const routerOrders = Router()

routerOrders.post('/orders', (req, res) => createOrderController.handle(req, res))
routerOrders.get('/orders', (req, res) => listOrdersControllerExpress.handle(req, res))

export { routerOrders }
