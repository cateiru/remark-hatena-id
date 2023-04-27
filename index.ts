import type { Plugin, Transformer } from "unified";
import type { Root, Text, Paragraph } from "mdast";
import { visit, type Visitor, type VisitorResult } from "unist-util-visit";

export const HATENA_ID_REGEX =
  /id:(?<hatena_id>[a-zA-Z0-9_-]+)(:(?<suffix>detail|image|large)+)?/;
export const HATENA_ID_REGEX_GLOBAL = new RegExp(HATENA_ID_REGEX.source, "g");

export const remarkHatenaId: Plugin<void[], Root> = () => {
  const visitor: Visitor<Text> = (node, index, parent): VisitorResult => {};

  const transformer: Transformer<Root> = (tree) => {
    visit(tree, "text", visitor);
  };

  return transformer;
};
