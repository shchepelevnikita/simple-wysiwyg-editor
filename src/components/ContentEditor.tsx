import React, {SyntheticEvent, useCallback, useEffect, useMemo, useState} from 'react';
import {BaseEditor, createEditor, Descendant, Editor, BaseRange} from 'slate';
import {Slate, Editable, withReact, ReactEditor} from 'slate-react';
import { withHistory } from 'slate-history';
import MarkButton from "./buttons/MarkButton/MarkButton";
import BlockButton from "./buttons/BlockButton/BlockButton";
import {Toolbar} from './bars/toolBar/Toolbar';
import {Leaf} from "./leaves/Leaf";
import {Element} from "./Element";
import isHotkey from 'is-hotkey';
import { PredictionBar } from './bars/predictionBar/PredictionBar';
import { getCurrentWord, getNthWordBefore, getPreviousWord } from '../utils/utils';
import axios from 'axios';
import { BASE_URL } from '../config/baseUrl';
import { Hotkeys } from '../types/types';
import { initialValue } from '../examples/example';

const HOTKEYS: Hotkeys = {
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

export const isMarkActive = (editor: Editor, format: string) => {
  const marks: any = Editor.marks(editor);
  
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
  const saveInLocalStorage = (value: Descendant[]) => {
    const content = JSON.stringify(value);
    localStorage.setItem('content', content);
  }

  const renderElement = useCallback((props: JSX.IntrinsicAttributes & { attributes: any; children: any; element: any; }) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: JSX.IntrinsicAttributes & { attributes: any; children: any; leaf: any; }) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor() as ReactEditor)), []);

  const customInsertText = (text: string) => {
    Editor.insertText(editor, text + " ");
    ReactEditor.focus(editor);
  };

  const onPredictionClick = (event: SyntheticEvent) => {
    const target = event.target as HTMLElement;
    customInsertText(target.innerText);
  };

  const [currWord, setCurrWord] = useState("");
  const [prevWord, setPrevWord] = useState("");
  const [beforeWord, setBeforeWord] = useState("");
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    setPredictions([]);
    if (currWord === "" && prevWord === " ") {
      axios({
        method: 'post',
        url: BASE_URL + '/predict',
        data: {
          word: beforeWord
        }
      }).then((response) => setPredictions(response.data));
    }
  }, [beforeWord]);

  const content = localStorage.getItem('content');

  const [value, setValue] = useState<Descendant[]>(content ? JSON.parse(content) : initialValue);

  const onValueChange = (newValue: Descendant[]) => {
    setValue(newValue);
    saveInLocalStorage(newValue);

    const { currentWord, currentRange } = getCurrentWord(editor);
    const { word: previousWord } = getPreviousWord(
      editor,
      currentRange as BaseRange
    );
    const { word: beforeWord } = getNthWordBefore(
      editor,
      currentRange as BaseRange,
      2
    );

    setCurrWord(currentWord as string);
    setPrevWord(previousWord);
    setBeforeWord(beforeWord);
  };

  const onKeyDown = (event: SyntheticEvent) => {
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event as any)) {
        event.preventDefault()

        const mark = HOTKEYS[hotkey];
        const hotkeyEnd = hotkey.slice(-1);
        if ("12345".indexOf(hotkeyEnd) !== -1) {
          const prediction = predictions[parseInt(hotkeyEnd) - 1];
          if (prediction) customInsertText(prediction);
        } else {
          toggleMark(editor, mark);
        }
      }
    }
  };

  return (
    <Slate editor={editor} value={value} onChange={onValueChange}
    >
      <Toolbar className="toolbar">
        <MarkButton format="bold" icon="format_bold" />
        <MarkButton format="italic" icon="format_italic" />
        <MarkButton format="underline" icon="format_underlined" />
        <MarkButton format="code" icon="code" />
        <MarkButton format="inlineMath" icon="functions"/>
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
      <PredictionBar predictions={predictions} onClick={onPredictionClick}/>
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
}

export default ContentEditor;
