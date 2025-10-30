import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { ApiWebLarek } from './components/models/apiWebLarek';
import { API_URL, CDN_URL } from './utils/constants';
import { Catalog } from './components/models/catalog';
import { Cart } from './components/models/cart';
import { Buyer } from './components/models/buyer';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, TPayment, IOrder } from './types';
import { Header } from './components/view/header';
import { Gallery } from './components/view/gallery';
import { CardCatalog } from './components/view/cards/cardCatalog';
import { CardPreview } from './components/view/cards/cardPreview';
import { Modal } from './components/view/modal';
import { Basket } from './components/view/basket';
import { CardBasket } from './components/view/cards/cardBasket';
import { OrderForm } from './components/view/forms/orderForm';
import { ContactsForm } from './components/view/forms/contactsForm';
import { OrderSuccess } from './components/view/orderSuccess';

const events = new EventEmitter();
const api = new ApiWebLarek(new Api(API_URL));
const catalog = new Catalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const gallery = new Gallery(ensureElement('.gallery'));
const header = new Header(events, ensureElement('.header'));
const modal = new Modal(ensureElement('#modal-container'));
const modalRoot = ensureElement<HTMLElement>('#modal-container');
const basket = new Basket(cloneTemplate(basketTemplate), {
  onSubmit: () => events.emit('order:open'),
});

let orderForm: OrderForm | null = null;
let contactsFormRef: ContactsForm | null = null;

api.getProducts()
  .then((products) => catalog.saveProducts(products))
  .catch((error) => console.error('Ошибка загрузки товаров:', error));

events.on<{ items: IProduct[] }>('catalog:changed', ({ items }) => {
  const catalogCards = items.map((product) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('catalog:selected', { product }),
    });

    card.id = product.id;
    card.title = product.title;
    card.price = product.price;
    card.image = `${CDN_URL}${product.image}`;
    card.category = product.category;

    return card.render();
  });

  gallery.catalog = catalogCards;
});

events.on<{ product: IProduct }>('catalog:selected', ({ product }) => {
  const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => events.emit('cart:toggle', { product }),
  });

  cardPreview.title = product.title;
  cardPreview.price = product.price;
  cardPreview.image = `${CDN_URL}${product.image}`;
  cardPreview.category = product.category;
  cardPreview.description = product.description;
  cardPreview.inCart = cart.hasProductById(product.id);

  modal.open(cardPreview.render());
});

events.on<{ product: IProduct }>('cart:toggle', ({ product }) => {
  if (product.price === null) return;

  if (cart.hasProductById(product.id)) {
    cart.removeCartProductId(product.id);
  } else {
    cart.addCartProduct(product);
  }

  modal.close();
});

function refreshBasketInModal() {
  const items = cart.getCartProducts().map((product, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onDelete: () => cart.removeCartProductId(product.id),
    });
    card.title = product.title;
    card.price = product.price;
    card.index = index + 1;
    return card.render();
  });

  basket.items = items;
  basket.total = cart.getTotalPrice();
  modal.content = basket.render();
}

events.on('cart:changed', () => {
  header.counter = cart.getCount();

  if (modalRoot.classList.contains('modal_active')) {
    refreshBasketInModal();
  }
});

events.on('cart:cleared', () => {
  header.counter = 0;

  if (modalRoot.classList.contains('modal_active')) {
    refreshBasketInModal();
  }
});

events.on('cart:open', () => {
  refreshBasketInModal();
  modal.open(basket.render());
});

events.on('order:open', () => {
  orderForm = new OrderForm(cloneTemplate(orderTemplate), {
    onInput: (field, value) => buyer.saveBuyerData({ [field]: value }),
    onPaymentChange: (payment) => buyer.saveBuyerData({ payment }),
    onSubmit: () => {
      modal.close();
      events.emit('contacts:open');
    },
  });

  contactsFormRef = null;
  modal.open(orderForm.render());
});

events.on('contacts:open', () => {
  contactsFormRef = new ContactsForm(cloneTemplate(contactsTemplate), {
    onInput: (field, value) => buyer.saveBuyerData({ [field]: value }),
    onSubmit: () => {
      const buyerData = buyer.getBuyerData();

      const order: IOrder = {
        payment: buyerData.payment as TPayment,
        email: buyerData.email,
        phone: buyerData.phone,
        address: buyerData.address,
        total: cart.getTotalPrice(),
        items: cart.getCartProducts().map((p) => p.id),
      };

      api.sendOrder(order).then(() => {
        cart.clearCartProducts();

        const success = new OrderSuccess(cloneTemplate(successTemplate), {
          onClose: () => modal.close(),
        });

        success.total = order.total;
        modal.open(success.render());
      });
    },
  });

  orderForm = null;
  modal.open(contactsFormRef.render());
});

events.on('buyer:changed', () => {
  const errors = buyer.validateBuyerData();

  if (orderForm) {
    const orderErrors = {
      payment: errors.payment,
      address: errors.address,
    };
    orderForm.showErrors(orderErrors);
    const isValid = !orderErrors.payment && !orderErrors.address;
    orderForm.valid = isValid;
  }

  if (contactsFormRef) {
    const contactErrors = {
      email: errors.email,
      phone: errors.phone,
    };
    contactsFormRef.showErrors(contactErrors);
    const isValid = !contactErrors.email && !contactErrors.phone;
    contactsFormRef.valid = isValid;
  }
});