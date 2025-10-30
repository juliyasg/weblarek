import { Form, IFormData } from "./form";
import { ensureElement } from "../../../utils/utils";

/**
 * Данные формы заказа
 */
export interface IOrderFormData extends IFormData {
  address: string;
  payment: "card" | "cash" | "";
}

/**
 * Обработчики событий формы заказа
 */
interface IOrderFormActions {
  onInput?: (field: keyof IOrderFormData, value: string) => void;
  onPaymentChange?: (payment: "card" | "cash") => void;
  onSubmit?: (event: SubmitEvent) => void;
}

export class OrderForm extends Form<IOrderFormData> {
  protected addressInput: HTMLInputElement;
  protected cashButton: HTMLButtonElement;
  protected cardButton: HTMLButtonElement;
  protected currentPayment: "card" | "cash" | "" = "";

  constructor(container: HTMLFormElement, actions?: IOrderFormActions) {
    super(container, actions);

    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
    this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);

    this.cashButton.addEventListener("click", () => {
      this.selectPayment("cash", actions?.onPaymentChange);
      this.updateValidState();
    });

    this.cardButton.addEventListener("click", () => {
      this.selectPayment("card", actions?.onPaymentChange);
      this.updateValidState();
    });

    if (actions?.onInput) {
      this.addressInput.addEventListener("input", () => {
        actions.onInput?.("address", this.addressInput.value);
        this.updateValidState();
      });
    }
  }

  get isValid(): boolean {
    return Boolean(this.addressInput.value.trim() && this.currentPayment);
  }

  updateValidState() {
    this.valid = this.isValid;
  }

  protected selectPayment(method: "card" | "cash", callback?: (payment: "card" | "cash") => void): void {
    this.currentPayment = method;

    this.cardButton.classList.toggle("button_alt-active", method === "card");
    this.cashButton.classList.toggle("button_alt-active", method === "cash");

    callback?.(method);
  }

  set address(value: string) {
    this.addressInput.value = value;
    this.updateValidState();
  }

  set payment(value: "card" | "cash" | "") {
    this.currentPayment = value;
    this.cardButton.classList.toggle("button_alt-active", value === "card");
    this.cashButton.classList.toggle("button_alt-active", value === "cash");
    this.updateValidState();
  }

  get value(): IOrderFormData {
    return {
      address: this.addressInput.value,
      payment: this.currentPayment,
    };
  }
}