import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface IGalleryData {
  catalog: HTMLElement[];
}

export class Gallery extends Component<IGalleryData> {
  protected catalogElement: HTMLElement;

  constructor(container?: HTMLElement) {
    super(container || ensureElement<HTMLElement>('.gallery'));
    this.catalogElement = this.container;
  }

  set catalog(items: HTMLElement[]) {
    this.catalogElement.replaceChildren(...items);
  }
}