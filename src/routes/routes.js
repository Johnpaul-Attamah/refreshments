import userControllers from '../controllers/userControllers';
import profileControllers from '../controllers/profileControllers';
import adminControllers from '../controllers/adminControllers';
import productControllers from '../controllers/productControllers';
import orderControllers from '../controllers/orderControllers';

const router = (app) => {
  app.use('/api/v1/auth', userControllers);
  app.use('/api/v1/profile', profileControllers);
  app.use('/api/v1/admin', adminControllers);
  app.use('/api/v1/menu', productControllers);
  app.use('/api/v1/orders', orderControllers);
};

export default router;
