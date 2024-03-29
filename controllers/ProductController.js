import Product from "../models/Product.js";
import mongoose from 'mongoose';

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
}

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const create = async (req, res) => {
    const { name, price, description, imageUrl } = req.body;
  try {
    const product = new Product({ name, price, description, imageUrl });
    const savedProduct = await product.save();
    res.json({ product: savedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).send({ error: 'Product not found' });
    }
    return res.send({ message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

