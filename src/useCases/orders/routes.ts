import { createOrderController } from './createOrderUseCase'
import { listOrdersControllerExpress } from './listOrdersUseCase'
import { updateStatusOrderController } from './updateStatusOrderUseCase'
import { Router } from 'express'

const routerOrders = Router()

routerOrders.post('/orders', (req, res) => createOrderController.handle(req, res))
routerOrders.get('/orders', (req, res) => listOrdersControllerExpress.handle(req, res))
routerOrders.patch('/orders/:id', (req, res) => updateStatusOrderController.handle(req, res))

export { routerOrders }
