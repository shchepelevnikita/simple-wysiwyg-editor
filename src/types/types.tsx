import { type ReactNode, type SyntheticEvent } from 'react';
import type React from 'react';
import { type BaseEditor, type Range } from 'slate';
import { type ReactEditor } from 'slate-react';

export type Indexable = Record<string, unknown>;

export type StringIndexable = Record<string, string>;

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

export type BlockButtonProps = MarkButtonProps;

export type ImageButtonProps = MarkButtonProps;

export type IconProps = PropsWithChildren;

export type ToolbarProps = BaseProps & PropsWithChildren;

export type MenuProps = BaseProps & PropsWithChildren;

export type PredictionProps = BaseProps & {
  predictions: string[];
};

export type CustomEditor = BaseEditor & ReactEditor;

export type Align = 'start' | 'end' | 'left' | 'right' | 'center' | 'justify' | 'match-parent';

export interface ParagraphElement {
  type: 'paragraph';
  align?: Align;
  children: CustomText[];
}

export interface HeadingElement {
  type: 'heading';
  align?: Align;
  level: number;
  children: CustomText[];
}

export interface TextElement {
  align?: Align;
  type: string;
  children: CustomText[];
}

export type CustomElement = (ParagraphElement | HeadingElement | TextElement) & Indexable;

export interface FormattedText {
  text: string;
  bold?: boolean;
  code?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export type CustomText = FormattedText;

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
