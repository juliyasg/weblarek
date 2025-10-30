import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { ApiWebLarek } from './components/models/apiweblarek';
import { API_URL, CDN_URL } from './utils/constants';
import { Catalog } from './components/models/catalog';
import { Cart } from './components/models/cart';
import { Buyer } from './components/models/buyer';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, TPayment, IOrder } from './types';
import { Header } from './components/view/header';
import { Gallery } from './components/view/gallery';
import { CardCatalog } from './components/view/cards/cardcatalog';
import { CardPreview } from './components/view/cards/cardpreview';
import { Modal } from './components/view/modal';
import { Basket } from './components/view/basket';
import { CardBasket } from './components/view/cards/cardbasket';
import { OrderForm } from './components/view/forms/orderform';
import { ContactsForm } from './components/view/forms/contactsform';
import { OrderSuccess } from './components/view/ordersuccess';

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
const basket = new Basket(cloneTemplate(basketTemplate), {
  onSubmit: () => events.emit('order:open'),
});

api.getProducts()
  .then((products) => catalog.saveProducts(products))
  .catch((error) => console.error('Ошибка загрузки товаров:', error));

events.on<{ items: IProduct[] }>('catalog:changed', ({ items }) => {
  const catalogCards = items.map((product) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => catalog.saveSelectedProduct(product),
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
    onClick: () => {
      if (cart.hasProductById(product.id)) {
        cart.removeCartProductId(product.id);
      } else {
        cart.addCartProduct(product);
      }

      modal.close();
    },
  });

  cardPreview.title = product.title;
  cardPreview.price = product.price;
  cardPreview.image = `${CDN_URL}${product.image}`;
  cardPreview.category = product.category;
  cardPreview.description = product.description;
  cardPreview.inCart = cart.hasProductById(product.id);

  modal.open(cardPreview.render());
});

events.on('cart:changed', () => {
  header.counter = cart.getCount();
});

events.on('cart:open', () => {
  const items = cart.getCartProducts().map((product, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onDelete: () => {

        cart.removeCartProductId(product.id);

        events.emit('cart:changed');

        events.emit('cart:open');
      },
    });

    card.title = product.title;
    card.price = product.price;
    card.index = index + 1;

    return card.render();
  });

  basket.items = items;
  basket.total = cart.getTotalPrice();

  modal.open(basket.render());
});

events.on('order:open', () => {
  const orderForm = new OrderForm(cloneTemplate(orderTemplate), {
    onInput: (field, value) => buyer.saveBuyerData({ [field]: value }),
    onPaymentChange: (payment) => buyer.saveBuyerData({ payment }),
    onSubmit: () => {
      modal.close();
      events.emit('contacts:open');
    },
  });

  modal.open(orderForm.render());
});

events.on('contacts:open', () => {
  const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), {
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
        events.emit('cart:changed');

        const success = new OrderSuccess(cloneTemplate(successTemplate), {
          onClose: () => {
            modal.close();
            header.counter = 0;
          },
        });

        success.total = order.total;
        modal.open(success.render());
      });
    },
  });

  modal.open(contactsForm.render());
});