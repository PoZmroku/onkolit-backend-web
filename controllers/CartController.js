import Cart from "../models/Cart.js";
import Product from "../models/Product.js";


export const add = async (req, res) => {
    try {
        let cartItem = {
          product: req.body.productId,
          quantity: req.body.quantity,
        };

        // Найти в базе данных продукт по productId
        let product;
        try {
          product = await Product.findOne({ _id: cartItem.product });
        }
        catch (error) {
          throw new Error("Product not found");
        }

        cartItem.price = product.price;

        let cart = await Cart.findOne({ user: req.userId });

        if (cart && !cart.locked) {
          
          // Обновляем существующую корзину, если товар уже был добавлен
          let itemIndex = cart.items.findIndex(p => p.product == req.body.productId);
          if (itemIndex !== -1) {
            
            cart.items[itemIndex].quantity += cartItem.quantity;
            cart.items[itemIndex].price += cartItem.price;
          } else {
            
            cart.items.push(cartItem);
            itemIndex = cart.items.length - 1;
          }
        } else {
          // Создаем новую корзину
          cart = new Cart({
            user: req.userId,
            items: [cartItem]
          });
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