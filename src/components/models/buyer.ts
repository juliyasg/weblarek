import { IBuyer, TPayment } from '../../types/index.ts';

export class Buyer {
  payment: TPayment | null = null;
  email: string = '';
  phone: string = '';
  address: string = '';

  constructor() {}

  saveBuyerData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
  }

  getBuyerData(): IBuyer {
    return {
      payment: this.payment as TPayment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear(): void {
    this.payment = null;
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  validateBuyerData(): { [key in keyof IBuyer]?: string } {
    const errors: { [key in keyof IBuyer]?: string } = {};
    if (!this.payment) {
      errors.payment = 'Способ оплаты не выбран';
    }
    if (!this.email.trim()) {
      errors.email = 'Email не может быть пустым';
    }
    if (!this.phone.trim()) {
      errors.phone = 'Телефон не может быть пустым';
    }
    if (!this.address.trim()) {
      errors.address = 'Адрес не может быть пустым';
    }
    return errors;
  }
}