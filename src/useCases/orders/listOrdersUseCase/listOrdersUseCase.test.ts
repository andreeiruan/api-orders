import { ListOrderControllerExpress } from './listOrdersControllerExpress'
import { ServerError } from './../../../helpers/errors/serverError'
import { IOrdersAttributes, IOrdersRepository, OrderStatus } from './../../../repositories/IOrdersRespository'
import { OrdersRepository } from './../../../repositories/implementations/OrdersRepository'
import { ListOrdersUseCase } from './listOrdersUseCase'
import { app } from '../../../app'
import request from 'supertest'
import { config } from 'dotenv'
import { Order } from 'src/entities/Order'

config({ path: String(process.env.NODE_ENV).trim() === 'test' ? '.env.test' : '.env' })

const makeSut = () => {
  const ordersRepository = new OrdersRepository()
  const sut = new ListOrdersUseCase(ordersRepository)

  return { sut, ordersRepository }
}

const makeSutSpy = () => {
  class OrdersRepositorySpy implements IOrdersRepository {
    create (order: IOrdersAttributes): Promise<Order> {
      console.log(order)
      throw new Error('Method not implemented.')
    }

    list (): Promise<Order[]> {
      throw new Error('Method not implemented.')
    }

    updateStatus (id: string, status: OrderStatus): Promise<Order> { // eslint-disable-line
      throw new Error('Method not implemented.')
    }

    update (id: string, order: IOrdersAttributes): Promise<Order> { // eslint-disable-line
      throw new Error('Method not implemented.')
    }

    drop (): Promise<void> {
      throw new Error('Method not implemented.')
    }

    connect (): Promise<void> {
      throw new Error('Method not implemented.')
    }

    disconnect (): Promise<void> {
      throw new Error('Method not implemented.')
    }
  }

  const ordersRepository = new OrdersRepositorySpy()
  const sut = new ListOrdersUseCase(ordersRepository)

  const controllerSut = new ListOrderControllerExpress(sut)

  return { sut, controllerSut }
}

describe('List Orders UseCase', () => {
  afterAll(async () => {
    const { ordersRepository } = makeSut()
    await ordersRepository.drop()
  })
  it('Should return 200 and list of orders', async () => {
    const { sut } = makeSut()

    const { statusCode } = await sut.execute()

    expect(statusCode).toBe(200)
  })

  it('Should return 200 and list of orders to execute ListOrdersControllerExpress', async () => {
    const response = await request(app)
      .get('/orders')

    expect(response.status).toBe(200)
  })

  it('Should returns 500 if you have any internal errors in ListOrdersUseCase', async () => {
    const { sut } = makeSutSpy()
    const { statusCode, body } = await sut.execute()

    expect(statusCode).toBe(500)
    expect(body).toEqual({ error: new ServerError().message })
  })

  it('Should returns 500 if you have any internal errors in ListOrdersControllerExpress', async () => {
    const { controllerSut } = makeSutSpy()

    app.get('/ordersSpy', (req, res) => controllerSut.handle(req, res))

    const response = await request(app)
      .get('/ordersSpy')

    expect(response.status).toBe(500)
  })
})
