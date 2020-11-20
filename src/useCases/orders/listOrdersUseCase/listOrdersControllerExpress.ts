import { Request, Response } from 'express'
import { ListOrdersUseCase } from './listOrdersUseCase'

export class ListOrderControllerExpress {
  private listOrdersUseCase : ListOrdersUseCase
  constructor (listOrdersUseCase : ListOrdersUseCase) {
    this.listOrdersUseCase = listOrdersUseCase
  }

  async handle (request: Request, response: Response): Promise<Response> {
    try {
      const { statusCode, body } = await this.listOrdersUseCase.execute()
      return response.status(statusCode).json(body)
    } catch (error) {
      return response.status(500).json({ error: error.message || 'Unexpected Error' })
    }
  }
}
