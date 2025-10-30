import { Card, ICardData } from "./card";
import { ensureElement } from "../../../utils/utils";

export interface ICardBasketData extends ICardData {
	index?: number;
}

interface ICardBasketActions {
	onDelete?: (event: MouseEvent) => void;
}

export class CardBasket extends Card<ICardBasketData> {
	private indexElement: HTMLElement;
	private deleteButton: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardBasketActions) {
		super(container);
		this.indexElement = ensureElement<HTMLElement>(".basket__item-index", this.container);
		this.deleteButton = ensureElement<HTMLButtonElement>(".basket__item-delete", this.container);

		if (actions?.onDelete) {
			this.deleteButton.addEventListener("click", actions.onDelete);
		}
	}

	set index(value: number) {
		this.indexElement.textContent = String(value);
	}
}