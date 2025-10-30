import { IProduct } from '../../types/index.ts';
import { IEvents } from '../base/Events.ts';

export class Catalog {
  private productsList: IProduct[] = [];
  private productSelected: IProduct | null = null;

  constructor(private events: IEvents) {}

  saveProducts(productsList: IProduct[]): void {
    this.productsList = productsList;
    this.events.emit('catalog:changed', { items: this.productsList });
  }

  getProducts(): IProduct[] {
    return this.productsList;
  }

  getProductById(id: string): IProduct | undefined {
    return this.productsList.find(product => product.id === id);
  }

  saveSelectedProduct(product: IProduct): void {
    this.productSelected = product;
    this.events.emit('catalog:selected', { product });
  }

  getSelectedProduct(): IProduct | null {
    return this.productSelected;
  }
}