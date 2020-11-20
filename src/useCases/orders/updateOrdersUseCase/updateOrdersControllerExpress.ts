import { Request, Response } from 'express'
import { UpdateOrderUseCase } from './updateOrdersUseCase'

export class UpdateOrdersControllerExpress {
  private updateOrdersUseCase : UpdateOrderUseCase
  constructor (updateOrdersUseCase: UpdateOrderUseCase) {
    this.updateOrdersUseCase = updateOrdersUseCase
  }

  async handle (request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.params
      const { table, description, orderNumber, status } = request.body
      const { statusCode, body } = await this.updateOrdersUseCase.execute({ id, table, description, orderNumber, status })
      return response.status(statusCode).json(body)
    } catch (error) {
      return response.status(500).json({ error: error.message || 'Unexpected Error' })
    }
  }
}
