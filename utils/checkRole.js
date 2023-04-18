import jwt from 'jsonwebtoken';

export const checkRole = (roles) => {
  return function(req, res, next) {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    try {
      const decoded = jwt.verify(token, 'secret123');
      req.userId = decoded._id;
      req.role = decoded.role;
      const userRole = req.role;
      if (roles.includes(userRole)) {
        next();
      } else {
        return res.status(403).json({ message: 'Недостаточно прав доступа' });
      }
    } catch (err) {
      return res.status(401).json({ message: 'Необходимо авторизоваться' });
    }
  };
}
