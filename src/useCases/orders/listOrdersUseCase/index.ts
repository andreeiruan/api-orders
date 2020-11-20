import { ListOrderControllerExpress } from './listOrdersControllerExpress'
import { ListOrdersUseCase } from './listOrdersUseCase'
import { OrdersRepository } from '../../../repositories/implementations/OrdersRepository'

const ordersRepository = new OrdersRepository()

const listOrdersUseCase = new ListOrdersUseCase(ordersRepository)

const listOrdersControllerExpress = new ListOrderControllerExpress(listOrdersUseCase)

export { listOrdersUseCase, listOrdersControllerExpress }
