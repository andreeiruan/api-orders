import { CreateOrderController } from './createOrderControllerExpress'
import { CreateOrderUseCase } from '../createOrderUseCase/createOrderUseCase'
import { OrdersRepository } from '../../../repositories/implementations/OrdersRepository'
import { IOrdersAttributes, IOrdersRepository, OrderStatus } from '../../../repositories/IOrdersRespository'
import { Order } from '../../../entities/Order'
import { MissingParamError } from '../../../helpers/errors/missingParamError'
import { ServerError } from '../../../helpers/errors/serverError'
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
  const sut = new CreateOrderUseCase(ordersRepository)

  return { sut, ordersRepository }
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
  const sut = new CreateOrderUseCase(ordersRepository)

  const controllerSut = new CreateOrderController(sut)

  return { sut, controllerSut }
}

describe('Create Order', () => {
  afterAll(async () => {
    const { ordersRepository } = makeSut()
    await ordersRepository.drop()
  })
  it('Should return  400 if no orderNumber provided', async () => {
    const { sut } = makeSut()
    const { statusCode, body } = await sut.execute({
      table: faker.random.number(),
      description: faker.random.words()
    })
    expect(statusCode).toBe(400)
    expect(body).toEqual({ error: new MissingParamError('Table or description or orderNumber').message })
  })

  it('Should return  400 if no table  is provided', async () => {
    const { sut } = makeSut()
    const { statusCode, body } = await sut.execute({
      description: faker.random.words(),
      orderNumber: faker.random.number()
    })
    expect(statusCode).toBe(400)
    expect(body).toEqual({ error: new MissingParamError('Table or description or orderNumber').message })
  })

  it('Should return  400 if no description is provided', async () => {
    const { sut } = makeSut()
    const { statusCode, body } = await sut.execute({
      table: faker.random.number(),
      orderNumber: faker.random.number()
    })
    expect(statusCode).toBe(400)
    expect(body).toEqual({ error: new MissingParamError('Table or description or orderNumber').message })
  })

  it('Should return 201 if the required data has been validated', async () => {
    const { sut } = makeSut()

    const { statusCode } = await sut.execute({
      table: faker.random.number(),
      description: faker.random.words(),
      orderNumber: faker.random.number()
    })

    expect(statusCode).toBe(201)
  })

  it('Should return 201 if register the order at the database', async () => {
    const body = {
      table: faker.random.number(),
      description: faker.random.words(),
      orderNumber: faker.random.number()
    }

    const response = await request(app)
      .post('/orders')
      .send(body)

    expect(response.status).toBe(201)
    expect(response.body.description).toBe(body.description)
  })

  it('Should returns 500 if you have any internal errors in CreateOrderUseCase', async () => {
    const { sut } = makeSutSpy()
    const bodyFake = {
      table: faker.random.number(),
      description: faker.random.words(),
      orderNumber: faker.random.number()
    }
    const { statusCode, body } = await sut.execute(bodyFake)

    expect(statusCode).toBe(500)
    expect(body).toEqual({ error: new ServerError().message })
  })

  it('Should returns 500 if you have any internal errors in CreateOrderController', async () => {
    const { controllerSut } = makeSutSpy()
    const bodyFake = {
      table: faker.random.number(),
      description: faker.random.words(),
      orderNumber: faker.random.number()
    }

    app.post('/ordersSpy', (req, res) => controllerSut.handle(req, res))

    const response = await request(app)
      .post('/ordersSpy')
      .send(bodyFake)

    expect(response.status).toBe(500)
  })
})
