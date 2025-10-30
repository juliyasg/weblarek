import { Card, ICardData } from "./card";
import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types/index";
import { categoryMap } from "../../../utils/constants";

export interface ICardCatalogData extends ICardData, Pick<IProduct, "image" | "category"> {}

interface ICardCatalogActions {
	onClick?: (event: MouseEvent) => void;
}

export class CardCatalog extends Card<ICardCatalogData> {
	protected imageElement: HTMLImageElement;
	protected categoryElement: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardCatalogActions) {
		super(container);

		this.imageElement = ensureElement<HTMLImageElement>(".card__image", this.container);
		this.categoryElement = ensureElement<HTMLElement>(".card__category", this.container);

		if (actions?.onClick) {
			this.container.addEventListener("click", actions.onClick);
		}
	}

	set category(value: string) {
		this.categoryElement.textContent = value;
		Object.entries(categoryMap).forEach(([key, className]) => {
			this.categoryElement.classList.toggle(className, key === value);
		});
	}

	set image(src: string) {
		this.setImage(this.imageElement, src, this.title);
	}
}