import { body } from 'express-validator';

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 8 символов').isLength({min: 8}),
];


export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 8 символов').isLength({min: 8}),
    body('fullName', 'Укажите имя').isLength({min: 3}),
];

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
    body('text', 'Введите текст статьи').isLength({min: 10}).isString(),
    body('tags', 'Неверный формат тэгов (укажите массив)').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];

export const productValidation = [
    body('name', 'Неверный формат наименования').isLength({min: 3}),
    body('price', 'Неверный формат цены').isLength({min: 4}),
    body('imgUrl', 'Неверная ссылка на изображение').optional().isString(),
    body('description', 'Неверный формат описания').isLength({min: 5}),
];