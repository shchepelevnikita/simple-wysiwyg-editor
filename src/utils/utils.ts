import { Editor, Element as SlateElement, Transforms } from 'slate';

export const isBlockActive = (editor: Editor, format: any, blockType = 'type'): boolean => {
  const { selection } = editor;
  if (selection == null) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n[blockType] === format
    })
  );

  return !!match;
};

export const insertImage = (editor: Editor, base64: unknown): void => {
  Transforms.setNodes(editor, { type: 'image', base64 });
};

export const toCodeLines = (content: string): SlateElement[] =>
  content.split('\n').map((line) => ({ type: 'code-line', children: [{ text: line }] }));
