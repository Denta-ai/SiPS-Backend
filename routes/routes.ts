import express, { Router, Request, Response } from 'express';
const routes: Router = express.Router();

routes.get('/test', (req: Request, res: Response) => {
  res.send('hello test');
});

export default routes;
