import { OrdersRepository } from '../../../repositories/implementations/OrdersRepository'
import { CreateOrderUseCase } from './createOrderUseCase'
import { CreateOrderController } from './createOrderControllerExpress'
import { DbServices } from '../../../database/DbServices'

const dbServices = new DbServices()

const ordersRepository = new OrdersRepository(dbServices)

const createOrderUseCase = new CreateOrderUseCase(ordersRepository)

const createOrderController = new CreateOrderController(createOrderUseCase)

export { createOrderController, createOrderUseCase }
