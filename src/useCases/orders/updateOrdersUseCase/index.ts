import { UpdateOrdersControllerExpress } from './updateOrdersControllerExpress'
import { UpdateOrderUseCase } from './updateOrdersUseCase'
import { OrdersRepository } from './../../../repositories/implementations/OrdersRepository'

const ordersRepository = new OrdersRepository()
const updateOrdersUseCase = new UpdateOrderUseCase(ordersRepository)

const updateOrdersControllerExpress = new UpdateOrdersControllerExpress(updateOrdersUseCase)

export { updateOrdersControllerExpress, updateOrdersUseCase }
