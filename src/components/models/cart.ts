import { IProduct } from '../../types/index.ts';

export class Cart {
  private cartProducts: IProduct[] = [];

  constructor() {}

  getCartProducts(): IProduct[] {
    return this.cartProducts;
  }

  addCartProduct(product: IProduct): void {
    if (!this.hasProductById(product.id)) {
      this.cartProducts.push(product);
    }
  }

  removeCartProductId(id: string): void {
    this.cartProducts = this.cartProducts.filter(product => product.id !== id);
  }

  clearCartProducts(): void {
    this.cartProducts = [];
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
