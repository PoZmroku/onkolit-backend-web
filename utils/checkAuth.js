import jwt from 'jsonwebtoken';
import { tokenBlacklistStore } from './tokenBlacklistStore.js';

export const checkAuth = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if(token) {
        try {
            const decoded = jwt.verify(token, 'secret123');
            const isExpired = isTokenExpired(decoded);
            const isBlacklisted = isTokenBlacklisted(token);
            
            if (isExpired) {
                throw new Error('Token has expired');
            }
            
            if (isBlacklisted) {
                throw new Error('Token is invalid');
            }
            
            req.userId = decoded._id;
            req.role = decoded.role;
            next();
        } catch (e) {
            return res.status(403).json({
                message: 'Нет доступа',
            });
        }
    } else {
        return res.status(403).json({
            message: 'Нет доступа',
        });
    }
}

export const isTokenExpired = (decodedToken) => {
    if (!decodedToken) {
        return false;
    }

    const now = Math.floor(new Date().getTime() / 1000);
    const isExpired = now > (decodedToken.exp ?? 0);

    return isExpired;
}

export const isTokenBlacklisted = (token) => {
    const isBlacklisted = !!tokenBlacklistStore.get(token);

    return isBlacklisted;
}