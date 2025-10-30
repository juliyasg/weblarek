import { Form, IFormData } from "./form";
import { ensureElement } from "../../../utils/utils";

export interface IContactsFormData extends IFormData {
  email: string;
  phone: string;
}

interface IContactsFormActions {
  onInput?: (field: keyof IContactsFormData, value: string) => void;
  onSubmit?: (event: SubmitEvent) => void;
}

export class ContactsForm extends Form<IContactsFormData> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, actions?: IContactsFormActions) {
    super(container, actions);

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

    if (actions?.onInput) {
      this.emailInput.addEventListener("input", () => {
        actions.onInput?.("email", this.emailInput.value);
      });

      this.phoneInput.addEventListener("input", () => {
        actions.onInput?.("phone", this.phoneInput.value);
      });
    }
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }

  set value(data: Partial<IContactsFormData>) {
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
  }
}