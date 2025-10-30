import { Form, IFormData } from "./form";
import { ensureElement } from "../../../utils/utils";

export interface IOrderFormData extends IFormData {
  address: string;
  payment: "card" | "cash" | "";
}

interface IOrderFormActions {
  onInput?: (field: keyof IOrderFormData, value: string) => void;
  onPaymentChange?: (payment: "card" | "cash") => void;
  onSubmit?: (event: SubmitEvent) => void;
}

export class OrderForm extends Form<IOrderFormData> {
  private addressInput: HTMLInputElement;
  private cashButton: HTMLButtonElement;
  private cardButton: HTMLButtonElement;
  private currentPayment: "card" | "cash" | "" = "";

  constructor(container: HTMLFormElement, actions?: IOrderFormActions) {
    super(container, actions);

    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
    this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);

    this.cashButton.addEventListener("click", () => {
      this.selectPayment("cash", actions?.onPaymentChange);
    });

    this.cardButton.addEventListener("click", () => {
      this.selectPayment("card", actions?.onPaymentChange);
    });

    if (actions?.onInput) {
      this.addressInput.addEventListener("input", () => {
        actions.onInput?.("address", this.addressInput.value);
      });
    }
  }

  private selectPayment(method: "card" | "cash", callback?: (payment: "card" | "cash") => void): void {
    this.currentPayment = method;

    this.cardButton.classList.toggle("button_alt-active", method === "card");
    this.cashButton.classList.toggle("button_alt-active", method === "cash");

    callback?.(method);
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  set payment(value: "card" | "cash" | "") {
    this.currentPayment = value;

    this.cardButton.classList.toggle("button_alt-active", value === "card");
    this.cashButton.classList.toggle("button_alt-active", value === "cash");
  }

  get value(): IOrderFormData {
    return {
      address: this.addressInput.value,
      payment: this.currentPayment,
    };
  }
}