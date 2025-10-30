import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";

export interface IFormData {
	[key: string]: string | null;
}

interface IFormActions {
	onSubmit?: (event: SubmitEvent) => void;
}

export abstract class Form<T extends IFormData = IFormData> extends Component<T> {
	protected submitButton: HTMLButtonElement;
	protected errorElement: HTMLElement;

	constructor(container: HTMLElement, actions?: IFormActions) {
		super(container);

		this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
		this.errorElement = ensureElement<HTMLElement>('.form__errors', this.container);

		if (actions?.onSubmit) {
			this.container.addEventListener('submit', (event) => {
				event.preventDefault();
				actions.onSubmit?.(event);
			});
		}
	}

	set valid(value: boolean) {
		this.submitButton.disabled = !value;
	}

	set error(text: string) {
		this.errorElement.textContent = text;
	}

	clearError(): void {
		this.errorElement.textContent = '';
	}
}