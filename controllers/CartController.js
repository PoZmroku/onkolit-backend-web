import Cart from "../models/Cart.js";


export const add = async (req, res) => {
    try {
        const cartItem = {
          product: req.body.productId,
          quantity: req.body.quantity,
          price: req.body.price
        };
    
        const cart = await Cart.findOne({ user: req.userId });
    
        if (cart) {
          // Обновляем существующую корзину, если товар уже был добавлен
            const itemIndex = cart.items.findIndex(p => p.product == req.body.productId);
            if (itemIndex !== -1) {
            cart.items[itemIndex].quantity += req.body.quantity;
            cart.items[itemIndex].price += req.body.price;
          } else {
            cart.items.push(cartItem);
          }
    
          //cart.totalPrice += parseInt(req.body.price * req.body.quantity);  // доработать
          await cart.save();
          res.status(201).send(cart);
        } else {
          // Создаем новую корзину
            const newCart = new Cart({
            user: req.userId,
            items: [cartItem],
            //totalPrice: parseInt(req.body.price * req.body.quantity)  // доработать
          });
    
          await newCart.save();
          res.status(201).send(newCart);
        }
      } catch (error) {
        console.error(error.message);
        res.status(500).send('Ошибка добавления в корзину');
      }
}


export const cartItems = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.userId }).populate('items.product');
        res.status(200).send(cart);
      } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
      }
}

export const cartDeleteItems = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.userId });
    
        if (!cart) {
          return res.status(400).json({ msg: 'Корзина не найдена' });
        }
    
        const itemIndex = cart.items.findIndex(p => p.product == req.params.productId);
        if (itemIndex !== -1) {
          cart.totalPrice -= cart.items[itemIndex].price * cart.items[itemIndex].quantity;
          cart.items.splice(itemIndex, 1);
          await cart.save();
        } else {
          return res.status(400).json({ msg: 'Товар не найден в корзине' });
        }
    
        res.status(200).send(cart);
      } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
      }
}