import { type RenderElementProps } from 'slate-react';
import { ImageElement } from './ImageElement';
import { InlineMathElement } from './InlineMathElement';
import { MathElement } from './MathElement';

import './style.css';

export const Element = ({
  attributes,
  children,
  element
}: RenderElementProps): React.ReactElement => {
  const style: React.CSSProperties = { textAlign: element.align };
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote {...attributes} style={style}>
          {children}
        </blockquote>
      );
    case 'bulleted-list':
      return (
        <ul {...attributes} style={style}>
          {children}
        </ul>
      );
    case 'heading-one':
      return (
        <h1 {...attributes} style={style}>
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 {...attributes} style={style}>
          {children}
        </h2>
      );
    case 'list-item':
      return (
        <li {...attributes} style={style}>
          {children}
        </li>
      );
    case 'image':
      return (
        <ImageElement attributes={attributes} element={element}>
          {children}
        </ImageElement>
      );
    case 'numbered-list':
      return (
        <ol {...attributes} style={style}>
          {children}
        </ol>
      );
    case 'inlineMath':
      return (
        <InlineMathElement attributes={attributes} element={element}>
          {children}
        </InlineMathElement>
      );
    case 'math':
      return (
        <MathElement attributes={attributes} element={element}>
          {children}
        </MathElement>
      );
    default:
      return (
        <p {...attributes} style={style}>
          {children}
        </p>
      );
  }
};
