import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import requestRoutes from './routes/routes';

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());

requestRoutes(app);

app.get('/', (req, res) => {
  res.json({
    connected: 'Success',
  });
});

app.get('*', (req, res) => {
  res.send({
    Message: 'Welcome',
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));

export default app;
