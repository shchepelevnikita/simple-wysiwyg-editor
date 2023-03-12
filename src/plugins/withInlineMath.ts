import {
  Range,
  Editor,
  Transforms,
  type Point,
  type Path,
  type BaseSelection,
  type BaseRange,
  type Node,
  Element
} from 'slate';

export const withInlineMath = (editor: Editor): Editor => {
  const { insertText, deleteBackward, isInline, isVoid } = editor;

  editor.insertText = (text) => {
    const { selection } = editor;

    if (noSelection(selection)) {
      const { anchor } = selection as BaseRange;
      const { path } = anchor;
      const blockStart = Editor.start(editor, path);
      const blockRange = { anchor, focus: blockStart };
      const blockText = Editor.string(editor, blockRange);
      const lastSpaceIndex = blockText.lastIndexOf(' ') === -1 ? 0 : blockText.lastIndexOf(' ');
      const textAfterLastSpace = blockText.slice(lastSpaceIndex);

      const [especialCharLastButOneRelativeIndex, especialCharLastRelativeIndex] =
        findLastTwoIndexOf(textAfterLastSpace, '$');

      if (
        isThereTextBetweenTwo$(especialCharLastButOneRelativeIndex, especialCharLastRelativeIndex)
      ) {
        const especialCharLastButOneIndex = especialCharLastButOneRelativeIndex + lastSpaceIndex;
        const fromLastButOneCharToEndRange = {
          anchor,
          focus: { path, offset: especialCharLastButOneIndex - blockStart.offset }
        };

        insertInlineMathAt(editor, fromLastButOneCharToEndRange);
      }
    }

    insertText(text);
  };

  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (noSelection(selection)) {
      const { anchor } = selection as BaseRange;
      const { path } = anchor;

      const endPoint = Editor.end(editor, path);

      if (
        isThereAInlineMathBlockPrevious(editor, endPoint) &&
        isCurrentPointTheStartOfLocation(editor, endPoint, path)
      ) {
        const inlineMathBlock = getPreviousBlock(editor, endPoint);
        const mathContent = Element.isElement(inlineMathBlock) && inlineMathBlock?.content;
        deleteBackward(...args);
        editor.insertText('$' + mathContent);
      } else {
        deleteBackward(...args);
      }
    }
  };

  editor.isInline = (element) => {
    return element.type === 'inlineMath' ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === 'inlineMath' ? true : isVoid(element);
  };

  return editor;
};

const isThereAInlineMathBlockPrevious = (editor: Editor, endPoint: Point): boolean | undefined => {
  const previousBlock = getPreviousBlock(editor, endPoint);
  return Element.isElement(previousBlock) && previousBlock?.type === 'inlineMath';
};

const isCurrentPointTheStartOfLocation = (editor: Editor, endPoint: Point, path: Path): boolean =>
  Editor.isStart(editor, endPoint, path);

const noSelection = (selection: BaseSelection): boolean | null =>
  selection && Range.isCollapsed(selection);

const isThereTextBetweenTwo$ = (first$Index: number, second$charIndex: number): boolean => {
  return first$Index !== -1 && second$charIndex !== 1;
};

const findLastTwoIndexOf = (string: string, char: string): [number, number] => {
  const charLastIndex = string.lastIndexOf(char);

  if (charLastIndex === -1) return [-1, -1];

  const charLastButOneIndex = string.slice(0, charLastIndex).lastIndexOf(char);

  return [charLastButOneIndex, charLastIndex];
};

const getPreviousBlock = (editor: Editor, endPoint: Point): Node | undefined => {
  const previousNode = Editor.previous(editor, { at: endPoint });
  return previousNode?.[0];
};

const insertInlineMathAt = (editor: Editor, range: BaseRange): void => {
  const content = Editor.string(editor, range);

  Transforms.select(editor, range);
  Transforms.delete(editor);
  Transforms.insertNodes(editor, {
    type: 'inlineMath',
    content: content.slice(1, -1),
    children: [{ text: '' }]
  });
};
