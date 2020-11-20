
export interface IHttpResponse {
  statusCode: number,
  body: any // eslint-disable-line
}

export class HttpResponse {
  static badRequest (error: Error) : IHttpResponse {
    return {
      statusCode: 400,
      body: { error: error.message }
    }
  }

  static created (data: any) : IHttpResponse { // eslint-disable-line
    return {
      statusCode: 201,
      body: data
    }
  }

  static ok(data: any) : IHttpResponse{ // eslint-disable-line       
    return {
      statusCode: 200,
      body: data
    }
  }

  static serverError (error: Error): IHttpResponse {
    return {
      statusCode: 500,
      body: { error: error.message }
    }
  }
}
