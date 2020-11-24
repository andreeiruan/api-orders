import { CreateOrderUseCase } from '../createOrderUseCase/createOrderUseCase'
import { OrdersRepository } from '../../../repositories/implementations/OrdersRepository'
import { IOrdersAttributes, IOrdersRepository, OrderStatus } from '../../../repositories/IOrdersRespository'
import { UpdateOrderUseCase } from './updateOrdersUseCase'
import { UpdateOrdersControllerExpress } from './updateOrdersControllerExpress'
import { Order } from '../../../entities/Order'
import { ServerError } from '../../../helpers/errors/serverError'
import { InvalidParamError } from '../../../helpers/errors/InvalidParamError'
import { NotFoundError } from '../../../helpers/errors/notFoundError'
import request from 'supertest'
import faker from 'faker'
import { app } from '../../../app'
import { DbServices } from '../../../database/DbServices'
import { IDbServices } from '../../../database/IDbServices'

import { config } from 'dotenv'

config({ path: String(process.env.NODE_ENV).trim() === 'test' ? '.env.test' : '.env' })

const makeSut = () => {
  const dbServices = new DbServices()
  const ordersRepository = new OrdersRepository(dbServices)
  const createOrderSut = new CreateOrderUseCase(ordersRepository)
  const sut = new UpdateOrderUseCase(ordersRepository)

  return { createOrderSut, ordersRepository, sut }
}

const createOrderFake = async () => {
  const { createOrderSut } = makeSut()

  const bodyFake = {
    table: faker.random.number(),
    description: faker.random.words(),
    orderNumber: faker.random.number()
  }

  const { body: { _id } } = await createOrderSut.execute(bodyFake)

  return _id
}

const makeSutSpy = () => {
  class OrdersRepositorySpy implements IOrdersRepository {
    readonly _dbServices : IDbServices

    constructor (dbServices: IDbServices) {
      this._dbServices = dbServices
    }
   validatedTypeId (id: string): boolean { // eslint-disable-line
      throw new Error('Method not implemented.')
    }
   findById (id: string): Promise<Order> { // eslint-disable-line
      throw new Error('Method not implemented.')
    }
   create (order: IOrdersAttributes): Promise<Order> { // eslint-disable-line
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

  const dbServices = new DbServices()
  const ordersRepository = new OrdersRepositorySpy(dbServices)
  const sut = new UpdateOrderUseCase(ordersRepository)

  const controllerSut = new UpdateOrdersControllerExpress(sut)

  return { sut, controllerSut }
}
describe('updateOrdersUseCase', () => {
  it('Should return 422 if id is in invalid format', async () => {
    const { sut } = makeSut()

    const { statusCode, body } = await sut.execute({ id: 'any_id', status: 'DONE' })

    expect(statusCode).toBe(422)
    expect(body).toEqual({ error: new InvalidParamError('id').message })
  })

  it('Should return 404 if do not find order by id', async () => {
    const { sut } = makeSut()

    const { statusCode, body } = await sut.execute({ id: '5fb6887ea7cf0e212cc08be3', status: 'DONE' })

    expect(statusCode).toBe(404)
    expect(body).toEqual({ error: new NotFoundError('orders by id').message })
  })

  it('Should return 201 if updateStatus is correct', async () => {
    const { sut } = makeSut()

    const id = await createOrderFake()

    const { statusCode } = await sut.execute({ id: id, status: 'DONE' })

    expect(statusCode).toBe(202)
  })

  it('Should returns 500 if you have any internal errors in UpdateStatusOrderControllerExpress', async () => {
    const { controllerSut } = makeSutSpy()

    const id = await createOrderFake()

    app.patch('/ordersSpy/:id', async (req, res) => await controllerSut.handle(req, res))

    const response = await request(app)
      .patch(`/ordersSpy/${id}`)
      .send({ orderStatus: 'DONE' })

    expect(response.status).toBe(500)
    expect(response.body).toEqual({ error: new ServerError().message })
  })

  it('Should returns 202 if updated the order at the database', async () => {
    const id = await createOrderFake()

    const response = await request(app)
      .put(`/orders/${id}`)
      .send({ description: faker.random.words(), table: faker.random.number() })

    expect(response.status).toBe(202)
  })
})
