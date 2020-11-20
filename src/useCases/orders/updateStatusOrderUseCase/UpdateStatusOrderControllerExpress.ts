import { Request, Response } from 'express'
import { UpdateStatusOrderUseCase } from './updateStatusOrderUseCase'

export class UpdateStatusOrderControllerExpress {
  private updateStatusOrderUseCase: UpdateStatusOrderUseCase
  constructor (updateStatusOrderUseCase: UpdateStatusOrderUseCase) {
    this.updateStatusOrderUseCase = updateStatusOrderUseCase
  }

  async handle (request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.params
      const { orderStatus } = request.body
      const { statusCode, body } = await this.updateStatusOrderUseCase.execute({ id, orderStatus })
      return response.status(statusCode).json(body)
    } catch (error) {
      return response.status(500).json({ error: error.message || 'Unexpected Error' })
    }
  }
}
