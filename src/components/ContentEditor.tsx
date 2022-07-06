import React, {useMemo, useState} from 'react';
import {BaseEditor, createEditor, Descendant} from 'slate';
import {Slate, Editable, withReact, ReactEditor} from 'slate-react';
import { withHistory } from 'slate-history';

type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CustomText = { text: string }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

const ContentEditor = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor() as ReactEditor)), []);

  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ]);

  return (
    <Slate editor={editor} value={value} onChange={(newValue) => setValue(newValue)}>
      <Editable placeholder="Enter some plain text..." />
    </Slate>
  );
}

export default ContentEditor;
