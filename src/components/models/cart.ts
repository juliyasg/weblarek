import { IProduct } from '../../types/index.ts';
import { IEvents } from '../base/Events.ts';

export class Cart {
  private cartProducts: IProduct[] = [];

  constructor(private events: IEvents) {}

  getCartProducts(): IProduct[] {
    return this.cartProducts;
  }

  addCartProduct(product: IProduct): void {
    if (!this.hasProductById(product.id)) {
      this.cartProducts.push(product);
      this.events.emit('cart:changed', { items: this.cartProducts });
    }
  }

  removeCartProductId(id: string): void {
    this.cartProducts = this.cartProducts.filter(product => product.id !== id);
    this.events.emit('cart:changed', { items: this.cartProducts });
  }

  clearCartProducts(): void {
    this.cartProducts = [];
    this.events.emit('cart:cleared');
  }

  getTotalPrice(): number {
    return this.cartProducts.reduce((sum, product) => sum + (product.price || 0), 0);
  }

  getCount(): number {
    return this.cartProducts.length;
  }

  hasProductById(id: string): boolean {
    return this.cartProducts.some(product => product.id === id);
  }
}
