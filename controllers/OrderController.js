import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

export const getOrder = async (req, res) => {
  try {
    const { userId, cartId, shippingAddress } = req.body;

    // Получаем корзину из базы данных по ее ID
    const cart = await Cart.findById(cartId);

    // Проверяем, что корзина найдена и принадлежит пользователю
    if (!cart || cart.user.toString() !== userId) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Вычисляем общую стоимость заказа
    //const totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    // Создаем новый заказ на основе данных корзины и адреса доставки
    const order = await Order.create({
      cart: cart._id,
      items: cart.items,
      //totalPrice,
      shippingAddress,
    });

    // Удаляем корзину, так как она больше не нужна
    await cart.remove();

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

}

export const orders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).populate('items.product');

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
