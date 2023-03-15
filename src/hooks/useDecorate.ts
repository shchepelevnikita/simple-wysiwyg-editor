import { useCallback } from 'react';
import { type Editor, type Node, type Path, Element, type BaseRange } from 'slate';

export const useDecorate = (editor: Editor): (([node, path]: [Node, Path]) => BaseRange[]) => {
  return useCallback(([node, path]: [Node, Path]) => {
    if (Element.isElement(node) && node.type === 'code-line') {
      const ranges = editor.nodeToDecorations?.get(node) ?? [];
      return ranges;
    }

    return [];
  }, []);
};
