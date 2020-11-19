import { Request, Response } from 'express'
import { CreateOrderUseCase } from './createOrderUseCase'

export class CreateOrderController {
  private createOrderUseCase: CreateOrderUseCase
  constructor (createOrderUseCase: CreateOrderUseCase) {
    this.createOrderUseCase = createOrderUseCase
  }

  async handle (request: Request, response: Response): Promise<Response> {
    try {
      const { table, description, orderNumber } = request.body
      const { statusCode, body } = await this.createOrderUseCase.execute({ table, description, orderNumber })
      return response.status(statusCode).json(body)
    } catch (error) {
      return response.status(500).json({ error: error.message || 'Unexpected Error' })
    }
  }
}
