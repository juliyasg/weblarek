import { IProduct } from '../../types/index.ts';

export class Catalog {
  private productsList: IProduct[] = [];
  private productSelected: IProduct | null = null;
  
  constructor() {}

  saveProducts(productsList: IProduct[]): void {
    this.productsList = productsList;
  }

  getProducts(): IProduct[] {
    return this.productsList;
  }

  getProductById(id: string): IProduct | undefined {
    return this.productsList.find(product => product.id === id);
  }

  saveSelectedProduct(product: IProduct): void {
    this.productSelected = product;
  }

  getSelectedProduct(): IProduct | null {
    return this.productSelected;
  }
}
