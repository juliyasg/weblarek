import { Card, ICardData } from "./card";
import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types/index";
import { categoryMap } from "../../../utils/constants";

export interface ICardPreviewData extends ICardData, Pick<IProduct, "image" | "category" | "description"> {
	inCart?: boolean | null; // ✅ добавили null как отдельное состояние
}

interface ICardPreviewActions {
	onClick?: (event: MouseEvent) => void;
}

export class CardPreview extends Card<ICardPreviewData> {
	private imageElement: HTMLImageElement;
	private categoryElement: HTMLElement;
	private descriptionElement: HTMLElement;
	private buttonElement: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardPreviewActions) {
		super(container);

		this.imageElement = ensureElement<HTMLImageElement>(".card__image", this.container);
		this.categoryElement = ensureElement<HTMLElement>(".card__category", this.container);
		this.descriptionElement = ensureElement<HTMLElement>(".card__text", this.container);
		this.buttonElement = ensureElement<HTMLButtonElement>(".card__button", this.container);

		if (actions?.onClick) {
			this.buttonElement.addEventListener("click", actions.onClick);
		}
	}

	set image(value: string) {
		this.setImage(this.imageElement, value, this.title);
	}

	set category(value: string) {
		this.categoryElement.textContent = value;
		Object.entries(categoryMap).forEach(([key, className]) => {
			this.categoryElement.classList.toggle(className, key === value);
		});
	}

	set description(value: string) {
		this.descriptionElement.textContent = value;
	}

	set inCart(value: boolean | null) {
		if (this.price === null) {
			this.buttonElement.disabled = true;
			this.buttonElement.textContent = "Недоступно";
			return;
		}

		if (value) {
			this.buttonElement.textContent = "Удалить из корзины";
		} else {
			this.buttonElement.textContent = "Купить";
		}

		this.buttonElement.disabled = false;
	}
}