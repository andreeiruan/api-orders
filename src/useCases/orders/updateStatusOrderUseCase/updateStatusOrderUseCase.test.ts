import { CreateOrderUseCase } from '../createOrderUseCase/createOrderUseCase'
import { UpdateStatusOrderUseCase } from './updateStatusOrderUseCase'
import { UpdateStatusOrderControllerExpress } from './UpdateStatusOrderControllerExpress'
import { OrdersRepository } from '../../../repositories/implementations/OrdersRepository'
import { IOrdersAttributes, IOrdersRepository, OrderStatus } from '../../../repositories/IOrdersRespository'
import { Order } from '../../../entities/Order'
import { MissingParamError } from '../../../helpers/errors/missingParamError'
import { ServerError } from '../../../helpers/errors/serverError'
import { InvalidParamError } from '../../../helpers/errors/InvalidParamError'
import { NotFoundError } from '../../../helpers/errors/notFoundError'
import request from 'supertest'
import faker from 'faker'
import { app } from '../../../app'

import { config } from 'dotenv'

config({ path: String(process.env.NODE_ENV).trim() === 'test' ? '.env.test' : '.env' })

const makeSut = () => {
  const ordersRepository = new OrdersRepository()
  const createOrderSut = new CreateOrderUseCase(ordersRepository)
  const sut = new UpdateStatusOrderUseCase(ordersRepository)

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

  const ordersRepository = new OrdersRepositorySpy()
  const sut = new UpdateStatusOrderUseCase(ordersRepository)

  const controllerSut = new UpdateStatusOrderControllerExpress(sut)

  return { sut, controllerSut }
}

describe('Update Status', () => {
  afterAll(async () => {
    const { ordersRepository } = makeSut()
    await ordersRepository.drop()
  })

  it('Should return 400 if orderStatus is provided', async () => {
    const { sut } = makeSut()

    const { statusCode, body } = await sut.execute({ id: 'any' })

    expect(statusCode).toBe(400)
    expect(body).toEqual({ error: new MissingParamError('orderStatus').message })
  })

  it('Should return 404 if do not find order by id', async () => {
    const { sut } = makeSut()

    const { statusCode, body } = await sut.execute({ id: '5fb6887ea7cf0e212cc08be3', orderStatus: 'DONE' })

    expect(statusCode).toBe(404)
    expect(body).toEqual({ error: new NotFoundError('order by id').message })
  })

  it('Should return 500 if id is in invalid format', async () => {
    const { sut } = makeSut()

    const { statusCode, body } = await sut.execute({ id: 'any_id', orderStatus: 'DONE' })

    expect(statusCode).toBe(500)
    expect(body).toEqual({ error: new ServerError().message })
  })

  it('Should return 422 if orderStatus invalid value', async () => {
    const { sut } = makeSut()

    const { statusCode, body } = await sut.execute({ id: 'any', orderStatus: 'invalid_status' })

    expect(statusCode).toBe(422)
    expect(body).toEqual({ error: new InvalidParamError('OrderStatus').message })
  })

  it('Should return 201 if updateStatus is correct', async () => {
    const { sut } = makeSut()

    const id = await createOrderFake()

    const { statusCode } = await sut.execute({ id: id, orderStatus: 'DONE' })

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
  })

  it('Should returns 202 if updated the order at the database', async () => {
    const id = await createOrderFake()

    const response = await request(app)
      .patch(`/orders/${id}`)
      .send({ orderStatus: 'DONE' })

    expect(response.status).toBe(202)
  })
})
