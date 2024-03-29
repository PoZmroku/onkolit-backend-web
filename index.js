import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import dotenv from 'dotenv';
import cors from 'cors';


import {registerValidation, loginValidation, postCreateValidation} from './validations/validations.js';

import {
    handleValidationErrors,
    checkAuth,
    checkRole,
    tokenBlacklistStoreFactory
} from './utils/index.js';

import { UserController, PostController, ProductController, CartController, OrderController } from './controllers/index.js';




dotenv.config();

//const
const PORT = process.env.PORT || 4444
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.lqzjmlw.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`).then(() => console.log('DB ok'))
.catch((err) => console.log('DB error', err));


const app = express();

tokenBlacklistStoreFactory();

//хранилище для картинок
const storage = multer.diskStorage({
    destination: (_, __, cb ) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb ) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// user routes

app.get('/auth/me', checkAuth, UserController.getMe);
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/isTokenExpired', UserController.checkIfTokenExpired);
app.get('/logout', checkAuth, UserController.logout);


app.post('/upload', checkRole(['admin']), upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/tags', PostController.getLastTags)

// posts routes

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, checkRole(["admin", "manager"]), postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, checkRole(["admin", "manager"]), PostController.remove);
app.patch('/posts/:id', checkAuth, checkRole(["admin", "manager"]), postCreateValidation, handleValidationErrors, PostController.update);


// products routes

app.get('/products', ProductController.getProducts)
app.post('/product/add', checkAuth, checkRole(["admin"]), ProductController.create)
app.get('/product/:id', ProductController.getProduct)
app.delete('/product/delete/:id', checkAuth, checkRole(["admin"]), ProductController.deleteProduct)

// cart routes

app.post('/cart/add', checkAuth, CartController.add)
app.get('/cart', checkAuth, CartController.cartItems)
app.post('/cart/delete', checkAuth, CartController.cartDeleteItems)

// order route

app.post('/order', checkAuth, OrderController.saveOrder)
app.get('/orders', checkAuth, OrderController.orders)


app.listen(PORT, (err) => {
    if(err) {
        return console.log(err);
    }
    
    console.log('Server OK');
});