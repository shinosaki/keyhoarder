// import { Hono } from 'hono';
// import { cors } from 'hono/cors';
// import { zValidator } from '@hono/zod-validator';
// import { schema } from './lib/index.js';

// const app = new Hono();

// app.use('*', cors());

// app.get('/policy', c => c.text());

// const wkdHandler = async c => {
//   const url = new URL(c.req.url);
//   let { domain, wkdID } = c.req.valid('param');

//   domain ??= url.hostname.replace('openpgpkey.', '');

//   const data = await c.kv.get(`wkd`);
//   if (!data) return c.text('Failed to fetch data', 500);

//   c.header('content-type', 'application/octet-stream');
//   return (data.domain?.wkdID)
//     ? c.body(data.domain.wkdID)
//     : c.text('Not Found', 404);
// };

// app.get(
//   '/hu/:wkdID{[a-km-uw-zA-KM-UW-Z13-9]+/?}',

//   zValidator('param', schema.wkd.direct, (r, c) => {
//     if (!r.success) return c.text('Bad Request', 400);
//   }),

//   wkdHandler
// );

// app.get(
//   '/:domain/hu/:wkdID{[a-km-uw-zA-KM-UW-Z13-9]+/?}',

//   zValidator('param', schema.wkd.advanced, (r, c) => {
//     if (!r.success) return c.text('Bad Request', 400);
//   }),

//   wkdHandler
// );

// export default app;
