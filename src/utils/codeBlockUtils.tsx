import { useMemo } from 'react';
import {
  Editor,
  type NodeEntry,
  Element,
  Node,
  type Range,
  type Descendant,
  type BaseRange
} from 'slate';
import { useSlate } from 'slate-react';
import { type CustomElement, type CustomBaseRange } from '../types/types';

import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-java';

type PrismToken = Prism.Token;

interface Token {
  types: string[];
  content: string;
  empty?: boolean;
}

const newlineRe = /\r\n|\r|\n/;

// Empty lines need to contain a single empty token, denoted with { empty: true }
const normalizeEmptyLines = (line: Token[]): void => {
  if (line.length === 0) {
    line.push({
      types: ['plain'],
      content: '\n',
      empty: true
    });
  } else if (line.length === 1 && line[0].content === '') {
    line[0].content = '\n';
    line[0].empty = true;
  }
};

const appendTypes = (types: string[], add: string[] | string): string[] => {
  const typesSize = types.length;
  if (typesSize > 0 && types[typesSize - 1] === add) {
    return types;
  }

  return types.concat(add);
};

// Takes an array of Prism's tokens and groups them by line, turning plain
// strings into tokens as well. Tokens can become recursive in some cases,
// which means that their types are concatenated. Plain-string tokens however
// are always of type "plain".
// This is not recursive to avoid exceeding the call-stack limit, since it's unclear
// how nested Prism's tokens can become
export const normalizeTokens = (tokens: Array<PrismToken | string>): Token[][] => {
  const typeArrStack: string[][] = [[]];
  const tokenArrStack = [tokens];
  const tokenArrIndexStack = [0];
  const tokenArrSizeStack = [tokens.length];

  let i = 0;
  let stackIndex = 0;
  let currentLine: Token[] = [];

  const acc = [currentLine];

  while (stackIndex > -1) {
    while ((i = tokenArrIndexStack[stackIndex]++) < tokenArrSizeStack[stackIndex]) {
      let content;
      let types = typeArrStack[stackIndex];

      const tokenArr = tokenArrStack[stackIndex];
      const token = tokenArr[i];

      // Determine content and append type to types if necessary
      if (typeof token === 'string') {
        types = stackIndex > 0 ? types : ['plain'];
        content = token;
      } else {
        types = appendTypes(types, token.type);
        if (token.alias) {
          types = appendTypes(types, token.alias);
        }

        content = token.content;
      }

      // If token.content is an array, increase the stack depth and repeat this while-loop
      if (typeof content !== 'string') {
        stackIndex++;
        typeArrStack.push(types);
        tokenArrStack.push(content as Prism.Token[]);
        tokenArrIndexStack.push(0);
        tokenArrSizeStack.push(content.length);
        continue;
      }

      // Split by newlines
      const splitByNewlines = content.split(newlineRe);
      const newlineCount = splitByNewlines.length;

      currentLine.push({ types, content: splitByNewlines[0] });

      // Create a new line for each string on a new line
      for (let i = 1; i < newlineCount; i++) {
        normalizeEmptyLines(currentLine);
        acc.push((currentLine = []));
        currentLine.push({ types, content: splitByNewlines[i] });
      }
    }

    // Decreate the stack depth
    stackIndex--;
    typeArrStack.pop();
    tokenArrStack.pop();
    tokenArrIndexStack.pop();
    tokenArrSizeStack.pop();
  }

  normalizeEmptyLines(currentLine);
  return acc;
};

const getChildNodeToDecorations = ([block, blockPath]: NodeEntry<CustomElement>): Map<
  Descendant,
  Range[]
> => {
  const nodeToDecorations = new Map<Descendant, Range[]>();

  const text = block.children.map((value: Descendant) => Node.string(value)).join('\n');
  const language = block.language;
  const tokens = Prism.tokenize(text, Prism.languages[language as string]);
  const normalizedTokens = normalizeTokens(tokens);
  const blockChildren = block.children;

  for (let index = 0; index < normalizedTokens.length; index++) {
    const tokens = normalizedTokens[index];
    const element = blockChildren[index];

    if (!nodeToDecorations.has(element)) {
      nodeToDecorations.set(element, []);
    }

    let start = 0;
    for (const token of tokens) {
      const length = token.content.length;
      if (!length) {
        continue;
      }

      const end = start + length;

      const path = [...blockPath, index, 0];
      const range: CustomBaseRange = {
        anchor: { path, offset: start },
        focus: { path, offset: end },
        token: true,
        ...Object.fromEntries(token.types.map((type) => [type, true]))
      };

      nodeToDecorations.get(element)?.push(range);

      start = end;
    }
  }

  return nodeToDecorations;
};

export const SetNodeToDecorations = (): React.ReactElement => {
  const editor = useSlate();

  useMemo(() => {
    const blockEntries: Array<NodeEntry<CustomElement>> = Array.from(
      Editor.nodes(editor, {
        at: [],
        mode: 'highest',
        match: (n) => Element.isElement(n) && n.type === 'code-block'
      })
    );

    const nodeToDecorations = mergeMaps(...blockEntries.map(getChildNodeToDecorations));

    editor.nodeToDecorations = nodeToDecorations as Map<CustomElement, BaseRange[]>;
  }, [editor.children]);

  return <></>;
};

const mergeMaps = <K, V>(...maps: Array<Map<K, V>>): Map<K, V> => {
  const map = new Map<K, V>();

  maps.forEach((m) => {
    m.forEach((value, key) => map.set(key, value));
  });

  // console.log(map);

  return map;
};
