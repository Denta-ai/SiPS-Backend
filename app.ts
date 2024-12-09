import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import routes from './routes/routes';
dotenv.config();
const PORT = process.env.PORT || 3000;
const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server is running');
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
