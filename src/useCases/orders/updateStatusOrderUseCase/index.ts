import { UpdateStatusOrderUseCase } from './updateStatusOrderUseCase'
import { UpdateStatusOrderControllerExpress } from './UpdateStatusOrderControllerExpress'
import { OrdersRepository } from '../../../repositories/implementations/OrdersRepository'

import { DbServices } from '../../../database/DbServices'

const dbServices = new DbServices()

const ordersRepository = new OrdersRepository(dbServices)
const updateStatusOrderUseCase = new UpdateStatusOrderUseCase(ordersRepository)
const updateStatusOrderController = new UpdateStatusOrderControllerExpress(updateStatusOrderUseCase)

export { updateStatusOrderController, updateStatusOrderUseCase }
