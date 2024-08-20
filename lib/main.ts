import type { Plugin } from "unified";
import type { Root, Text, Paragraph, PhrasingContent } from "mdast";
import { visit, type Visitor, VisitorResult } from "unist-util-visit";
import { u } from "unist-builder";

export const HATENA_ID_REGEX =
  /id:(?<hatenaId>[A-Za-z][0-9A-Za-z_-]{1,30}[0-9A-Za-z])(:(?<option>detail:large|detail|image))?/;
export const HATENA_ID_REGEX_GLOBAL = new RegExp(HATENA_ID_REGEX, "g");

const hatenaIdNode = (
  hatenaId: string,
  option?: string | undefined
): Paragraph => {
  const children: PhrasingContent[] = [];
  let className: string | undefined = undefined;

  if (option === "detail") {
    children.push({
      type: "image",
      url: `https://cdn.profile-image.st-hatena.com/users/${hatenaId}/profile.png`,
      data: {
        hProperties: {
          width: "16",
          height: "16",
          class: "hatena-id-icon",
        },
      },
    });
    className = "hatena-id-icon";
  } else if (option === "detail:large") {
    children.push({
      type: "image",
      url: `https://cdn.profile-image.st-hatena.com/users/${hatenaId}/profile.png`,
      data: {
        hProperties: {
          width: "60",
          height: "60",
          class: "hatena-id-icon",
        },
      },
    });
    className = "hatena-id-icon";
  } else if (option === "image") {
    children.push({
      type: "image",
      url: `https://cdn.profile-image.st-hatena.com/users/${hatenaId}/profile.png`,
      data: {
        hProperties: {
          width: "60",
          height: "60",
          class: "hatena-id-image",
        },
      },
    });
    className = "hatena-id-image";
  }

  if (option !== "image") {
    children.push({
      type: "text",
      value: `id:${hatenaId}`,
    });
  }

  return {
    type: "paragraph",
    children: children,
    data: {
      hName: "a",
      hProperties: {
        href: `https://profile.hatena.ne.jp/${hatenaId}/`,
        class: className,
        dataHatenaId: hatenaId,
      },
    },
  };
};

export const remarkHatenaId: Plugin<[], Root> = () => {
  let skip = 0;
  const visitor: Visitor<Text> = (node, index, parent): VisitorResult => {
    if (skip > 0) {
      skip--;
      return;
    }
    if (!HATENA_ID_REGEX.test(node.value)) return;
    if (!parent) return;
    if (index == null) return;

    const match = [...node.value.matchAll(HATENA_ID_REGEX_GLOBAL)];

    const children: (Text | Paragraph)[] = [];
    const value = node.value;

    let tempValue = "";
    let prevMatchIndex = 0;
    let prevMatchLength = 0;

    for (let i = 0; i < match.length; i++) {
      const m = match[i];
      const matchedIndex = m.index ?? 0;
      const matchedLength = m[0].length;
      const groups = m.groups;
      if (!groups) continue;

      const hatenaId = groups.hatenaId;
      const option: string | undefined = groups.option;

      const textPartIndex = i === 0 ? 0 : prevMatchIndex + prevMatchLength;

      prevMatchIndex = matchedIndex;
      prevMatchLength = matchedLength;

      if (matchedIndex > textPartIndex) {
        const textValue = value.substring(textPartIndex, matchedIndex);

        const textNode = u("text", textValue);
        children.push(textNode);
      }

      const inserterNode = hatenaIdNode(hatenaId, option);
      children.push(inserterNode);

      tempValue = value.slice(matchedIndex + matchedLength);
    }

    if (tempValue) {
      const textNode = u("text", tempValue);
      children.push(textNode);
    }

    if (children.length) {
      parent.children.splice(index, 1, ...children);
      skip = children.length - 1;
    }
  };

  return (tree) => {
    visit(tree, "text", visitor);
  };
};
