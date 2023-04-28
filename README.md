# remark-hatena-id

This package is a [unified](https://github.com/unifiedjs/unified) ([remark](https://github.com/remarkjs/remark)) plugin to add Hatena's id notation.

## What is id notation?

Hatena's id notation means that if you write something like `id:name`, it becomes a link.

You can also display icons together by describing them as `id:name:detail`.

For more information, see [はてな記法一覧 - はてなブログ ヘルプ](https://help.hatenablog.com/entry/text-hatena-list#%E8%87%AA%E5%8B%95%E3%83%AA%E3%83%B3%E3%82%AF).

## Installation

This package is suitable for ESM only.

```bash
npm i remark-hatena-id
```

```bash
yarn add remark-hatena-id
```

```bash
pnpm i remark-hatena-id
```

## Usage

Describe example.md using the id notation. The following is an example.

```md
# Title

Hello id:hatena !
```

```js
import { read } from "to-vfile";
import remark from "remark";
import gfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { remarkHatenaId } from "remark-hatena-id";

main();

async function main() {
  const file = await remark()
    .use(gfm)
    .use(remarkHatenaId)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(await read("example.md"));

  console.log(String(file));
}
```

Running the script should return the following results.

```html
<h1>Title</h1>
<p>Hello <a href="https://profile.hatena.ne.jp/hatena">id:hatena</a> !</p>
```

## LICENSE

[MIT](./LICENSE)
