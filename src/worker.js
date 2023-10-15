import { Hono } from 'hono';
import App from './app.js';

const app = new Hono();

app.use('*', async (c, next) => {
  c.kv = c.env.KV;
  await next();
});

app.route('/', App);

export default app;
