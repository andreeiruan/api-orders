import { OrdersRepository } from '../../../repositories/implementations/OrdersRepository'
import { CreateOrderUseCase } from './createOrderUseCase'
import { CreateOrderController } from './createOrderControllerExpress'

const ordersRepository = new OrdersRepository()
const createOrderUseCase = new CreateOrderUseCase(ordersRepository)

const createOrderController = new CreateOrderController(createOrderUseCase)

export { createOrderController, createOrderUseCase }
