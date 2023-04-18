import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';
import { isTokenExpired } from '../utils/checkAuth.js';
import { tokenBlacklistStore } from '../utils/tokenBlacklistStore.js';


export const register = async (req, res) => {
    try {
    
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    const doc = new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        passwordHash: hash,
        role: req.body.role,
    });
    
    const user = await doc.save();

    const token = jwt.sign(
        {
            _id: user._id,
            role: user.role,
        }, 'secret123',
        {
            expiresIn: '24h',
        },
    );

    const { passwordHash, ... userData } = user._doc;
    
    res.json({
        ...userData,
        token,
    });
    } catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Не удалось зарегистрироваться',
        });
    }
};

export const login = async (req, res) => {
    try{
        const user = await UserModel.findOne({ email: req.body.email });

        if(!user) {
            return res.status(400).json({
                message: 'Неверный логин или пароль',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if(!isValidPass){
            return res.status(400).json({
                message: 'Неверный логин или пароль',
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
                role: user.role,
            }, 'secret123',
            {
                expiresIn: '24h',
            },
        );
        const { passwordHash, ... userData } = user._doc;
    
        res.json({
            ... userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось авторизоваться',
        });
    }
};


export const getMe = async (req, res) => {
    try{
        const user = await UserModel.findById(req.userId);

        if(!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }

        const { passwordHash, ... userData } = user._doc;
    
        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Нет доступа',
        });
    }
};


export const checkIfTokenExpired = async (req, res) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (!token) {
        return res.status(200).send(true);
    }

    const decoded = jwt.verify(token, 'secret123');

    const isExpired = isTokenExpired(decoded);

    return res.status(200).send(isExpired);
};

export const logout = async (req, res) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (!token) {
        return res.status(200).send();
    }
    
    const decoded = jwt.verify(token, 'secret123');
    
    tokenBlacklistStore.set(token, decoded.exp ?? 0);
    
    return res.status(200).send();
};