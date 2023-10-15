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
   SITE_NAME = "My OpenPGP Keyserver"
   ```
1. Create KV namespaces. and append KV's id to `wrangler.toml`
   ```bash
   $ npx wrangler kv:namespace create keyhoarder
   ```
1. Deploy to Cloudflare Workers
   ```bash
   $ npm run deploy
   ```

## Send/Search key with GnuPG
- `--keyserver`: Your keyserver hostname
- `--search-keys`: Your OpenPGP key's email address

### Create key
```bash
$ gpg --full-key-gen
```

### Send key to your keyserver
```bash
$ gpg --keyserver https://keys.example.com --send-keys <Your key's fingerprint>
``` 

### Search key
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