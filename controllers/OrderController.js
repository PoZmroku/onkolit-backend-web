import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';

export const saveOrder = async (req, res) => {
  try {
    const { cartId, shippingAddress } = req.body;
    const userId = req.userId; // извлекаем id пользователя из токена

    // Проверяем, что корзина существует и принадлежит пользователю
    const cart = await Cart.findOne({ _id: cartId }).populate({ path: 'user', select: ['fullName', 'email', 'id']});
    const user = cart.user;

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    //Создаем новый заказ на основе корзины
    const order = new Order({
      user: user,
      cart: cart,
      shippingAddress: shippingAddress
    });

    console.log('order', order);

    // Сохраняем заказ в базу данных
    cart.locked = true;
    await cart.save();
    await order.save();

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
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
