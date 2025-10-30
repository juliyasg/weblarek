import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface IBasketData {
  items: HTMLElement[];
  total: number;
}

interface IBasketActions {
  onSubmit?: (event: MouseEvent) => void;
}

export class Basket extends Component<IBasketData> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected orderButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IBasketActions) {
    super(container);

    this.listElement = ensureElement<HTMLElement>(".basket__list", this.container);
    this.totalElement = ensureElement<HTMLElement>(".basket__price", this.container);
    this.orderButton = ensureElement<HTMLButtonElement>(".basket__button", this.container);

    if (actions?.onSubmit) {
      this.orderButton.addEventListener("click", actions.onSubmit);
    }
  }

  set items(elements: HTMLElement[]) {
    this.listElement.innerHTML = "";

    if (elements.length === 0) {
      this.listElement.innerHTML = `<p class="basket__empty">Корзина пуста</p>`;
      this.orderButton.disabled = true;
      this.totalElement.textContent = "0 синапсов";
    } else {
      this.listElement.replaceChildren(...elements);
      this.orderButton.disabled = false;
    }
  }

  set total(value: number) {
    this.totalElement.textContent = value ? `${value} синапсов` : "0 синапсов";
  }

  set buttonDisabled(value: boolean) {
    this.orderButton.disabled = value;
  }
}