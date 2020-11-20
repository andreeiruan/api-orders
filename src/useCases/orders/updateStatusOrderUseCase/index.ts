import { UpdateStatusOrderUseCase } from './updateStatusOrderUseCase'
import { UpdateStatusOrderControllerExpress } from './UpdateStatusOrderControllerExpress'
import { OrdersRepository } from '../../../repositories/implementations/OrdersRepository'

const ordersRepository = new OrdersRepository()
const updateStatusOrderUseCase = new UpdateStatusOrderUseCase(ordersRepository)
const updateStatusOrderController = new UpdateStatusOrderControllerExpress(updateStatusOrderUseCase)

export { updateStatusOrderController, updateStatusOrderUseCase }
