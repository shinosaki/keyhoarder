# HKPサーバのInternet Draft要約

[draft-gallagher-openpgp-hkp-00](https://datatracker.ietf.org/doc/html/draft-gallagher-openpgp-hkp)

## 3. HKP and HTTP
- HKPはHTTP上に実装される
  - ステータスコード(エラーコード)はHTTPと共通
    - 可能な限り具体的に
      - キーが見つからない場合、400(Bad Request)ではなく404(Not Found)を推奨
  - HKPサーバはHTTP 1.0をサポート**しなければならない**
    - 既に存在するクライアントとの互換性を保つため
  - `hkp://`のポートは`11371/tcp`

## 4. Requesting Data from a Keyserver
- リクエストはHTTP GET
- パスは`/pks/lookup`
  - 変数(パラメータ)は任意の順序で指定可能
    - 未知のパラメータは無視**しなければならない**

### 4.1. Basic Variables
基本的なパラメータ
- 未実装のパラメータには501エラーを返す
- op
  - get
    - ascii armored text
  - index
    - 一致するキーへのリンクを含むHTMLドキュメント
  - vindex
- search
  - 値は任意の文字列
  - 値
    - キーID
      - 接頭辞に0x
      - Ignore case
      - 桁数
        - 8  (32bit key id)
        - 16 (64bit key id)
        - 32 (version 3 fingerprint)
        - 40 (version 4 fingerprint)
    - ユーザID
- x-*
  - 独自・非標準のパラメータ

### 4.2. Modifier Variables
- options
  - mr
    - Machine Readable
    - 機械可読形式のデータを返す
  - nm
    - No Modification
  - x-*
    - 独自・非標準のパラメータ
- fingerprint
  - off
  - on
    - index/vindexで各キーのフィンガープリントを提供
- exact
  - off
  - on
    - searchの値に完全一致する検索結果を返す
  - x-*
    - 独自・非標準のパラメータ

## 5. Submitting Keys To A Keyserver
- リクエストはHTTP POST
- パスは`/pks/add`
- request
  - formdata (x-www-form-urlencoded)
    - keytext
      - url encoded ascii armored text

## 6. Output Formats
### 6.1. Machine Readable Output
以下のパラメータに`option=mr`が存在する場合
- op=get
  - ascii armored文字列のみ
  - Content-Type: application/pgp-keys
- op=index
  - 6.2. Machine Readable Indexesに従う

### 6.2. Machine Readable Indexes
- 改行で区切られたレコードのリスト
- レコードはコロンで区切られる
- Content-Type: text/plain
- info
  - version
    - 通常`1`
  - count
    - 検索結果数
- pub
  - keyid
    - フィンガープリント
  - algo
    - アルゴリズムID ([RFC4880の9.1](https://datatracker.ietf.org/doc/html/draft-ietf-openpgp-rfc4880bis-10#section-9.1)に従う)
      | ID      | Algorithm |
      | ------- | --------- |
      | 1       | RSA (Encrypt or Sign) [HAC] |
      | 2       | RSA Encrypt-Only [HAC] |
      | 3       | RSA Sign-Only [HAC] |
      | 16      | Elgamal (Encrypt-Only) [ELGAMAL] [HAC] |
      | 17      | DSA (Digital Signature Algorithm) [FIPS186] [HAC] |
      | 18      | ECDH public key algorithm |
      | 19      | ECDSA public key algorithm [FIPS186] |
      | 20      | Reserved (formerly Elgamal Encrypt or Sign) |
      | 21      | Reserved for Diffie-Hellman (X9.42, as defined for IETF-S/MIME) |
      | 22      | EdDSA [RFC8032] |
      | 23      | Reserved for AEDH |
      | 24      | Reserved for AEDSA |
      | 100-110 | Private/Experimental algorithm |
  - keylen
    - 鍵長 (RSA2048なら2048)
  - creationdate
  - expirationdate
  - flags
- uid
  - uid string
    - `John Doe <john.doe@example.com>`
  - creationdate
  - expirationdate
  - flags
- 有効期限がない場合expirationdateは空
- creationdate/expirationdateはunix timestamp

[examples](https://keyserver.ubuntu.com/pks/lookup?search=openpgp&fingerprint=on&exact=on&options=mr&op=index)
```
info:1:100
pub:3AE29049873CC37B75A2A2B456E1C4015BC39A00:1:2048:1286980724::
uid:Quildreen Motta (lpa openpgp key) <quildreen@gmail.com>:1286980724::
```

## 7. Extended Status Codes
- HKP独自のステータスコード
- `X-HKP-Status`ヘッダ

## 8. Locating a HKP Keyserver
HKPサーバのアドレスを検出するためのDNSレコード
| Type | Host | Port |
| ---- | ---- | ---- |
| SRV | `_hkp._tcp.example.com` | 80. 443, etc. |

