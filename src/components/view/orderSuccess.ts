import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface IOrderSuccessData {
  total: number;
}

interface IOrderSuccessActions {
  onClose?: () => void;
}

export class OrderSuccess extends Component<IOrderSuccessData> {
  protected titleElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IOrderSuccessActions) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>(".order-success__title", this.container);
    this.descriptionElement = ensureElement<HTMLElement>(".order-success__description", this.container);
    this.closeButton = ensureElement<HTMLButtonElement>(".order-success__close", this.container);

    if (actions?.onClose) {
      this.closeButton.addEventListener("click", actions.onClose);
    }
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}