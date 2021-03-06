import { IOrdersRepository } from './../../../repositories/IOrdersRespository'
import { InvalidParamError } from './../../../helpers/errors/InvalidParamError'
import { NotFoundError } from './../../../helpers/errors/notFoundError'
import { MissingParamError } from './../../../helpers/errors/missingParamError'
import { HttpResponse, IHttpResponse } from './../../../helpers/HttpResponse'
import { IUpdateStatusOrderRequestDTO } from './IUpdateStatusOrderRequestDTO'
import { ServerError } from '../../../helpers/errors/serverError'

export class UpdateStatusOrderUseCase {
  private ordersRepository: IOrdersRepository
  constructor (ordersRepository: IOrdersRepository) {
    this.ordersRepository = ordersRepository
  }

  async execute (data: IUpdateStatusOrderRequestDTO): Promise<IHttpResponse> {
    try {
      const { id, orderStatus } = data
      if (!orderStatus) {
        return HttpResponse.badRequest(new MissingParamError('orderStatus'))
      }

      if (['PENDING', 'PREPARING', 'DONE', 'CANCELED'].indexOf(orderStatus) < 0) {
        return HttpResponse.invalidArgument(new InvalidParamError('OrderStatus'))
      }

      if (!this.ordersRepository.validatedTypeId(id)) {
        return HttpResponse.invalidArgument(new InvalidParamError('id'))
      }
      const orderExists = await this.ordersRepository.findById(id)
      if (!orderExists) {
        return HttpResponse.notFound(new NotFoundError('order by id'))
      }

      const order = await this.ordersRepository.updateStatus(id, orderStatus)
      return HttpResponse.updated(order)
    } catch (error) {
      return HttpResponse.serverError(new ServerError())
    }
  }
}
