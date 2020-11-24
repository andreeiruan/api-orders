import { UpdateOrdersControllerExpress } from './updateOrdersControllerExpress'
import { UpdateOrderUseCase } from './updateOrdersUseCase'
import { OrdersRepository } from './../../../repositories/implementations/OrdersRepository'
import { DbServices } from '../../../database/DbServices'

const dbServices = new DbServices()

const ordersRepository = new OrdersRepository(dbServices)
const updateOrdersUseCase = new UpdateOrderUseCase(ordersRepository)

const updateOrdersControllerExpress = new UpdateOrdersControllerExpress(updateOrdersUseCase)

export { updateOrdersControllerExpress, updateOrdersUseCase }
