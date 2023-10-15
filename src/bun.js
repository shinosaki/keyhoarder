// import { Hono } from 'hono';
// import { drizzle } from 'drizzle-orm/bun-sqlite';
// import { Database } from 'bun:sqlite';
// import App from './app.js';

// const app = new Hono();

// app.use('*', async (c, next) => {
//   c.db = drizzle(new Database(process.env.DB ?? 'database.sqlite'));
//   await next();
// });

// app.route('/', App);

// export default app;
