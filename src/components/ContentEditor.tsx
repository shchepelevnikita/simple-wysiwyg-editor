import React, { type SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { createEditor, type Descendant, Editor, Transforms, Element as SlateElement } from 'slate';
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
import { type Align, type StringIndexable } from '../types/types';
import { ImageUploaderButton } from './buttons/ImageUploaderButton/ImageUploaderButton';
import { MathJaxContext } from 'better-react-mathjax';
import { EDITOR_MATH_JAX_CONFIG } from '../config/mathJax';
import { withAllPlugins } from '../plugins/withAllPlugins';
import { useDecorate } from '../hooks/useDecorate';
import { SetNodeToDecorations } from '../utils/codeBlockUtils';

import './style.css';
import { isBlockActive } from '../utils/utils';
import { LIST_TYPES, TEXT_ALIGN_TYPES } from '../config/const';

const HOTKEYS: StringIndexable = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code-line',
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

  const editor = useMemo(() => withAllPlugins(withHistory(withReact(createEditor()))), []);

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

  const decorate = useDecorate(editor);

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

  const onBlockButtonClick = (editor: Editor, format: string): void => {
    const isActive = isBlockActive(
      editor,
      format,
      TEXT_ALIGN_TYPES.includes(format as Align) ? 'align' : 'type'
    );
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        LIST_TYPES.includes(n.type) &&
        !TEXT_ALIGN_TYPES.includes(format as Align),
      split: true
    });

    let newProperties: Partial<SlateElement>;

    if (TEXT_ALIGN_TYPES.includes(format as Align)) {
      newProperties = {
        align: isActive ? undefined : (format as Align)
      };
    } else {
      newProperties = {
        type: isActive ? 'paragraph' : isList ? 'list-item' : format
      };
    }

    Transforms.setNodes<SlateElement>(editor, newProperties);

    if (!isActive && isList) {
      const block = { type: format, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  };

  const onCodeBlockButtonClick = (): void => {
    Transforms.wrapNodes(
      editor,
      { type: 'code-block', language: 'html', children: [] },
      {
        match: (n) => SlateElement.isElement(n) && n.type === 'paragraph',
        split: true
      }
    );
    Transforms.setNodes(
      editor,
      { type: 'code-line' },
      { match: (n) => SlateElement.isElement(n) && n.type === 'paragraph' }
    );
  };

  return (
    <Slate editor={editor} value={value} onChange={onValueChange}>
      <Toolbar className="toolbar">
        <MarkButton format="bold" icon="format_bold" />
        <MarkButton format="italic" icon="format_italic" />
        <MarkButton format="underline" icon="format_underlined" />
        <MarkButton format="code" icon="integration_instructions" />
        <BlockButton format="code-block" icon="code" onClick={onCodeBlockButtonClick} />
        <BlockButton format="math" icon="functions" onClick={onBlockButtonClick} />
        <BlockButton format="heading-one" icon="looks_one" onClick={onBlockButtonClick} />
        <BlockButton format="heading-two" icon="looks_two" onClick={onBlockButtonClick} />
        <BlockButton format="block-quote" icon="format_quote" onClick={onBlockButtonClick} />
        <BlockButton
          format="numbered-list"
          icon="format_list_numbered"
          onClick={onBlockButtonClick}
        />
        <BlockButton
          format="bulleted-list"
          icon="format_list_bulleted"
          onClick={onBlockButtonClick}
        />
        <BlockButton format="left" icon="format_align_left" onClick={onBlockButtonClick} />
        <BlockButton format="center" icon="format_align_center" onClick={onBlockButtonClick} />
        <BlockButton format="right" icon="format_align_right" onClick={onBlockButtonClick} />
        <BlockButton format="justify" icon="format_align_justify" onClick={onBlockButtonClick} />
        <ImageUploaderButton format="image" icon="image" />
      </Toolbar>
      <PredictionBar predictions={predictions} onClick={onPredictionClick} />
      <SetNodeToDecorations />
      <MathJaxContext version={3} config={EDITOR_MATH_JAX_CONFIG}>
        <Editable
          decorate={decorate}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some rich text…"
          spellCheck
          autoFocus
          onKeyDown={onKeyDown}
        />
      </MathJaxContext>
    </Slate>
  );
};

export default ContentEditor;
