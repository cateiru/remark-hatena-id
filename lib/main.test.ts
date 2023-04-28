import { describe, expect, test } from "vitest";
import remarkRehype from "remark-rehype";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { remarkHatenaId } from "./main";
import rehypeStringify from "rehype-stringify";

const compiler = unified()
  .use(remarkParse)
  .use(remarkHatenaId)
  .use(remarkRehype)
  .use(rehypeStringify);

const process = async (contents: string): Promise<string> => {
  const result = await compiler.process(contents);

  return result.toString();
};

describe("no options", () => {
  test("default", async () => {
    const md = "id:hatena";
    expect(await process(md)).toBe(
      `<p><a href="https://profile.hatena.ne.jp/hatena">id:hatena</a></p>`
    );
  });

  test("multiple", async () => {
    const md = `aaa id:hatena, id:hatena2 end`;
    expect(await process(md)).toBe(
      `<p>aaa <a href="https://profile.hatena.ne.jp/hatena">id:hatena</a>, <a href="https://profile.hatena.ne.jp/hatena2">id:hatena2</a> end</p>`
    );
  });

  test("with text", async () => {
    const md = `Hello id:hatena goodbye`;
    expect(await process(md)).toBe(
      `<p>Hello <a href="https://profile.hatena.ne.jp/hatena">id:hatena</a> goodbye</p>`
    );
  });

  test("multiple line", async () => {
    const md = `id:hatena

id:hatena2 hello`;

    expect(await process(md))
      .toBe(`<p><a href="https://profile.hatena.ne.jp/hatena">id:hatena</a></p>
<p><a href="https://profile.hatena.ne.jp/hatena2">id:hatena2</a> hello</p>`);
  });
});

describe("detail", () => {
  test("default", async () => {
    const md = "id:hatena:detail";

    expect(await process(md)).toBe(
      `<p><a href="https://profile.hatena.ne.jp/hatena" class="hatena-id-icon"><img src="https://cdn.profile-image.st-hatena.com/users/hatena/profile.png" width="16" height="16" class="hatena-id-icon">id:hatena</a></p>`
    );
  });
});

describe("detail:large", () => {
  test("default", async () => {
    const md = "id:hatena:detail:large";

    expect(await process(md)).toBe(
      `<p><a href="https://profile.hatena.ne.jp/hatena" class="hatena-id-icon"><img src="https://cdn.profile-image.st-hatena.com/users/hatena/profile.png" width="60" height="60" class="hatena-id-icon">id:hatena</a></p>`
    );
  });
});

describe("image", () => {
  test("default", async () => {
    const md = "id:hatena:image";

    expect(await process(md)).toBe(
      `<p><a href="https://profile.hatena.ne.jp/hatena" class="hatena-id-image"><img src="https://cdn.profile-image.st-hatena.com/users/hatena/profile.png" width="60" height="60" class="hatena-id-image"></a></p>`
    );
  });
});
