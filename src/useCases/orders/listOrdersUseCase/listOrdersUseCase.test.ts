import { OrdersRepository } from './../../../repositories/implementations/OrdersRepository'
import { ListOrdersUseCase } from './listOrdersUseCase'
import { app } from '../../../app'
import request from 'supertest'
import { config } from 'dotenv'
config({ path: String(process.env.NODE_ENV).trim() === 'test' ? '.env.test' : '.env' })

const makeSut = () => {
  const ordersRepository = new OrdersRepository()
  const sut = new ListOrdersUseCase(ordersRepository)

  return { sut, ordersRepository }
}

describe('List Orders UseCase', () => {
  afterAll(async () => {
    const { ordersRepository } = makeSut()
    await ordersRepository.drop()
  })
  it('Should OrdersRepository return 200 and list of orders', async () => {
    const { sut } = makeSut()

    const { statusCode } = await sut.execute()

    expect(statusCode).toBe(200)
  })

  it('Should OrdersRepository return 200 and list of orders to execute ListOrdersControllerExpress', async () => {
    const response = await request(app)
      .get('/orders')

    expect(response.status).toBe(200)
  })
  it('teste', () => {
    const a = 3
    const b = 2
    const r = a + b

    expect(r).toBe(5)
  })
})
