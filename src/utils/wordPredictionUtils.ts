import { type ReactEditor } from 'slate-react';
import { type BasePoint, Editor, Range } from 'slate';
import cloneDeep from 'lodash/cloneDeep';
import type {
  getCurrentWordFunctionReturnType,
  getPreviousWordFunctionReturnType
} from '../types/types';

// define word character as all EN letters, numbers, and dash
const wordRegexp = /[«».,/#!$%"^+&*;–?:{}=\-_`~()0-9A-Za-zА-Яа-я]/;

const getLeftChar = (editor: ReactEditor, point: BasePoint): string => {
  const end = Range.end(editor.selection as Range);
  return Editor.string(editor, {
    anchor: {
      path: end.path,
      offset: point.offset - 1
    },
    focus: {
      path: end.path,
      offset: point.offset
    }
  });
};

const getRightChar = (editor: ReactEditor, point: BasePoint): string => {
  const end = Range.end(editor.selection as Range);
  return Editor.string(editor, {
    anchor: {
      path: end.path,
      offset: point.offset
    },
    focus: {
      path: end.path,
      offset: point.offset + 1
    }
  });
};

export const getCurrentWord = (editor: ReactEditor): getCurrentWordFunctionReturnType => {
  const { selection } = editor; // selection is Range type

  if (selection != null) {
    const end = Range.end(selection); // end is a Point
    let currentWord = '';
    const currentPosition = cloneDeep(end);
    let startOffset = end.offset;
    let endOffset = end.offset;

    // go left from cursor until it finds the non-word character
    while (
      currentPosition.offset >= 0 &&
      getLeftChar(editor, currentPosition).match(wordRegexp) != null
    ) {
      currentWord = getLeftChar(editor, currentPosition) + currentWord;
      startOffset = currentPosition.offset - 1;
      currentPosition.offset--;
    }

    // go right from cursor until it finds the non-word character
    currentPosition.offset = end.offset;
    while (
      currentWord.length !== 0 &&
      getRightChar(editor, currentPosition).match(wordRegexp) != null
    ) {
      currentWord += getRightChar(editor, currentPosition);
      endOffset = currentPosition.offset + 1;
      currentPosition.offset++;
    }

    const currentRange: Range = {
      anchor: {
        path: end.path,
        offset: startOffset
      },
      focus: {
        path: end.path,
        offset: endOffset
      }
    };

    return {
      currentWord,
      currentRange
    };
  }

  return {
    currentWord: '',
    currentRange: {
      anchor: {
        path: [],
        offset: 0
      },
      focus: {
        path: [],
        offset: 0
      }
    }
  };
};

// get the word one before the current cursor
export const getPreviousWord = (
  editor: ReactEditor,
  currentRange: Range
): getPreviousWordFunctionReturnType => {
  const point = currentRange?.anchor;
  let word = '';
  const currentPosition = cloneDeep(point);

  if (getLeftChar(editor, currentPosition).match(wordRegexp) == null) {
    word = getLeftChar(editor, currentPosition);
    currentPosition.offset--;
  } else {
    // go left from cursor until it finds the non-word character
    while (
      currentPosition.offset >= 0 &&
      getLeftChar(editor, currentPosition).match(wordRegexp) != null
    ) {
      word = getLeftChar(editor, currentPosition) + word;
      currentPosition.offset--;
    }
  }

  const range: Range = {
    anchor: {
      path: point.path,
      offset: currentPosition.offset
    },
    focus: {
      path: point.path,
      offset: point.offset
    }
  };

  return {
    word,
    range
  };
};

export const getNthWordBefore = (
  editor: ReactEditor,
  currentRange: Range,
  n: number
): getPreviousWordFunctionReturnType => {
  while (n > 1) {
    const { range } = getPreviousWord(editor, currentRange);
    currentRange = range;
    n--;
  }
  return getPreviousWord(editor, currentRange);
};
