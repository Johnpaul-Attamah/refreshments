import userControllers from '../controllers/userControllers';

const router = (app) => {
  app.use('/api/v1/auth', userControllers);
};

export default router;
