import { Hono } from 'hono';
import { Fragment } from 'hono/jsx';
import { zValidator } from '@hono/zod-validator';
import { enums } from 'openpgp';
import { schema, query } from './lib/index.js';

const app = new Hono();

app.get(
  '/',

  zValidator('query', schema.search, (r, c) => {
    if (!r.success) return c.text('Bad Request', 400);
  }),

  async c => {
    const { q } = c.req.valid('query');

    const data = await query(c, q);
    if (!data.length) return c.text('Not Found', 404);

    return c.render(
      <Fragment>
        <p>Search results for "{q}" ({data.length} keys)</p>
        <p><a href={`/pks/lookup?search=${q}&op=index&options=json`}>JSON data</a></p>
        <p><a href={`/pks/lookup?search=${q}&op=get&option=mr`}>Download all public keys</a></p>
        <table>
          <thead>
            <tr>
              <th>User IDs</th>
              <th>Fingerprint</th>
              <th>Algorithm</th>
              <th>Creation Date</th>
              <th>Expiration Date</th>
              <th>Subkeys</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {data.map(k => {
              return (
                <tr>
                  <td>{k.userIDs.map(v => <p>{v}</p>)}</td>
                  <td>{k.main.fingerprint.toUpperCase().match(/.{1,4}/g).join(' ')}</td>
                  <td>{k.main.algo.name}</td>
                  <td>{new Date(k.main.created).toISOString()}</td>
                  <td>{k.main.expired ? new Date(k.main.expired).toISOString() : 'Infinity'}</td>
                  <td>{k.subs.length}</td>
                  <td><a href={`/pks/lookup?search=0x${k.main.fingerprint}&op=get&options=mr`}>Download</a></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Fragment>
    , { title: `Results for "${q}" (${data.length} keys)` });
  }
);

export default app;
