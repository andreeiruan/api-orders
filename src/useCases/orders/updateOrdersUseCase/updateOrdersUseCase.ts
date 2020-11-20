import { NotFoundError } from './../../../helpers/errors/notFoundError'
import { InvalidParamError } from './../../../helpers/errors/InvalidParamError'
import { ServerError } from './../../../helpers/errors/serverError'
import { HttpResponse, IHttpResponse } from './../../../helpers/HttpResponse'
import { IOrdersRepository } from 'src/repositories/IOrdersRespository'
import { IUpdateOrdersUseCaseDTO } from './IUpdateOrdersUseCaseDTO'

export class UpdateOrderUseCase {
  private ordersRepository: IOrdersRepository
  constructor (ordersRepository: IOrdersRepository) {
    this.ordersRepository = ordersRepository
  }

  async execute (data: IUpdateOrdersUseCaseDTO): Promise<IHttpResponse> {
    try {
      const { id, table, description, orderNumber, status } = data

      if (!this.ordersRepository.validatedTypeId(id)) {
        return HttpResponse.invalidArgument(new InvalidParamError('id'))
      }

      const orderExists = await this.ordersRepository.findById(id)
      if (!orderExists) {
        return HttpResponse.notFound(new NotFoundError('orders by id'))
      }

      const orders = await this.ordersRepository.update(id, { table, description, orderNumber, status })

      return HttpResponse.updated(orders)
    } catch (error) {
      return HttpResponse.serverError(new ServerError())
    }
  }
}
