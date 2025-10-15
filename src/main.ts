import './scss/styles.scss';
import { EventEmitter } from './components/base/Events.ts';
import { Api } from './components/base/Api.ts';
import { ApiWebLarek } from './components/models/apiweblarek.ts';
import { API_URL } from './utils/constants.ts';
import { Catalog } from './components/models/catalog.ts';
import { Cart } from './components/models/cart.ts';
import { Buyer } from './components/models/buyer.ts';
import { IProduct } from './types/index.ts';
import { apiProducts } from './utils/data.ts';

const events = new EventEmitter();
const baseApi = new Api(API_URL);
const api = new ApiWebLarek(baseApi);
const catalog = new Catalog();
const cart = new Cart();
const buyer = new Buyer();

catalog.saveProducts(apiProducts.items);
console.log('Тест: Массив товаров после save в Catalog:', catalog.getProducts());
console.log('Тест: Товар по id (первый элемент) из Catalog:', catalog.getProductById(apiProducts.items[0].id));

cart.addCartProduct(apiProducts.items[0]);
cart.addCartProduct(apiProducts.items[1]);
console.log('Тест: Товары в корзине после добавления двух товаров:', cart.getCartProducts());
console.log('Тест: Общая цена в корзине:', cart.getTotalPrice());
cart.removeCartProductId(apiProducts.items[0].id);
console.log('Тест: Корзина после удаления товара по id:', cart.getCartProducts());
cart.clearCartProducts();
console.log('Тест: Корзина после очистки:', cart.getCartProducts());

buyer.saveBuyerData({
  email: 'test@example.com',
  phone: '+123456789',
  address: '123 Main St',
  payment: 'card'
});
console.log('Тест: Данные покупателя после сохранения:', buyer.getBuyerData());
const validationErrors = buyer.validateBuyerData();
console.log('Тест: Ошибки валидации данных покупателя:', validationErrors);
buyer.clear();
console.log('Тест: Данные покупателя после очистки:', buyer.getBuyerData());

// Запрос товаров с сервера, сохранение в модель и вывод на консоль
api.getProducts()
  .then(products => {
    console.log('Полученные товары с сервера:', products);
    catalog.saveProducts(products);
    console.log('Модель Catalog после сохранения товаров с сервера:', catalog.getProducts());
    events.emit('products:loaded', products);
  })
  .catch(error => {
    console.error('Ошибка при загрузке товаров с сервера:', error);
  });

// Подписка и тест события добавления товара в корзину
events.on<IProduct>('product:addToCart', (product) => {
  cart.addCartProduct(product);
  console.log('Событие: Товар добавлен в корзину:', product);
  console.log('Обновлённая корзина:', cart.getCartProducts());
});