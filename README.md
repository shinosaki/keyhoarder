# KeyHoarder

KeyHoarder is the open-source OpenPGP keyserver software. It provides HKP keyserver on Cloudflare Workers, ~~Bun, Node.js~~.

## Features
- Upload ascii armored OpenPGP keys
- Search for keys by Email address, Name or any query
- draft-gallagher-openpgp-hkp-00 compliant's key lookup.
- JSON formatted key lookup

## Deploy
1. Set `SITE_NAME` from `wrangler.toml`.
   ```toml
   [vars]
   SITE_NAME = "My OpenPGP Key Server"
   ```
1. Create KV namespaces. and append KV's id to `wrangler.toml`
   ```bash
   $ npx wrangler kv:namespace create keyhoarder
   ```
1. Deploy to Cloudflare Workers
   ```bash
   $ npm run deploy
   ```

## Fetch key with GnuPG
1. Upload your key
2. Search key with GnuPG
   - `--keyserver`: Your key server hostname
   - `--search-keys`: Your OpenPGP key's email address  

Example:
```bash
$ gpg --keyserver https://keys.example.com --search-keys hello@example.com
```

## Dependencies
- [Hono](https://hono.dev/)
- [OpenPGP.js](https://openpgpjs.org/)
- [Zod](https://zod.dev/)

## Author
[Shinosaki](https://shinosaki.com/)

## License
[MIT](./LICENSE)