export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash';

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

export interface IOrder {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

// Ошибки валидации форм (опционально)
export interface IErrors {
	payment?: string;
	email?: string;
	phone?: string;
	address?: string;
}

// События для callback’ов (опциональные интерфейсы для View)
export interface ICardActions {
	onClick?: (event: MouseEvent) => void;
}

export interface IFormActions {
	onSubmit?: (event: SubmitEvent) => void;
	onInput?: (field: string, value: string) => void;
}

export interface IBasketActions {
	onSubmit?: (event: MouseEvent) => void;
}

export interface IModalActions {
	onClose?: () => void;
}

export interface IOrderSuccessActions {
	onClose?: () => void;
}