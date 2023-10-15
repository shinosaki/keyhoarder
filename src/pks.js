import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { readKey, readKeys } from 'openpgp';
import { schema, parseKey, keys2armor, store, query } from './lib/index.js';

const app = new Hono();

app.get('/', c => c.redirect('/'));

app.get(
  '/lookup',

  zValidator('query', schema.lookup, (r, c) => {
    if (!r.success) return c.text('Bad Request', 400);
  }),

  async c => {
    c.header('content-type', 'text/plain');
    const { op, search, options = [], fingerprint, exact } = c.req.valid('query');

    const data = await query(c, search);
    if (!data.length) return c.text('Not Found', 404);

    switch (op) {
      case 'get': {
        const keys = await Promise.all(
          data.map(({ key }) => readKey({ armoredKey: key }))
        );

        const header = ['-----BEGIN PGP PUBLIC KEY BLOCK-----'];
        header.push(`Version: KeyHoarder v${c.env.APP_VERSION} with OpenPGP.js`);
        if (data.length > 1) header.push(`Comment: ${data.length} keys found`);
        
        return c.body(keys2armor(keys).replace(header[0], header.join('\n')));
      };

      case 'index': {
        return (options.includes('json') || options.includes('x-json')) ? c.json(data)
          : c.body([
              `info:1:${data.length}`,
              ...data.map(({ userIDs, main }) => [
                [
                  'pub',
                  main.fingerprint,
                  main.algo.id,
                  main.keylen,
                  main.created,
                  main.expired ?? '',
                  ''
                ].join(':'),
                userIDs.map(v => `uid:${v}:${main.created}:${main.expired ?? ''}:`)
              ])
            ].flat(2).join('\n'));
      };

      default:
        return c.text('Bad Request\nRequire "?op" parameter', 400);
    }
  }
);

app.post(
  '/add',

  zValidator('form', schema.add, (r, c) => {
    if (!r.success) return c.text('Bad Request', 400);
  }),

  async c => {
    const { keytext } = c.req.valid('form');

    const publicKeys = await readKeys({ armoredKeys: keytext }).catch(e => null);
    if (!publicKeys) return c.text('Invalid Key', 400);

    const data = await Promise.all(
      publicKeys.map(async key => ({
        key: key.armor(),
        userIDs: key.getUserIDs(),
        main: await parseKey(key),
        subs: (key.subkeys.length)
          ? await Promise.all(key.subkeys?.map(k => parseKey(k)))
          : [],
      }))
    );

    await store(c, data, 'kv');

    return c.json({
      status: true,
      message: 'Success',
      data
    });
  }
);

export default app;
