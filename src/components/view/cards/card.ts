import { IProduct } from "../../../types/index";
import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";

export interface ICardData extends Partial<Pick<IProduct, 'id' | 'title' | 'price'>> {}

export abstract class Card<T extends ICardData = ICardData> extends Component<T> {
	protected titleElement: HTMLElement;
	protected priceElement: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);
		this.titleElement = ensureElement<HTMLElement>('.card__title', container);
		this.priceElement = ensureElement<HTMLElement>('.card__price', container);
	}

	set id(value: string) {
		this.container.id = value;
	}

	set title(value: string) {
		this.titleElement.textContent = value;
	}

	set price(value: number | null) {
		this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
	}
}
