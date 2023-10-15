import { Hono } from 'hono';
import { Fragment } from 'hono/jsx';
import { envs } from './lib/index.js';
import search from './search.js';
import pks from './pks.js';
// import wkd from './wkd.js';

const app = new Hono();

app.use('*', async (c, next) => {
  Object.assign(envs, c.env);
  await next();
});

app.use('*', async (c, next) => {
  c.setRenderer((content, props = {}) => c.html(
    <html>
      <head>
        <title>{props.title ? `${props.title} - ` : ''}KeyHoarder OpenPGP Key Server</title>
      </head>
      <body>{content}</body>
    </html>
  ));
  await next();
});

app.route('/:search{search/?}', search);
app.route('/:pks{pks/?}', pks);
// app.route('/.well-known/openpgpkey', wkd);

app.get('/', async c => c.render(
  <Fragment>
    <header>
      <h1>{c.env.SITE_NAME ?? 'KeyHoarder OpenPGP Key Server'}</h1>
    </header>

    <h2>Status</h2>
    <ul>
      <li>HKP keys: {await c.kv.get('data', { type: 'json' }).then(r => !r ? 0 : r.length)}</li>
      {/*<li>WKD keys: {await c.kv.get('wkd', { type: 'json' }).then(r => !r ? 0 : Object.keys(r).map(k => Object.keys(r[k]).length).reduce((a, b) => a + b, 0))}</li>*/}
    </ul>

    <h2>Search Keys</h2>
    <form action="/search" method="get">
      <input name="q" />
      <button>Search</button>
    </form>

    <h2>Upload your OpenPGP public keys to HKP server</h2>
    <form action="/pks/add" method="POST">
      <textarea name="keytext" />
      <br/>
      <button>Submit keys</button>
    </form>

    {/*<h2>Register public key of your email address to Web Key Directory</h2>*/}
    {/*<form action="/pks/add" method="POST">
      <textarea name="keytext" />
      <br/>
      <button>Register key</button>
    </form>*/}

    {/*<h2>Generate OpenPGP Key</h2>*/}

    <h2>Information</h2>
    <p>This key server is powered by <a href="https://github.com/shinosaki/keyhoarder">KeyHoarder</a>.</p>
    <p>KeyHoarder is the open-soruce keyserver software.
    It provides <a href="https://en.wikipedia.org/wiki/Key_server_(cryptographic)">HKP keyserver</a>.</p>
    <ul>
      <li>Author: <a href="https://shinosaki.com/">shinosaki</a></li>
      <li>Document and Source code: <a href="https://github.com/shinosaki/keyhoarder">Github</a></li>
    </ul>

    <footer>
      <p><a href="https://github.com/shinosaki/keyhoarder">KeyHoarder</a> v{c.env.APP_VERSION}</p>
    </footer>
  </Fragment>
, { title: c.env.SITE_NAME }));

export default app;
