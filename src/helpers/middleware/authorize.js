import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyToken = (router) => {
  router.use((req, res, next) => {
    let token = req.body.token || req.query.token || req.headers['authorization'] || req.headers['x-access-token'] || req.headers['x-auth-token'];
    if (!token) {
      return res.status(403).json({ message: 'No Token Passed' });
    }
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    return jwt.verify(token, process.env.SECRET_OR_KEY, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: 'Failed to authenticate', err: 'Session expired' });
        return;
      }
      req.query.id = decoded.id;
      req.query.name = decoded.name;
      req.query.email = decoded.email;
      req.query.avatar = decoded.avatar;
      req.query.phone = decoded.phone;
      req.query.address = decoded.address;
      req.query.role = decoded.role;
      next();
    });
  });
};

export default verifyToken;
