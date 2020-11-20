import { ServerError } from './../../../helpers/errors/serverError'
import { IOrdersRepository } from './../../../repositories/IOrdersRespository'
import { ICreateOrderRequestDTO } from './CreateOrderDTO'
import { HttpResponse, IHttpResponse } from '../../../helpers/HttpResponse'
import { MissingParamError } from '../../../helpers/errors/missingParamError'

export class CreateOrderUseCase {
  private ordersRepository: IOrdersRepository
  constructor (ordersRepository: IOrdersRepository) {
    this.ordersRepository = ordersRepository
  }

  async execute (data: ICreateOrderRequestDTO): Promise<IHttpResponse> {
    try {
      const { table, description, orderNumber } = data
      if (!table || !description || !orderNumber) {
        return HttpResponse.badRequest(new MissingParamError('Table or description or orderNumber'))
      }

      const order = await this.ordersRepository.create({ table, description, orderNumber })

      return HttpResponse.created(order)
    } catch (error) {
      return HttpResponse.serverError(new ServerError())
    }
  }
}
