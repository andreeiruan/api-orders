import { ListOrderControllerExpress } from './listOrdersControllerExpress'
import { ListOrdersUseCase } from './listOrdersUseCase'
import { OrdersRepository } from '../../../repositories/implementations/OrdersRepository'
import { DbServices } from '../../../database/DbServices'

const dbServices = new DbServices()

const ordersRepository = new OrdersRepository(dbServices)

const listOrdersUseCase = new ListOrdersUseCase(ordersRepository)

const listOrdersControllerExpress = new ListOrderControllerExpress(listOrdersUseCase)

export { listOrdersUseCase, listOrdersControllerExpress }
