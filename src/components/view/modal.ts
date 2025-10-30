import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface IModalData {
  content?: HTMLElement;
}

interface IModalActions {
  onClose?: () => void;
}

export class Modal extends Component<IModalData> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;

  constructor(container: HTMLElement, actions?: IModalActions) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>(".modal__close", this.container);
    this.contentElement = ensureElement<HTMLElement>(".modal__content", this.container);

    this.closeButton.addEventListener("click", () => this.close(actions?.onClose));

    this.container.addEventListener("click", (event) => {
      if (event.target === this.container) {
        this.close(actions?.onClose);
      }
    });
  }

  open(content?: HTMLElement) {
    if (content) {
      this.contentElement.replaceChildren(content);
    }

    this.container.classList.add("modal_active");
    document.body.style.overflow = "hidden";
  }

  close(callback?: () => void) {
    this.container.classList.remove("modal_active");
    document.body.style.overflow = "auto";
    this.contentElement.replaceChildren();
    callback?.();
  }

  set content(element: HTMLElement) {
    this.contentElement.replaceChildren(element);
  }
}