import { IApi, IProduct, IOrder } from '../../types/index.ts';

export class ApiWebLarek {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProduct[]> {
    return this.api.get<{ items: IProduct[] }>('/product/').then(data => data.items);
  }

  sendOrder(order: IOrder): Promise<{}> {
    return this.api.post<{}>('/order/', order);
  }
}