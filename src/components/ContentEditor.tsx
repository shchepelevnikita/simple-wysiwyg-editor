import React, { type SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { createEditor, type Descendant, Editor } from 'slate';
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  type RenderLeafProps,
  type RenderElementProps
} from 'slate-react';
import { withHistory } from 'slate-history';
import MarkButton from './buttons/MarkButton/MarkButton';
import BlockButton from './buttons/BlockButton/BlockButton';
import { Toolbar } from './bars/toolBar/Toolbar';
import { Leaf } from './leaves/Leaf';
import { Element } from './elements/Element';
import isHotkey from 'is-hotkey';
import { PredictionBar } from './bars/predictionBar/PredictionBar';
import { getCurrentWord, getNthWordBefore, getPreviousWord } from '../utils/wordPredictionUtils';
import axios from 'axios';
import { BASE_URL } from '../config/baseUrl';
import { initialValue } from '../examples/example';
import { type StringIndexable } from '../types/types';
import { ImageUploaderButton } from './buttons/ImageUploaderButton/ImageUploaderButton';

const HOTKEYS: StringIndexable = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
  'mod+1': 'prediction',
  'mod+2': 'prediction',
  'mod+3': 'prediction',
  'mod+4': 'prediction',
  'mod+5': 'prediction'
};

export const isMarkActive = (editor: Editor, format: string): boolean => {
  const marks: any = Editor.marks(editor);

  return marks ? marks[format] === true : false;
};

export const toggleMark = (editor: Editor, format: string): void => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const ContentEditor = (): JSX.Element => {
  const saveInLocalStorage = (value: Descendant[]): void => {
    const content = JSON.stringify(value);
    localStorage.setItem('content', content);
  };

  const renderElement = useCallback(
    (props: JSX.IntrinsicAttributes & RenderElementProps) => <Element {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: JSX.IntrinsicAttributes & RenderLeafProps) => <Leaf {...props} />,
    []
  );
  const editor = useMemo(() => withHistory(withReact(createEditor() as ReactEditor)), []);

  const customInsertText = (text: string): void => {
    Editor.insertText(editor, text + ' ');
    ReactEditor.focus(editor);
  };

  const onPredictionClick = (event: SyntheticEvent): void => {
    const target = event.target as HTMLElement;
    customInsertText(target.innerText);
  };

  const [currWord, setCurrWord] = useState('');
  const [prevWord, setPrevWord] = useState('');
  const [beforeWord, setBeforeWord] = useState('');
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    setPredictions([]);
    if (currWord === '' && prevWord === ' ') {
      axios({
        method: 'post',
        url: BASE_URL + '/predict',
        data: {
          word: beforeWord
        }
      })
        .then((response) => {
          setPredictions(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [beforeWord]);

  const content = localStorage.getItem('content');

  const [value, setValue] = useState<Descendant[]>(content ? JSON.parse(content) : initialValue);

  const onValueChange = (newValue: Descendant[]): void => {
    setValue(newValue);
    saveInLocalStorage(newValue);

    const { currentWord, currentRange } = getCurrentWord(editor);
    const { word: previousWord } = getPreviousWord(editor, currentRange);
    const { word: beforeWord } = getNthWordBefore(editor, currentRange, 2);

    setCurrWord(currentWord);
    setPrevWord(previousWord);
    setBeforeWord(beforeWord);
  };

  const onKeyDown = (event: SyntheticEvent): void => {
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event as any)) {
        event.preventDefault();

        const mark = HOTKEYS[hotkey];
        const hotkeyEnd = hotkey.slice(-1);
        if ('12345'.includes(hotkeyEnd)) {
          const prediction = predictions[parseInt(hotkeyEnd) - 1];
          if (prediction) customInsertText(prediction);
        } else {
          toggleMark(editor, mark);
        }
      }
    }
  };

  return (
    <Slate editor={editor} value={value} onChange={onValueChange}>
      <Toolbar className="toolbar">
        <MarkButton format="bold" icon="format_bold" />
        <MarkButton format="italic" icon="format_italic" />
        <MarkButton format="underline" icon="format_underlined" />
        <MarkButton format="code" icon="code" />
        <MarkButton format="inlineMath" icon="functions" />
        <BlockButton format="heading-one" icon="looks_one" />
        <BlockButton format="heading-two" icon="looks_two" />
        <BlockButton format="block-quote" icon="format_quote" />
        <BlockButton format="numbered-list" icon="format_list_numbered" />
        <BlockButton format="bulleted-list" icon="format_list_bulleted" />
        <BlockButton format="left" icon="format_align_left" />
        <BlockButton format="center" icon="format_align_center" />
        <BlockButton format="right" icon="format_align_right" />
        <BlockButton format="justify" icon="format_align_justify" />
        <ImageUploaderButton format="image" icon="image" />
      </Toolbar>
      <PredictionBar predictions={predictions} onClick={onPredictionClick} />
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={onKeyDown}
      />
    </Slate>
  );
};

export default ContentEditor;
