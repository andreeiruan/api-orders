import { IHttpResponse, HttpResponse } from './../../../helpers/HttpResponse'
import { IOrdersRepository } from './../../../repositories/IOrdersRespository'
import { ServerError } from '../../../helpers/errors/serverError'

export class ListOrdersUseCase {
  private ordersRepository : IOrdersRepository
  constructor (ordersRepository : IOrdersRepository) {
    this.ordersRepository = ordersRepository
  }

  async execute (): Promise<IHttpResponse> {
    try {
      const orders = await this.ordersRepository.list()
      return HttpResponse.ok(orders)
    } catch (error) {
      return HttpResponse.serverError(new ServerError())
    }
  }
}
