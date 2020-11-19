import { createOrderController } from './createOrderUseCase'
import { Router } from 'express'

const routerOrders = Router()

routerOrders.post('/orders', (req, res) => createOrderController.handle(req, res))

export { routerOrders }
