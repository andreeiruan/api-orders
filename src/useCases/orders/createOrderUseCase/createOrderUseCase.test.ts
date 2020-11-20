import { CreateOrderUseCase } from '../createOrderUseCase/createOrderUseCase'
import { OrdersRepository } from '../../../repositories/implementations/OrdersRepository'
import { MissingParamError } from '../../../helpers/errors/missingParamError'
import request from 'supertest'
import faker from 'faker'
import { app } from '../../../app'

import { config } from 'dotenv'

config({ path: String(process.env.NODE_ENV).trim() === 'test' ? '.env.test' : '.env' })

const makeSut = () => {
  const ordersRepository = new OrdersRepository()
  const sut = new CreateOrderUseCase(ordersRepository)

  return { sut, ordersRepository }
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
})
