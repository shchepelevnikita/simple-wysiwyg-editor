import React, {useCallback, useMemo, useState} from 'react';
import {BaseEditor, createEditor, Descendant, Editor} from 'slate';
import {Slate, Editable, withReact, ReactEditor} from 'slate-react';
import { withHistory } from 'slate-history';
import MarkButton from "./MarkButton/MarkButton";
import BlockButton from "./BlockButton";
import {Toolbar} from './Toolbar/Toolbar';
import {Leaf} from "./Leaf";
import {Element} from "./Element";
import isHotkey from 'is-hotkey';

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
};

export const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor);
  // @ts-ignore
  return marks ? marks[format] === true : false;
}

export const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}

type CustomElement = { type: 'paragraph'; children: CustomText[] };
type CustomText = { text: string };

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

const ContentEditor = () => {
  const renderElement = useCallback((props: JSX.IntrinsicAttributes & { attributes: any; children: any; element: any; }) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: JSX.IntrinsicAttributes & { attributes: any; children: any; leaf: any; }) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor() as ReactEditor)), []);

  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ]);

  return (
    <Slate editor={editor} value={value} onChange={(newValue) => setValue(newValue)}>
      <Toolbar className="toolbar">
        // TODO: make button generation in cycle (now it's rigid)
        <MarkButton format="bold" icon="format_bold" />
        <MarkButton format="italic" icon="format_italic" />
        <MarkButton format="underline" icon="format_underlined" />
        <MarkButton format="code" icon="code" />
        <BlockButton format="heading-one" icon="looks_one" />
        <BlockButton format="heading-two" icon="looks_two" />
        <BlockButton format="block-quote" icon="format_quote" />
        <BlockButton format="numbered-list" icon="format_list_numbered" />
        <BlockButton format="bulleted-list" icon="format_list_bulleted" />
        <BlockButton format="left" icon="format_align_left" />
        <BlockButton format="center" icon="format_align_center" />
        <BlockButton format="right" icon="format_align_right" />
        <BlockButton format="justify" icon="format_align_justify" />
      </Toolbar>
      <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some rich text…"
          spellCheck
          autoFocus
          onKeyDown={event => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event as any)) {
                event.preventDefault()
                // @ts-ignore
                const mark = HOTKEYS[hotkey];
                toggleMark(editor, mark)
              }
            }
          }}
      />
    </Slate>
  );
}

export default ContentEditor;
