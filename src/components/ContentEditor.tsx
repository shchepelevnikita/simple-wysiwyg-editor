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

const HOTKEYS = {
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

  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: '\\lambda' }],
    },
  ]);

  return (
    <Slate editor={editor} value={value} onChange={(newValue) => {
      setValue(newValue);
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
    }}
    >
      <Toolbar className="toolbar">
        {/* TODO: make button generation in cycle (now it's rigid) */}
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
          onKeyDown={event => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event as any)) {
                event.preventDefault()
                // @ts-ignore
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
          }}
      />
    </Slate>
  );
}

export default ContentEditor;
