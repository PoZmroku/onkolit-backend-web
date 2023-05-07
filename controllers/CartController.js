import Cart from "../models/Cart.js";
import Product from "../models/Product.js";


export const add = async (req, res) => {
    try {
        const _id = req.body._id;
        const quantity = req.body.quantity ?? 1;
        

        // Найти в базе данных продукт по productId
        let product;
        try {
          product = await Product.findOne({ _id: _id });
        }
        catch (error) {
          throw new Error("Product not found");
        }

        let newCartItem = {
          price: product.price,
          quantity: quantity,
          name: product.name,
          _id: _id,
        };

        let cart = await Cart.findOne({ user: req.userId });

        if (!cart || cart.locked) {
          
          cart = new Cart({
            user: req.userId,
          });
        }


        // Обновляем существующую корзину, если товар уже был добавлен
        let itemIndex = cart.items.findIndex(p => p._id == _id);
        
        
        if (itemIndex !== -1) {
          cart.items[itemIndex].quantity += quantity;
          cart.items[itemIndex].price += product.price;
        } else {
          cart.items.push(newCartItem);
        }

        cart.totalPrice = calculateTotalPrice(cart.items);
        
        // Сохраняем корзину в базу данных
        await cart.save();

        res.status(201).send(cart);

      } catch (error) {
        res.status(500).send(error.message);
      }
}

function calculateTotalPrice(cartItems) {
  let totalPrice = 0;
  cartItems.forEach(item => {
    totalPrice += item.price;
  });
  
  return totalPrice;
}


export const cartItems = async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.userId });
      res.status(200).send(cart);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
}

export const cartDeleteItems = async (req, res) => {
  const _id = req.body._id;
  try {
    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      return res.status(400).json({ msg: 'Корзина не найдена' });
    }

    const itemIndex = cart.items.findIndex(p => p._id == _id);
    if (itemIndex !== -1) {
      cart.totalPrice -= cart.items[itemIndex].price;
      cart.items.splice(itemIndex, 1);
      calculateTotalPrice(cart.items);
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