import { IProduct } from "../../../types/index";
import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";

export interface ICardData extends Partial<Pick<IProduct, 'id' | 'title' | 'price'>> {}

export abstract class Card<T extends ICardData = ICardData> extends Component<T> {
	private titleElement: HTMLElement;
	protected priceElement: HTMLElement;

	private _id?: string;
	private _price: number | null | undefined;

	constructor(container: HTMLElement) {
		super(container);
		this.titleElement = ensureElement<HTMLElement>('.card__title', container);
		this.priceElement = ensureElement<HTMLElement>('.card__price', container);
	}

	set id(value: string) {
		this._id = value;
	}
	get id(): string | undefined {
		return this._id;
	}

	set title(value: string) {
		this.titleElement.textContent = value;
	}

	set price(value: number | null) {
		this._price = value;
		this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
	}
	get price(): number | null | undefined {
		return this._price;
	}
}