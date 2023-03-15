import { type ReactNode, type SyntheticEvent } from 'react';
import type React from 'react';
import { type Editor, type BaseEditor, type Range, type BaseRange, type Descendant } from 'slate';
import { type ReactEditor } from 'slate-react';

export type Indexable = Record<string, unknown>;

export type StringIndexable = Record<string, string>;

export interface MathViewProps {
  mathString: string;
}

export type BaseProps = Indexable & {
  className?: string;
  onClick?: (event: SyntheticEvent) => void;
};

export interface getCurrentWordFunctionReturnType {
  currentWord: string;
  currentRange: Range;
}

export interface getPreviousWordFunctionReturnType {
  word: string;
  range: Range;
}

export interface PropsWithChildren {
  children: ReactNode;
}

export type ButtonProps = BaseProps &
  PropsWithChildren & {
    active?: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
  };

export interface MarkButtonProps {
  format: string;
  icon: string;
}

export type BlockButtonProps = MarkButtonProps & {
  onClick: (editor: Editor, format: string) => void;
};

export type ImageButtonProps = MarkButtonProps;

export type IconProps = PropsWithChildren;

export type ToolbarProps = BaseProps & PropsWithChildren;

export type MenuProps = BaseProps & PropsWithChildren;

export type PredictionProps = BaseProps & {
  predictions: string[];
};

export type CustomEditor = BaseEditor &
  ReactEditor & {
    nodeToDecorations?: Map<CustomElement, Range[]>;
  };

export type Align = 'start' | 'end' | 'left' | 'right' | 'center' | 'justify' | 'match-parent';

export interface BaseElement {
  align?: Align;
  content?: string;
  language?: string;
  children: Descendant[];
}

export interface CodeBlockElement extends BaseElement {
  type: 'code-block';
}

export interface CodeLineElement extends BaseElement {
  type: 'code-line';
}

export interface ParagraphElement extends BaseElement {
  type: 'paragraph';
}

export interface HeadingElement extends BaseElement {
  type: 'heading';
  level: number;
}

export interface TextElement extends BaseElement {
  type: string;
}

export interface InlineMathElement extends BaseElement {
  type: 'inlineMath';
}

export interface MathElement extends BaseElement {
  type: 'math';
}

export type CustomElement = (
  | ParagraphElement
  | HeadingElement
  | TextElement
  | MathElement
  | InlineMathElement
  | CodeBlockElement
  | CodeLineElement
) &
  Indexable;

export interface FormattedText {
  text: string;
  bold?: boolean;
  code?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export type CustomText = FormattedText;

export type CustomBaseRange = BaseRange & {
  token?: true;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
    BaseRange: CustomBaseRange;
  }
}
